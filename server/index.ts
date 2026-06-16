import express from "express";
import cors from "cors";
import multer from "multer";
import nodemailer from "nodemailer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { initDatabase, insertRegistration, searchRegistrations } from "./db.ts";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app          = express();
const PORT         = process.env.PORT || 3001;
const UPLOAD_DIR   = path.join(__dirname, "..", "uploads");
const DIST_DIR     = path.join(__dirname, "..", "dist");
const RECIPIENT_EMAIL = process.env.RECIPIENT_EMAIL || "vinoothanagoldensingers@gmail.com";

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

initDatabase();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename:    (_req,  file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}-${file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_")}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 },
});

// ============================================================================
// SMTP — transporter factory
// ============================================================================

/**
 * ROOT CAUSE OF ESOCKET:
 *   The previous version pre-resolved "smtp.sendgrid.net" to a raw IPv4
 *   address (46.137.211.255) and passed that IP as `host`. This broke TLS
 *   because SendGrid's certificate is issued to "smtp.sendgrid.net", not
 *   to any IP address. Node/OpenSSL cannot match "IP: 46.137.211.255"
 *   against the cert's altNames → ESOCKET "Hostname/IP does not match
 *   certificate's altnames".
 *
 * FIX:
 *   Always pass the hostname string as `host`. The TLS library uses the
 *   hostname for SNI (Server Name Indication) and certificate validation
 *   automatically. We also set `tls.servername` explicitly to the same
 *   hostname as a belt-and-suspenders measure.
 *
 *   No DNS pre-resolution is needed. Node resolves the hostname internally
 *   and always connects over IPv4 or IPv6 — either works fine for TLS as
 *   long as cert validation uses the hostname, not the IP.
 */
function createEmailTransporter(): nodemailer.Transporter | null {
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpHost || !smtpUser || !smtpPass) {
    console.error(
      "❌ Cannot create transporter — missing: " +
      [!smtpHost && "SMTP_HOST", !smtpUser && "SMTP_USER", !smtpPass && "SMTP_PASS"]
        .filter(Boolean).join(", ")
    );
    return null;
  }

  const port   = Number(process.env.SMTP_PORT || 587);
  const secure = process.env.SMTP_SECURE === "true"; // true only for port 465

  console.log(
    `🔧 Creating SMTP transporter → ${smtpHost}:${port} ` +
    `(secure=${secure}, requireTLS=${!secure}, user=${smtpUser})`
  );

  return nodemailer.createTransport({
    pool: true,           // top-level → selects SMTPPool.Options overload
    host: smtpHost,       // ALWAYS the hostname string, never a raw IP
    port,
    secure,               // false for port 587
    requireTLS: !secure,  // true for port 587 → enforces STARTTLS upgrade
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
    connectionTimeout: 15_000,
    greetingTimeout:   15_000,
    socketTimeout:     20_000,
    maxConnections: 2,
    maxMessages:   50,
    rateDelta:   2_000,
    rateLimit:       3,
    tls: {
      // Explicitly tell OpenSSL which hostname to validate in the TLS cert.
      // This ensures cert validation always uses the hostname (smtp.sendgrid.net)
      // regardless of how the TCP socket was resolved internally.
      servername:         smtpHost,
      rejectUnauthorized: true,
      minVersion:         "TLSv1.2",
    } as import("tls").ConnectionOptions,
    logger: false,
    debug:  false,
  });
}

// ============================================================================
// EMAIL BODY BUILDER
// ============================================================================

