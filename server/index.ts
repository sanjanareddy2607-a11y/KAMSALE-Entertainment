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
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const UPLOAD_DIR = path.join(__dirname, "..", "uploads");
const DIST_DIR = path.join(__dirname, "..", "dist");
const RECIPIENT_EMAIL =
  process.env.RECIPIENT_EMAIL || "vinoothanagoldensingers@gmail.com";

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

initDatabase();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}-${file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_")}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 },
});

app.use(cors());
app.use(express.json());

// ============================================================================
// SMTP CONFIGURATION WITH RENDER IPv4 COMPATIBILITY
// ============================================================================

let transporter: nodemailer.Transporter | null = null;
let smtpVerified = false;

async function initializeEmailTransporter() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("⚠️  SMTP credentials not configured — email notifications disabled.");
    console.warn("   Set SMTP_HOST, SMTP_USER, SMTP_PASS in environment variables.");
    return;
  }

  console.log(`📧 Initializing SMTP transporter...`);
  console.log(`   Host: ${process.env.SMTP_HOST}`);
  console.log(`   Port: ${process.env.SMTP_PORT || 587}`);
  console.log(`   Secure: ${process.env.SMTP_SECURE === "true"}`);
  console.log(`   IPv4 Mode: ENABLED (family: 4)`);

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    // RENDER COMPATIBILITY: Force IPv4 only
    family: 4,
    // Connection settings
    connectionTimeout: 15000, // 15 seconds for connection
    socketTimeout: 15000, // 15 seconds for socket
    // Connection pool
    pool: {
      maxConnections: 3,
      maxMessages: 100,
      rateDelta: 1000,
      rateLimit: 5,
    },
    // Disable TLS for debugging if needed (usually keep enabled)
    tls: {
      rejectUnauthorized: true,
    },
  });

  // Verify SMTP connection before starting server
  try {
    const verified = await transporter.verify();
    if (verified) {
      console.log("✅ SMTP connection verified successfully!");
      console.log(`✅ Email will be sent to: ${RECIPIENT_EMAIL}`);
      smtpVerified = true;
    }
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    const errorCode = (err as any)?.code || "UNKNOWN";
    console.error("❌ SMTP verification FAILED!");
    console.error(`   Code: ${errorCode}`);
    console.error(`   Error: ${errorMsg}`);
    console.error(`   Host: ${process.env.SMTP_HOST}`);
    console.error(`   Port: ${process.env.SMTP_PORT || 587}`);
    console.error("");
    console.error("   Common fixes:");
    console.error("   1. Ensure SMTP_HOST, SMTP_USER, SMTP_PASS are correct");
    console.error("   2. For Gmail: Use App Password (not regular password)");
    console.error("   3. Verify port 587 is reachable (SMTP_PORT=587)");
    console.error("   4. Enable SMTP_SECURE=false for port 587");
    console.error("");
    smtpVerified = false;
  }
}

function buildEmailBody(data: Record<string, string>) {
  const sections = [
    ["GUARDIAN INFORMATION", [
      ["Guardian Full Name", data.guardianName],
      ["Mobile Number", data.guardianMobile],
      ["Alternate Mobile", data.guardianAltMobile],
      ["Email Address", data.guardianEmail],
      ["District", data.district],
      ["City / Taluk", data.city],
      ["Complete Address", data.address],
      ["Pincode", data.pincode],
    ]],
    ["PARTICIPANT INFORMATION", [
      ["Participant Full Name", data.participantName],
      ["Date of Birth", data.participantDob],
      ["Age", data.participantAge],
      ["Gender", data.participantGender],
    ]],
    ["SPECIAL ABILITY INFORMATION", [
      ["Category", data.specialAbilityCategory],
      ["Additional Description", data.specialAbilityDescription],
      ["Requires Assistance", data.requiresAssistance],
      ["Assistance Description", data.assistanceDescription],
    ]],
    ["TALENT INFORMATION", [
      ["Primary Talent", data.primaryTalent],
      ["Secondary Talents", data.secondaryTalents],
      ["Talent Experience", data.talentExperience],
      ["Performance Level", data.performanceLevel],
      ["Performed Before", data.performedBefore],
      ["Performance Description", data.performanceDescription],
      ["Talent Details", data.talentDetails],
    ]],
    ["AVAILABILITY & FUTURE OPPORTUNITIES", [
      ["Travel Across Karnataka", data.travelComfort],
      ["Future Opportunities", data.futureOpportunities],
      ["Notifications", data.notifications],
      ["Instagram", data.instagram],
      ["YouTube", data.youtube],
      ["Facebook", data.facebook],
      ["Portfolio Website", data.portfolioWebsite],
      ["Biography", data.biography],
      ["Achievements", data.achievements],
      ["Additional Notes", data.additionalNotes],
    ]],
  ];

  let text = `VINOOTANA GOLDEN SINGERS — NEW REGISTRATION\n`;
  text += `Event: ${data.eventSlug}\n`;
  text += `Submitted: ${new Date().toISOString()}\n\n`;

  for (const [title, fields] of sections) {
    text += `${title}\n${"=".repeat(title.length)}\n`;
    for (const [label, value] of fields) {
      if (value) text += `${label}: ${value}\n`;
    }
    text += "\n";
  }

  text += `UPLOADED FILES\n==============\n`;
  if (data.participantPhotoPath) text += `Participant Photo: ${data.participantPhotoPath}\n`;
  if (data.auditionFilePath) text += `Audition File: ${data.auditionFilePath}\n`;
  if (data.portfolioFilePath) text += `Portfolio File: ${data.portfolioFilePath}\n`;

  return text;
}

