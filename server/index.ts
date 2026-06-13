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

async function sendEmail(
  data: Record<string, string>,
  attachments: { filename: string; path: string }[]
) {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("SMTP not configured — registration saved to database only.");
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: RECIPIENT_EMAIL,
    subject: `Vinootana Golden Singers — New Registration: ${data.participantName}`,
    text: buildEmailBody(data),
    attachments,
  });
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

      const id = insertRegistration(body, filePaths);

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

      await sendEmail(emailData, attachments);

      res.json({ success: true, id });
    } catch (err) {
      console.error("Registration error:", err);
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
// Uses regex pattern to match any route that isn't an API route
app.use((req, res) => {
  const indexPath = path.join(DIST_DIR, "index.html");
  
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    // Fallback if dist/index.html doesn't exist (development mode)
    res.status(404).json({ 
      error: "Not found",
      message: "dist/index.html not found. Make sure to run 'npm run build' before deploying." 
    });
  }
});

// ============================================================================
// START SERVER
// ============================================================================

app.listen(PORT, () => {
  console.log(`🚀 API server running on http://localhost:${PORT}`);
  console.log(`📦 Environment: ${process.env.NODE_ENV || "development"}`);
});