function buildEmailBody(data: Record<string, string>): string {
  const sections: [string, [string, string][]][] = [
    ["GUARDIAN INFORMATION", [
      ["Guardian Full Name",    data.guardianName],
      ["Mobile Number",         data.guardianMobile],
      ["Alternate Mobile",      data.guardianAltMobile],
      ["Email Address",         data.guardianEmail],
      ["District",              data.district],
      ["City / Taluk",          data.city],
      ["Complete Address",      data.address],
      ["Pincode",               data.pincode],
    ]],
    ["PARTICIPANT INFORMATION", [
      ["Participant Full Name",  data.participantName],
      ["Date of Birth",          data.participantDob],
      ["Age",                    data.participantAge],
      ["Gender",                 data.participantGender],
    ]],
    ["SPECIAL ABILITY INFORMATION", [
      ["Category",               data.specialAbilityCategory],
      ["Additional Description", data.specialAbilityDescription],
      ["Requires Assistance",    data.requiresAssistance],
      ["Assistance Description", data.assistanceDescription],
    ]],
    ["TALENT INFORMATION", [
      ["Primary Talent",         data.primaryTalent],
      ["Secondary Talents",      data.secondaryTalents],
      ["Talent Experience",      data.talentExperience],
      ["Performance Level",      data.performanceLevel],
      ["Performed Before",       data.performedBefore],
      ["Performance Description",data.performanceDescription],
      ["Talent Details",         data.talentDetails],
    ]],
    ["AVAILABILITY & FUTURE OPPORTUNITIES", [
      ["Travel Across Karnataka", data.travelComfort],
      ["Future Opportunities",    data.futureOpportunities],
      ["Notifications",           data.notifications],
      ["Instagram",               data.instagram],
      ["YouTube",                 data.youtube],
      ["Facebook",                data.facebook],
      ["Portfolio Website",       data.portfolioWebsite],
      ["Biography",               data.biography],
      ["Achievements",            data.achievements],
      ["Additional Notes",        data.additionalNotes],
    ]],
  ];

  let text  = `VINOOTANA GOLDEN SINGERS — NEW REGISTRATION\n`;
  text     += `Event    : ${data.eventSlug}\n`;
  text     += `Submitted: ${new Date().toISOString()}\n\n`;

  for (const [title, fields] of sections) {
    text += `${title}\n${"=".repeat(title.length)}\n`;
    for (const [label, value] of fields) {
      if (value) text += `${label}: ${value}\n`;
    }
    text += "\n";
  }

  text += "UPLOADED FILES\n==============\n";
  if (data.participantPhotoPath) text += `Participant Photo : ${data.participantPhotoPath}\n`;
  if (data.auditionFilePath)     text += `Audition File    : ${data.auditionFilePath}\n`;
  if (data.portfolioFilePath)    text += `Portfolio File   : ${data.portfolioFilePath}\n`;

  return text;
}

// ============================================================================
// FIRE-AND-FORGET EMAIL SENDER
// ============================================================================

async function sendEmailAsync(
  id:          string,
  data:        Record<string, string>,
  attachments: { filename: string; path: string }[],
): Promise<void> {
  const transporter = createEmailTransporter();
  if (!transporter) {
    console.warn(`⚠️  [Reg #${id}] No transporter — skipping email.`);
    return;
  }

  // SMTP_FROM may be "Display Name <addr>" — used only in mail headers, not SMTP auth.
  const fromField = process.env.SMTP_FROM || process.env.SMTP_USER;

  try {
    console.log(`🔐 [Reg #${id}] Verifying SMTP credentials ...`);
    await transporter.verify();
    console.log(`✅ [Reg #${id}] SMTP auth OK`);

    console.log(`📨 [Reg #${id}] Sending → ${RECIPIENT_EMAIL} ...`);
    const info = await transporter.sendMail({
      from:        fromField,
      to:          RECIPIENT_EMAIL,
      subject:     `Vinootana Golden Singers — New Registration: ${data.participantName}`,
      text:        buildEmailBody(data),
      attachments,
    });

    console.log(`✅ [Reg #${id}] Email sent! Message-ID: ${info.messageId}`);
  } catch (err) {
    const errorMsg      = err instanceof Error ? err.message                     : String(err);
    const errorCode     = (err as NodeJS.ErrnoException)?.code                  ?? "UNKNOWN";
    const errorResponse = (err as { response?:     string })?.response           ?? "";
    const errorCommand  = (err as { command?:      string })?.command            ?? "";
    const errorRespCode = (err as { responseCode?: number })?.responseCode       ?? "";

    console.error(`❌ [Reg #${id}] Email FAILED — data is safely stored in SQLite.`);
    console.error(`   Code         : ${errorCode}`);
    console.error(`   Response Code: ${errorRespCode}`);
    console.error(`   SMTP Command : ${errorCommand}`);
    console.error(`   SMTP Response: ${errorResponse}`);
    console.error(`   Message      : ${errorMsg}`);
  } finally {
    try { transporter.close(); } catch (_) { /* pool close */ }
  }
}

// ============================================================================
// API ROUTES  (before static middleware)
// ============================================================================

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    status:         "ok",
    smtpHost:       process.env.SMTP_HOST ?? "not configured",
    smtpUser:       process.env.SMTP_USER ?? "not configured",
    recipient:      RECIPIENT_EMAIL,
  });
});

