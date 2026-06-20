export type YesNo = "yes" | "no";
export type YesNoMaybe = "yes" | "no" | "maybe";

export type SpecialAbilityCategory =
  | "Visual Impairment"
  | "Hearing Impairment"
  | "Speech Impairment"
  | "Locomotor Disability"
  | "Intellectual Disability"
  | "Autism Spectrum"
  | "Multiple Disabilities"
  | "Other";

export type PrimaryTalent =
  | "Singing"
  | "Acting"
  | "Dance"
  | "Choreography"
  | "Direction"
  | "Cinematography"
  | "Anchoring"
  | "Public Speaking"
  | "Mimicry"
  | "Instrumental Music"
  | "Writing"
  | "Comedy"
  | "Stage Performance"
  | "Other";

export type TalentExperience =
  | "Less than 6 Months"
  | "6 Months - 1 Year"
  | "1 - 3 Years"
  | "3 - 5 Years"
  | "5+ Years"
  | "Self-Taught";

export type PerformanceLevel =
  | "Beginner"
  | "Intermediate"
  | "Advanced"
  | "Professional";

export interface SingingDetails {
  preferredLanguage: string;
  singingStyle: string;
  favoriteSinger: string;
}

export interface DanceDetails {
  danceStyle: string;
  yearsOfExperience: string;
  canPerformSolo: YesNo;
  canPerformGroup: YesNo;
}

export interface ActingDetails {
  interestedIn: string[];
  previousExperience: string;
}

export interface ChoreographyDetails {
  yearsOfExperience: string;
  numberOfPerformances: string;
  description: string;
}

export interface DirectionDetails {
  interestedIn: string[];
  experienceDescription: string;
}

export interface CinematographyDetails {
  experienceLevel: PerformanceLevel;
  equipmentFamiliarity: string[];
}

export interface TalentDetails {
  singing?: SingingDetails;
  dance?: DanceDetails;
  acting?: ActingDetails;
  choreography?: ChoreographyDetails;
  direction?: DirectionDetails;
  cinematography?: CinematographyDetails;
}

export interface RegistrationFormData {
  guardianName: string;
  guardianMobile: string;
  guardianAltMobile: string;
  guardianEmail: string;
  district: string;
  city: string;
  address: string;
  pincode: string;

  participantName: string;
  participantDob: string;
  participantAge: string;
  participantGender: string;
  participantPhoto: File | null;

  specialAbilityCategory: SpecialAbilityCategory | "";
  specialAbilityDescription: string;
  requiresAssistance: YesNo | "";
  assistanceDescription: string;

  primaryTalent: PrimaryTalent | "";
  secondaryTalents: PrimaryTalent[];
  talentExperience: TalentExperience | "";
  performanceLevel: PerformanceLevel | "";
  performedBefore: YesNo | "";
  performanceDescription: string;
  talentDetails: TalentDetails;

  auditionFile: File | null;
  portfolioFile: File | null;

  travelComfort: YesNoMaybe | "";
  futureOpportunities: YesNo | "";
  notifications: YesNo | "";
  instagram: string;
  youtube: string;
  facebook: string;
  portfolioWebsite: string;
  biography: string;
  achievements: string;
  additionalNotes: string;
}

export const INITIAL_REGISTRATION_FORM: RegistrationFormData = {
  guardianName: "",
  guardianMobile: "",
  guardianAltMobile: "",
  guardianEmail: "",
  district: "",
  city: "",
  address: "",
  pincode: "",

  participantName: "",
  participantDob: "",
  participantAge: "",
  participantGender: "",
  participantPhoto: null,

  specialAbilityCategory: "",
  specialAbilityDescription: "",
  requiresAssistance: "",
  assistanceDescription: "",

  primaryTalent: "",
  secondaryTalents: [],
  talentExperience: "",
  performanceLevel: "",
  performedBefore: "",
  performanceDescription: "",
  talentDetails: {},

  auditionFile: null,
  portfolioFile: null,

  travelComfort: "",
  futureOpportunities: "",
  notifications: "",
  instagram: "",
  youtube: "",
  facebook: "",
  portfolioWebsite: "",
  biography: "",
  achievements: "",
  additionalNotes: "",
};

export const REGISTRATION_STEPS = [
  { id: 1, label: "Guardian Information" },
  { id: 2, label: "Participant Information" },
  { id: 3, label: "Special Ability Information" },
  { id: 4, label: "Talent Profile" },
  { id: 5, label: "Photo & Audition Upload" },
  { id: 6, label: "Review & Submit" },
] as const;