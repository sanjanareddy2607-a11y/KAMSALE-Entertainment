import type { RegistrationFormData } from "./types";

export async function submitRegistration(
  data: RegistrationFormData,
  eventSlug: string
): Promise<{ success: boolean; id?: number; error?: string; duplicate?: boolean }> {
  const formData = new FormData();

  formData.append("eventSlug", eventSlug);

  const jsonFields: (keyof RegistrationFormData)[] = [
    "guardianName",
    "guardianMobile",
    "guardianAltMobile",
    "guardianEmail",
    "district",
    "city",
    "address",
    "pincode",
    "participantName",
    "participantDob",
    "participantAge",
    "participantGender",
    "specialAbilityCategory",
    "specialAbilityDescription",
    "requiresAssistance",
    "assistanceDescription",
    "primaryTalent",
    "talentExperience",
    "performanceLevel",
    "performedBefore",
    "performanceDescription",
    "travelComfort",
    "futureOpportunities",
    "notifications",
    "instagram",
    "youtube",
    "facebook",
    "portfolioWebsite",
    "biography",
    "achievements",
    "additionalNotes",
  ];

  for (const field of jsonFields) {
    formData.append(field, String(data[field] ?? ""));
  }

  formData.append("secondaryTalents", JSON.stringify(data.secondaryTalents));
  formData.append("talentDetails", JSON.stringify(data.talentDetails));

  if (data.participantPhoto) {
    formData.append("participantPhoto", data.participantPhoto);
  }
  if (data.auditionFile) {
    formData.append("auditionFile", data.auditionFile);
  }
  if (data.portfolioFile) {
    formData.append("portfolioFile", data.portfolioFile);
  }

  try {
    const response = await fetch("/api/registrations", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.error ?? "Submission failed",
        duplicate: Boolean(result.duplicate),
      };
    }

    return { success: true, id: result.id };
  } catch {
    return {
      success: false,
      error: "Unable to connect to the server. Please try again later.",
    };
  }
}