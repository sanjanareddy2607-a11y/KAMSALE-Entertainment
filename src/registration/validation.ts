import type { RegistrationFormData } from "./types";
import { KARNATAKA_DISTRICTS } from "../data/districts";

export type FormErrors = Partial<Record<keyof RegistrationFormData, string>>;

const phonePattern = /^[+\d\s-]{10,15}$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateStep(
  step: number,
  data: RegistrationFormData
): FormErrors {
  const errors: FormErrors = {};

  switch (step) {
    case 1:
      if (!data.guardianName.trim())
        errors.guardianName = "Guardian full name is required";
      if (!data.guardianMobile.trim()) {
        errors.guardianMobile = "Mobile number is required";
      } else if (!phonePattern.test(data.guardianMobile.trim())) {
        errors.guardianMobile = "Please enter a valid mobile number";
      }
      if (
        data.guardianAltMobile.trim() &&
        !phonePattern.test(data.guardianAltMobile.trim())
      ) {
        errors.guardianAltMobile = "Please enter a valid mobile number";
      }
      if (data.guardianEmail.trim() && !emailPattern.test(data.guardianEmail.trim())) {
        errors.guardianEmail = "Please enter a valid email address";
      }
      if (!data.district.trim()) {
        errors.district = "District is required";
      } else if (
        !KARNATAKA_DISTRICTS.some(
          (d) => d.toLowerCase() === data.district.trim().toLowerCase()
        )
      ) {
        errors.district = "Please select a valid Karnataka district";
      }
      if (!data.city.trim()) errors.city = "City / Taluk is required";
      if (!data.address.trim()) errors.address = "Complete address is required";
      break;

    case 2:
      if (!data.participantName.trim())
        errors.participantName = "Participant full name is required";
      if (!data.participantDob) errors.participantDob = "Date of birth is required";
      if (!data.participantAge.trim()) {
        errors.participantAge = "Age is required";
      } else if (Number.isNaN(Number(data.participantAge)) || Number(data.participantAge) < 1) {
        errors.participantAge = "Please enter a valid age";
      }
      if (!data.participantGender) errors.participantGender = "Gender is required";
      break;

    case 3:
      if (!data.specialAbilityCategory)
        errors.specialAbilityCategory = "Category of special ability is required";
      if (data.requiresAssistance === "yes" && !data.assistanceDescription.trim()) {
        errors.assistanceDescription = "Please describe the assistance required";
      }
      break;

    case 4:
      if (!data.primaryTalent) errors.primaryTalent = "Primary talent is required";
      if (!data.talentExperience)
        errors.talentExperience = "Talent experience is required";
      if (!data.performanceLevel)
        errors.performanceLevel = "Performance level is required";
      if (data.performedBefore === "yes" && !data.performanceDescription.trim()) {
        errors.performanceDescription = "Please describe previous performances";
      }
      break;

    case 5:
      // Photo, audition file, and portfolio file are now collected via the
      // external Google Form (see Step 5 UI) to avoid the in-app 25MB limit.
      // Nothing to validate here anymore.
      break;

    case 6:
      if (!data.travelComfort)
        errors.travelComfort = "Please select your travel preference";
      if (!data.futureOpportunities)
        errors.futureOpportunities = "Please select your preference";
      if (!data.notifications)
        errors.notifications = "Please select your notification preference";
      break;
  }

  return errors;
}

export function calculateAgeFromDob(dob: string): string {
  if (!dob) return "";
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age -= 1;
  }
  return age > 0 ? String(age) : "";
}