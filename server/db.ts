import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, "..", "data", "registrations.db");

let db: Database.Database;

export function initDatabase() {
  const dataDir = path.dirname(DB_PATH);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");

  db.exec(`
    CREATE TABLE IF NOT EXISTS registrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      event_slug TEXT NOT NULL,

      guardian_name TEXT NOT NULL,
      guardian_mobile TEXT NOT NULL,
      guardian_alt_mobile TEXT,
      guardian_email TEXT,
      district TEXT NOT NULL,
      city TEXT NOT NULL,
      address TEXT NOT NULL,
      pincode TEXT,

      participant_name TEXT NOT NULL,
      participant_dob TEXT NOT NULL,
      participant_age TEXT NOT NULL,
      participant_gender TEXT NOT NULL,
      participant_photo_path TEXT,

      special_ability_category TEXT NOT NULL,
      special_ability_description TEXT,
      requires_assistance TEXT,
      assistance_description TEXT,

      primary_talent TEXT NOT NULL,
      secondary_talents TEXT,
      talent_experience TEXT NOT NULL,
      performance_level TEXT NOT NULL,
      performed_before TEXT,
      performance_description TEXT,
      talent_details TEXT,

      audition_file_path TEXT,
      portfolio_file_path TEXT,

      travel_comfort TEXT,
      future_opportunities TEXT,
      notifications TEXT,
      instagram TEXT,
      youtube TEXT,
      facebook TEXT,
      portfolio_website TEXT,
      biography TEXT,
      achievements TEXT,
      additional_notes TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_registrations_district ON registrations(district);
    CREATE INDEX IF NOT EXISTS idx_registrations_primary_talent ON registrations(primary_talent);
    CREATE INDEX IF NOT EXISTS idx_registrations_performance_level ON registrations(performance_level);
    CREATE INDEX IF NOT EXISTS idx_registrations_talent_experience ON registrations(talent_experience);
    CREATE INDEX IF NOT EXISTS idx_registrations_special_ability ON registrations(special_ability_category);
    CREATE INDEX IF NOT EXISTS idx_registrations_travel ON registrations(travel_comfort);
    CREATE INDEX IF NOT EXISTS idx_registrations_event ON registrations(event_slug);
  `);
}

export function insertRegistration(
  body: Record<string, string>,
  filePaths: {
    participantPhoto: string | null;
    auditionFile: string | null;
    portfolioFile: string | null;
  }
): number {
  const stmt = db.prepare(`
    INSERT INTO registrations (
      event_slug,
      guardian_name, guardian_mobile, guardian_alt_mobile, guardian_email,
      district, city, address, pincode,
      participant_name, participant_dob, participant_age, participant_gender, participant_photo_path,
      special_ability_category, special_ability_description, requires_assistance, assistance_description,
      primary_talent, secondary_talents, talent_experience, performance_level,
      performed_before, performance_description, talent_details,
      audition_file_path, portfolio_file_path,
      travel_comfort, future_opportunities, notifications,
      instagram, youtube, facebook, portfolio_website,
      biography, achievements, additional_notes
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
    )
  `);

  const result = stmt.run(
    body.eventSlug || "vinootana-golden-singers",
    body.guardianName,
    body.guardianMobile,
    body.guardianAltMobile || null,
    body.guardianEmail || null,
    body.district,
    body.city,
    body.address,
    body.pincode || null,
    body.participantName,
    body.participantDob,
    body.participantAge,
    body.participantGender,
    filePaths.participantPhoto,
    body.specialAbilityCategory,
    body.specialAbilityDescription || null,
    body.requiresAssistance || null,
    body.assistanceDescription || null,
    body.primaryTalent,
    body.secondaryTalents || "[]",
    body.talentExperience,
    body.performanceLevel,
    body.performedBefore || null,
    body.performanceDescription || null,
    body.talentDetails || "{}",
    filePaths.auditionFile,
    filePaths.portfolioFile,
    body.travelComfort || null,
    body.futureOpportunities || null,
    body.notifications || null,
    body.instagram || null,
    body.youtube || null,
    body.facebook || null,
    body.portfolioWebsite || null,
    body.biography || null,
    body.achievements || null,
    body.additionalNotes || null
  );

  return Number(result.lastInsertRowid);
}

export function searchRegistrations(filters: {
  district?: string;
  primaryTalent?: string;
  performanceLevel?: string;
  talentExperience?: string;
  specialAbilityCategory?: string;
  travelComfort?: string;
}) {
  let query = "SELECT * FROM registrations WHERE 1=1";
  const params: string[] = [];

  if (filters.district) {
    query += " AND district = ?";
    params.push(filters.district);
  }
  if (filters.primaryTalent) {
    query += " AND primary_talent = ?";
    params.push(filters.primaryTalent);
  }
  if (filters.performanceLevel) {
    query += " AND performance_level = ?";
    params.push(filters.performanceLevel);
  }
  if (filters.talentExperience) {
    query += " AND talent_experience = ?";
    params.push(filters.talentExperience);
  }
  if (filters.specialAbilityCategory) {
    query += " AND special_ability_category = ?";
    params.push(filters.specialAbilityCategory);
  }
  if (filters.travelComfort) {
    query += " AND travel_comfort = ?";
    params.push(filters.travelComfort);
  }

  query += " ORDER BY created_at DESC";

  return db.prepare(query).all(...params);
}