app.post(
  "/api/registrations",
  upload.fields([
    { name: "participantPhoto", maxCount: 1 },
    { name: "auditionFile",     maxCount: 1 },
    { name: "portfolioFile",    maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const body  = req.body  as Record<string, string>;
      const files = req.files as Record<string, Express.Multer.File[]>;

      if (!body.guardianName || !body.participantName || !body.district) {
        res.status(400).json({ error: "Missing required fields" });
        return;
      }

      const filePaths = {
        participantPhoto: files.participantPhoto?.[0]?.filename ?? null,
        auditionFile:     files.auditionFile?.[0]?.filename     ?? null,
        portfolioFile:    files.portfolioFile?.[0]?.filename    ?? null,
      };

      const id = insertRegistration(body, filePaths);
      console.log(`✅ [Reg #${id}] Saved to SQLite`);

      const emailData = {
        ...body,
        participantPhotoPath: filePaths.participantPhoto ?? "",
        auditionFilePath:     filePaths.auditionFile     ?? "",
        portfolioFilePath:    filePaths.portfolioFile    ?? "",
      };

      const attachments = Object.values(files)
        .flat()
        .map((f) => ({ filename: f.originalname, path: f.path }));

      sendEmailAsync(String(id), emailData, attachments).catch((err) =>
        console.error(`❌ [Reg #${id}] Uncaught async email error:`, err)
      );

      res.json({ success: true, id });
    } catch (err) {
      console.error("❌ Registration handler error:", err);
      res.status(500).json({ error: "Failed to process registration" });
    }
  }
);

app.get("/api/registrations/search", (req, res) => {
  try {
    const results = searchRegistrations({
      district:               req.query.district               as string | undefined,
      primaryTalent:          req.query.primaryTalent          as string | undefined,
      performanceLevel:       req.query.performanceLevel       as string | undefined,
      talentExperience:       req.query.talentExperience       as string | undefined,
      specialAbilityCategory: req.query.specialAbilityCategory as string | undefined,
      travelComfort:          req.query.travelComfort          as string | undefined,
    });
    res.json({ results, count: results.length });
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Search failed" });
  }
});

// ============================================================================
// STATIC FILES & SPA FALLBACK
// ============================================================================

if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR, { maxAge: "1d" }));
  console.log(`📁 Serving static files from: ${DIST_DIR}`);
} else {
  console.warn(`⚠️  dist/ not found at ${DIST_DIR} — run "npm run build" first`);
}

app.use((_req, res) => {
  const indexPath = path.join(DIST_DIR, "index.html");
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).json({ error: 'Not found — run "npm run build" before deploying.' });
  }
});

// ============================================================================
// SERVER START
// ============================================================================

/**
 * RENDER DEPLOYMENT FIX — two issues resolved:
 *
 * 1. The previous startServer() awaited transporter.verify() BEFORE calling
 *    app.listen(). On Render, outbound port 587 is blocked so verify() hung
 *    for ~30s, causing "No open ports detected" and a failed deploy.
 *    Fix: bind the HTTP port first, run SMTP check in the background after.
 *
 * 2. Render free tier blocks outbound port 587 (STARTTLS/SMTP).
 *    Fix: use port 465 (SMTPS/SSL) which Render allows.
 *    Set these in your Render environment variables:
 *      SMTP_PORT=465
 *      SMTP_SECURE=true
 */
function runSmtpCheckInBackground(): void {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("\u26a0\ufe0f  SMTP not fully configured \u2014 email notifications disabled.");
    return;
  }

  const testTransporter = createEmailTransporter();
  if (!testTransporter) return;

  console.log("\ud83d\udd0d Testing SMTP connection in background ...");

  testTransporter.verify()
    .then(() => {
      console.log("\u2705 SMTP credentials verified \u2014 email is ready to send.");
    })
    .catch((err: unknown) => {
      const msg      = err instanceof Error ? err.message : String(err);
      const code     = (err as NodeJS.ErrnoException)?.code ?? "";
      const response = (err as { response?: string })?.response ?? "";
      console.error("\u274c SMTP background check FAILED \u2014 emails will not send.");
      console.error(`   Code    : ${code}`);
      console.error(`   Response: ${response}`);
      console.error(`   Message : ${msg}`);
      if (code === "ETIMEDOUT") {
        console.error("   \u25ba ETIMEDOUT: your host is blocking port 587.");
        console.error("     Switch to port 465 in your environment variables:");
        console.error("     SMTP_PORT=465 and SMTP_SECURE=true");
      } else {
        console.error("   \u25ba Check your SMTP_PASS (SendGrid API key) is valid.");
        console.error("   \u25ba https://app.sendgrid.com/settings/api_keys");
      }
    })
    .finally(() => {
      try { testTransporter.close(); } catch (_) { /* ignore */ }
    });
}

// Bind HTTP port FIRST — never block it on SMTP.
app.listen(PORT, () => {
  const line = "\u2550".repeat(60);
  console.log(`\n${line}`);
  console.log(`\ud83d\ude80  Server    : http://localhost:${PORT}`);
  console.log(`\ud83d\udce6  Env       : ${process.env.NODE_ENV || "development"}`);
  console.log(`\ud83d\udce7  SMTP host : ${process.env.SMTP_HOST ?? "NOT SET"} port ${process.env.SMTP_PORT || 587}`);
  console.log(`\ud83d\udce4  Recipient : ${RECIPIENT_EMAIL}`);
  console.log(`${line}\n`);

  // Non-blocking — runs after port is already bound and Render is happy
  runSmtpCheckInBackground();
});
