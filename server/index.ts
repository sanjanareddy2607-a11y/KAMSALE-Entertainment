import express from "express";
import cors from "cors";
import multer from "multer";
import { Resend } from "resend";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { initDatabase, insertRegistration, searchRegistrations } from "./db.ts";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app             = express();
const PORT            = process.env.PORT || 3001;
const UPLOAD_DIR      = path.join(__dirname, "..", "uploads");
const DIST_DIR        = path.join(__dirname, "..", "dist");
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
// RESEND — email client factory
// ============================================================================

/**
 * WHY RESEND INSTEAD OF SMTP:
 *   Render's free plan blocks all outbound SMTP ports (25, 465, 587) at the
 *   network level. No nodemailer/SendGrid configuration can work around this
 *   because the TCP connection itself never reaches the mail server.
 *
 *   Resend sends email over HTTPS (port 443), which Render never blocks.
 *   Free tier: 3,000 emails/month, 100/day — plenty for registration events.
 *
 * FREE TIER RESTRICTION:
 *   On Resend's free plan you can only send TO your own verified email address
 *   unless you add and verify a custom domain. Since RECIPIENT_EMAIL is your
 *   own address (vinoothanagoldensingers@gmail.com), verify it in Resend under
 *   Emails → Add Email Address, then set FROM to: onboarding@resend.dev
 *
 *   If you add a custom domain later, change FROM to: noreply@yourdomain.com
 */
function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("❌ RESEND_API_KEY not set — email notifications disabled.");
    return null;
  }
  return new Resend(apiKey);
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
  const resend = getResendClient();
  if (!resend) {
    console.warn(`⚠️  [Reg #${id}] No Resend client — skipping email.`);
    return;
  }

  // Read each uploaded file into a Buffer for the Resend attachments API.
  // Resend does not accept file paths — it needs the raw content.
  const resendAttachments = attachments.map((a) => ({
    filename: a.filename,
    content:  fs.readFileSync(a.path),
  }));

  try {
    console.log(`📨 [Reg #${id}] Sending via Resend → ${RECIPIENT_EMAIL} ...`);

    const { data: result, error } = await resend.emails.send({
      // FREE TIER: use onboarding@resend.dev as FROM until you verify a domain.
      // After verifying a custom domain, change this to: noreply@yourdomain.com
      from:        "Kamsale Entertainment <onboarding@resend.dev>",
      to:          [RECIPIENT_EMAIL],
      subject:     `Vinootana Golden Singers — New Registration: ${data.participantName}`,
      text:        buildEmailBody(data),
      attachments: resendAttachments,
    });

    if (error) {
      console.error(`❌ [Reg #${id}] Resend returned an error:`);
      console.error(`   Name   : ${error.name}`);
      console.error(`   Message: ${error.message}`);
    } else {
      console.log(`✅ [Reg #${id}] Email sent! Resend ID: ${result?.id}`);
    }
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error(`❌ [Reg #${id}] Email FAILED — data is safely stored in SQLite.`);
    console.error(`   Message: ${errorMsg}`);
  }
}

// ============================================================================
// API ROUTES  (before static middleware)
// ============================================================================

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    status:    "ok",
    emailMode: process.env.RESEND_API_KEY ? "resend ✅" : "disabled ❌",
    recipient: RECIPIENT_EMAIL,
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
 * RENDER FREE PLAN — why this works now:
 *
 *   Old approach used nodemailer over SMTP (ports 465 / 587).
 *   Render's free plan blocks ALL outbound SMTP ports at the network level,
 *   so every verify() call timed out and email never sent.
 *
 *   New approach uses Resend's HTTP API (port 443 / HTTPS).
 *   Render never blocks port 443 — the same port your web server listens on.
 *   No background connection check is needed; the API call happens only when
 *   a registration is submitted, so startup is instant.
 */
app.listen(PORT, () => {
  const line = "═".repeat(60);
  console.log(`\n${line}`);
  console.log(`🚀  Server    : http://localhost:${PORT}`);
  console.log(`📦  Env       : ${process.env.NODE_ENV || "development"}`);
  console.log(`📧  Email     : ${process.env.RESEND_API_KEY ? "Resend API ✅" : "RESEND_API_KEY not set ❌"}`);
  console.log(`📤  Recipient : ${RECIPIENT_EMAIL}`);
  console.log(`${line}\n`);
});