// Non-blocking async email sender
async function sendEmailAsync(
  id: string,
  data: Record<string, string>,
  attachments: { filename: string; path: string }[]
) {
  if (!transporter) {
    console.warn(`⚠️  [Reg #${id}] SMTP not configured — skipping email.`);
    return;
  }

  try {
    console.log(`📨 [Reg #${id}] Sending email to ${RECIPIENT_EMAIL}...`);
    
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: RECIPIENT_EMAIL,
      subject: `Vinootana Golden Singers — New Registration: ${data.participantName}`,
      text: buildEmailBody(data),
      attachments,
    });
    
    console.log(`✅ [Reg #${id}] Email sent successfully! (Message ID: ${info.messageId})`);
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    const errorCode = (err as any)?.code || "UNKNOWN";
    console.error(`❌ [Reg #${id}] Email sending failed (registration still saved)`);
    console.error(`   Code: ${errorCode}`);
    console.error(`   Error: ${errorMsg}`);
  }
}

// ============================================================================
// API ROUTES (defined BEFORE static middleware to take priority)
// ============================================================================

app.post(
  "/api/registrations",
  upload.fields([
    { name: "participantPhoto", maxCount: 1 },
    { name: "auditionFile", maxCount: 1 },
    { name: "portfolioFile", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const body = req.body as Record<string, string>;
      const files = req.files as Record<string, Express.Multer.File[]>;

      if (!body.guardianName || !body.participantName || !body.district) {
        res.status(400).json({ error: "Missing required fields" });
        return;
      }

      const filePaths = {
        participantPhoto: files.participantPhoto?.[0]?.filename ?? null,
        auditionFile: files.auditionFile?.[0]?.filename ?? null,
        portfolioFile: files.portfolioFile?.[0]?.filename ?? null,
      };

      // ✅ SAVE TO DATABASE FIRST
      const id = insertRegistration(body, filePaths);
      console.log(`✅ [Reg #${id}] Saved to SQLite database`);

      const emailData = {
        ...body,
        participantPhotoPath: filePaths.participantPhoto ?? "",
        auditionFilePath: filePaths.auditionFile ?? "",
        portfolioFilePath: filePaths.portfolioFile ?? "",
      };

      const attachments = Object.values(files)
        .flat()
        .map((f) => ({
          filename: f.originalname,
          path: f.path,
        }));

      // ✅ SEND EMAIL NON-BLOCKING (fire and forget)
      // This does NOT await, so email failures never block the response
      sendEmailAsync(String(id), emailData, attachments).catch((err) => {
        console.error(`❌ [Reg #${id}] Uncaught email error:`, err);
      });

      // ✅ ALWAYS RETURN SUCCESS if database save succeeded
      console.log(`✅ [Reg #${id}] Registration request completed successfully`);
      res.json({ success: true, id });
    } catch (err) {
      console.error("❌ Registration error:", err);
      res.status(500).json({ error: "Failed to process registration" });
    }
  }
);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/registrations/search", (req, res) => {
  try {
    const results = searchRegistrations({
      district: req.query.district as string | undefined,
      primaryTalent: req.query.primaryTalent as string | undefined,
      performanceLevel: req.query.performanceLevel as string | undefined,
      talentExperience: req.query.talentExperience as string | undefined,
      specialAbilityCategory: req.query.specialAbilityCategory as
        | string
        | undefined,
      travelComfort: req.query.travelComfort as string | undefined,
    });
    res.json({ results, count: results.length });
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Search failed" });
  }
});

// ============================================================================
// STATIC FILES & SPA FALLBACK (for Vite build in production)
// ============================================================================

// Serve static files from the dist folder
if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR, { maxAge: "1d" }));
  console.log(`📁 Serving static files from: ${DIST_DIR}`);
} else {
  console.warn(`⚠️  dist folder not found at ${DIST_DIR} — static files will not be served`);
}

// SPA Fallback: Route all unknown requests to dist/index.html
app.use((req, res) => {
  const indexPath = path.join(DIST_DIR, "index.html");
  
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).json({ 
      error: "Not found",
      message: "dist/index.html not found. Make sure to run 'npm run build' before deploying." 
    });
  }
});

// ============================================================================
// START SERVER
// ============================================================================

async function startServer() {
  // Initialize SMTP first
  await initializeEmailTransporter();

  // Then start the server
  app.listen(PORT, () => {
    console.log("");
    console.log("════════════════════════════════════════════════════════════");
    console.log(`🚀 API server running on http://localhost:${PORT}`);
    console.log(`📦 Environment: ${process.env.NODE_ENV || "development"}`);
    if (smtpVerified) {
      console.log(`📧 Email notifications: ENABLED`);
    } else {
      console.log(`📧 Email notifications: DISABLED (SMTP verification failed)`);
    }
    console.log("════════════════════════════════════════════════════════════");
    console.log("");
  });
}

startServer();