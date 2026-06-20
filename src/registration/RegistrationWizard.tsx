import { useState, useRef, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { ProgressBar } from "../components/ui/ProgressBar";
import {
  FormInput,
  FormSelect,
  FormTextarea,
  FormRadioGroup,
  FormCheckboxGroup,
} from "../components/ui/FormFields";
import { DistrictAutocomplete } from "../components/ui/DistrictAutocomplete";
import {
  INITIAL_REGISTRATION_FORM,
  type PrimaryTalent,
  type RegistrationFormData,
  REGISTRATION_STEPS,
} from "./types";
import { validateStep, calculateAgeFromDob, type FormErrors } from "./validation";
import { submitRegistration } from "./api";

const SPECIAL_ABILITY_OPTIONS = [
  "Visual Impairment",
  "Hearing Impairment",
  "Speech Impairment",
  "Locomotor Disability",
  "Intellectual Disability",
  "Autism Spectrum",
  "Multiple Disabilities",
  "Other",
] as const;

const TALENT_OPTIONS: PrimaryTalent[] = [
  "Singing",
  "Acting",
  "Dance",
  "Choreography",
  "Direction",
  "Cinematography",
  "Anchoring",
  "Public Speaking",
  "Mimicry",
  "Instrumental Music",
  "Writing",
  "Comedy",
  "Stage Performance",
  "Other",
];

const EXPERIENCE_OPTIONS = [
  "Less than 6 Months",
  "6 Months - 1 Year",
  "1 - 3 Years",
  "3 - 5 Years",
  "5+ Years",
  "Self-Taught",
] as const;

const LEVEL_OPTIONS = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "Professional",
] as const;

function ReviewRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 py-2 border-b border-gold-100/80 last:border-0">
      <dt className="text-sm text-warm-gray">{label}</dt>
      <dd className="text-sm font-medium text-charcoal sm:text-right sm:max-w-[60%]">
        {value}
      </dd>
    </div>
  );
}

function DynamicTalentFields({
  data,
  updateTalentDetails,
}: {
  data: RegistrationFormData;
  updateTalentDetails: (
    talent: keyof RegistrationFormData["talentDetails"],
    field: string,
    value: string | string[]
  ) => void;
}) {
  const talents = new Set(
    [data.primaryTalent, ...data.secondaryTalents].filter(Boolean)
  );

  const sections: ReactNode[] = [];

  if (talents.has("Singing")) {
    const d = data.talentDetails.singing ?? {
      preferredLanguage: "",
      singingStyle: "",
      favoriteSinger: "",
    };
    sections.push(
      <div
        key="singing"
        className="mt-6 p-6 rounded-2xl bg-gold-50/50 border border-gold-100 space-y-5"
      >
        <h4 className="font-display text-xl font-semibold text-charcoal">
          Singing Details
        </h4>
        <FormSelect
          id="singing-language"
          label="Preferred Singing Language"
          value={d.preferredLanguage}
          onChange={(v) =>
            updateTalentDetails("singing", "preferredLanguage", v)
          }
          options={[
            "Kannada",
            "Telugu",
            "Tamil",
            "Malayalam",
            "Hindi",
            "English",
            "Other",
          ]}
        />
        <FormSelect
          id="singing-style"
          label="Singing Style"
          value={d.singingStyle}
          onChange={(v) => updateTalentDetails("singing", "singingStyle", v)}
          options={[
            "Classical",
            "Folk",
            "Devotional",
            "Film Songs",
            "Light Music",
            "Western",
            "Fusion",
            "Other",
          ]}
        />
        <FormInput
          id="favorite-singer"
          label="Favorite Singer"
          value={d.favoriteSinger}
          onChange={(v) => updateTalentDetails("singing", "favoriteSinger", v)}
        />
      </div>
    );
  }

  if (talents.has("Dance")) {
    const d = data.talentDetails.dance ?? {
      danceStyle: "",
      yearsOfExperience: "",
      canPerformSolo: "" as "yes" | "no" | "",
      canPerformGroup: "" as "yes" | "no" | "",
    };
    sections.push(
      <div
        key="dance"
        className="mt-6 p-6 rounded-2xl bg-gold-50/50 border border-gold-100 space-y-5"
      >
        <h4 className="font-display text-xl font-semibold text-charcoal">
          Dance Details
        </h4>
        <FormSelect
          id="dance-style"
          label="Dance Style"
          value={d.danceStyle}
          onChange={(v) => updateTalentDetails("dance", "danceStyle", v)}
          options={[
            "Classical",
            "Folk",
            "Western",
            "Cinematic",
            "Freestyle",
            "Other",
          ]}
        />
        <FormInput
          id="dance-years"
          label="Years of Experience"
          value={d.yearsOfExperience}
          onChange={(v) =>
            updateTalentDetails("dance", "yearsOfExperience", v)
          }
        />
        <FormRadioGroup
          name="dance-solo"
          label="Can Perform Solo?"
          value={d.canPerformSolo}
          onChange={(v) => updateTalentDetails("dance", "canPerformSolo", v)}
          options={[
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
          ]}
        />
        <FormRadioGroup
          name="dance-group"
          label="Can Perform Group Dance?"
          value={d.canPerformGroup}
          onChange={(v) => updateTalentDetails("dance", "canPerformGroup", v)}
          options={[
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
          ]}
        />
      </div>
    );
  }

  if (talents.has("Acting")) {
    const d = data.talentDetails.acting ?? {
      interestedIn: [] as string[],
      previousExperience: "",
    };
    sections.push(
      <div
        key="acting"
        className="mt-6 p-6 rounded-2xl bg-gold-50/50 border border-gold-100 space-y-5"
      >
        <h4 className="font-display text-xl font-semibold text-charcoal">
          Acting Details
        </h4>
        <FormCheckboxGroup
          label="Interested In"
          values={d.interestedIn}
          onChange={(v) => updateTalentDetails("acting", "interestedIn", v)}
          options={[
            "Movies",
            "Serials",
            "Advertisements",
            "Stage Plays",
            "Short Films",
            "Web Series",
            "Any",
          ]}
        />
        <FormTextarea
          id="acting-experience"
          label="Previous Acting Experience"
          value={d.previousExperience}
          onChange={(v) =>
            updateTalentDetails("acting", "previousExperience", v)
          }
        />
      </div>
    );
  }

  if (talents.has("Choreography")) {
    const d = data.talentDetails.choreography ?? {
      yearsOfExperience: "",
      numberOfPerformances: "",
      description: "",
    };
    sections.push(
      <div
        key="choreography"
        className="mt-6 p-6 rounded-2xl bg-gold-50/50 border border-gold-100 space-y-5"
      >
        <h4 className="font-display text-xl font-semibold text-charcoal">
          Choreography Details
        </h4>
        <FormInput
          id="choreo-years"
          label="Years of Experience"
          value={d.yearsOfExperience}
          onChange={(v) =>
            updateTalentDetails("choreography", "yearsOfExperience", v)
          }
        />
        <FormInput
          id="choreo-performances"
          label="Number of Choreographed Performances"
          value={d.numberOfPerformances}
          onChange={(v) =>
            updateTalentDetails("choreography", "numberOfPerformances", v)
          }
        />
        <FormTextarea
          id="choreo-description"
          label="Description"
          value={d.description}
          onChange={(v) =>
            updateTalentDetails("choreography", "description", v)
          }
        />
      </div>
    );
  }

  if (talents.has("Direction")) {
    const d = data.talentDetails.direction ?? {
      interestedIn: [] as string[],
      experienceDescription: "",
    };
    sections.push(
      <div
        key="direction"
        className="mt-6 p-6 rounded-2xl bg-gold-50/50 border border-gold-100 space-y-5"
      >
        <h4 className="font-display text-xl font-semibold text-charcoal">
          Direction Details
        </h4>
        <FormCheckboxGroup
          label="Interested In"
          values={d.interestedIn}
          onChange={(v) => updateTalentDetails("direction", "interestedIn", v)}
          options={["Movies", "Short Films", "Stage Events", "Documentaries"]}
        />
        <FormTextarea
          id="direction-experience"
          label="Experience Description"
          value={d.experienceDescription}
          onChange={(v) =>
            updateTalentDetails("direction", "experienceDescription", v)
          }
        />
      </div>
    );
  }

  if (talents.has("Cinematography")) {
    const d = data.talentDetails.cinematography ?? {
      experienceLevel: "" as RegistrationFormData["performanceLevel"],
      equipmentFamiliarity: [] as string[],
    };
    sections.push(
      <div
        key="cinematography"
        className="mt-6 p-6 rounded-2xl bg-gold-50/50 border border-gold-100 space-y-5"
      >
        <h4 className="font-display text-xl font-semibold text-charcoal">
          Cinematography Details
        </h4>
        <FormSelect
          id="cine-level"
          label="Experience Level"
          value={d.experienceLevel}
          onChange={(v) =>
            updateTalentDetails("cinematography", "experienceLevel", v)
          }
          options={LEVEL_OPTIONS}
        />
        <FormCheckboxGroup
          label="Equipment Familiarity"
          values={d.equipmentFamiliarity}
          onChange={(v) =>
            updateTalentDetails("cinematography", "equipmentFamiliarity", v)
          }
          options={[
            "Mobile Camera",
            "DSLR",
            "Mirrorless",
            "Cinema Camera",
          ]}
        />
      </div>
    );
  }

  return sections.length > 0 ? <>{sections}</> : null;
}

export function RegistrationWizard() {
  const navigate = useNavigate();
  const wizardRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(1);
  const [data, setData] = useState<RegistrationFormData>(
    INITIAL_REGISTRATION_FORM
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isDuplicateError, setIsDuplicateError] = useState(false);

  const update = <K extends keyof RegistrationFormData>(
    key: K,
    value: RegistrationFormData[K]
  ) => {
    setData((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "participantDob" && typeof value === "string") {
        next.participantAge = calculateAgeFromDob(value);
      }
      return next;
    });
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  const updateTalentDetails = (
    talent: keyof RegistrationFormData["talentDetails"],
    field: string,
    value: string | string[]
  ) => {
    setData((prev) => ({
      ...prev,
      talentDetails: {
        ...prev.talentDetails,
        [talent]: {
          ...((prev.talentDetails[talent] ?? {}) as object),
          [field]: value,
        },
      },
    }));
  };

const goNext = () => {
  const stepErrors = validateStep(step, data);
  if (Object.keys(stepErrors).length > 0) {
    setErrors(stepErrors);
    return;
  }
  setErrors({});
  setStep((s) => Math.min(s + 1, REGISTRATION_STEPS.length));
  setTimeout(() => {
    wizardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 50);
};

 const goBack = () => {
  setErrors({});
  setStep((s) => Math.max(s - 1, 1));
  setTimeout(() => {
    wizardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 50);
};

  const handleSubmit = async () => {
    const stepErrors = validateStep(6, data);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }

    setSubmitting(true);
    setSubmitError("");
    setIsDuplicateError(false);

    const result = await submitRegistration(
      data,
      "vinootana-golden-singers"
    );

    setSubmitting(false);

    if (result.success) {
      navigate("/register/vinootana-golden-singers/success", {
        state: { registrationId: result.id },
      });
    } else {
      setSubmitError(result.error ?? "Submission failed. Please try again.");
      setIsDuplicateError(Boolean(result.duplicate));
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="grid sm:grid-cols-2 gap-5 md:gap-6">
            <div className="sm:col-span-2">
              <FormInput
                id="guardian-name"
                label="Guardian Full Name"
                value={data.guardianName}
                onChange={(v) => update("guardianName", v)}
                error={errors.guardianName}
                required
              />
            </div>
            <FormInput
              id="guardian-mobile"
              label="Mobile Number"
              type="tel"
              value={data.guardianMobile}
              onChange={(v) => update("guardianMobile", v)}
              error={errors.guardianMobile}
              required
              autoComplete="tel"
            />
            <FormInput
              id="guardian-alt-mobile"
              label="Alternate Mobile Number"
              type="tel"
              value={data.guardianAltMobile}
              onChange={(v) => update("guardianAltMobile", v)}
              error={errors.guardianAltMobile}
              autoComplete="tel"
            />
            <FormInput
              id="guardian-email"
              label="Email Address"
              type="email"
              value={data.guardianEmail}
              onChange={(v) => update("guardianEmail", v)}
              error={errors.guardianEmail}
              autoComplete="email"
            />
            <DistrictAutocomplete
              value={data.district}
              onChange={(v) => update("district", v)}
              error={errors.district}
            />
            <FormInput
              id="city"
              label="City / Taluk"
              value={data.city}
              onChange={(v) => update("city", v)}
              error={errors.city}
              required
            />
            <div className="sm:col-span-2">
              <FormTextarea
                id="address"
                label="Complete Address"
                value={data.address}
                onChange={(v) => update("address", v)}
                error={errors.address}
                required
                rows={3}
              />
            </div>
            <FormInput
              id="pincode"
              label="Pincode"
              value={data.pincode}
              onChange={(v) => update("pincode", v)}
              autoComplete="postal-code"
            />
          </div>
        );

      case 2:
        return (
          <div className="grid sm:grid-cols-2 gap-5 md:gap-6">
            <div className="sm:col-span-2">
              <FormInput
                id="participant-name"
                label="Participant Full Name"
                value={data.participantName}
                onChange={(v) => update("participantName", v)}
                error={errors.participantName}
                required
              />
            </div>
            <FormInput
              id="participant-dob"
              label="Date of Birth"
              type="date"
              value={data.participantDob}
              onChange={(v) => update("participantDob", v)}
              error={errors.participantDob}
              required
              max={new Date().toISOString().split("T")[0]}
            />
            <FormInput
              id="participant-age"
              label="Age"
              value={data.participantAge}
              onChange={(v) => update("participantAge", v)}
              error={errors.participantAge}
              required
              readOnly
            />
            <FormSelect
              id="participant-gender"
              label="Gender"
              value={data.participantGender}
              onChange={(v) => update("participantGender", v)}
              options={["Male", "Female", "Other", "Prefer not to say"]}
              error={errors.participantGender}
              required
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <FormSelect
              id="special-ability"
              label="Category of Special Ability"
              value={data.specialAbilityCategory}
              onChange={(v) =>
                update(
                  "specialAbilityCategory",
                  v as RegistrationFormData["specialAbilityCategory"]
                )
              }
              options={SPECIAL_ABILITY_OPTIONS}
              error={errors.specialAbilityCategory}
              required
            />
            <FormTextarea
              id="special-ability-desc"
              label="Additional Description (Optional)"
              value={data.specialAbilityDescription}
              onChange={(v) => update("specialAbilityDescription", v)}
            />
            <FormRadioGroup
              name="requires-assistance"
              label="Do you require special assistance during future events?"
              value={data.requiresAssistance}
              onChange={(v) =>
                update("requiresAssistance", v as RegistrationFormData["requiresAssistance"])
              }
              options={[
                { value: "yes", label: "Yes" },
                { value: "no", label: "No" },
              ]}
            />
            {data.requiresAssistance === "yes" && (
              <FormTextarea
                id="assistance-desc"
                label="Please describe"
                value={data.assistanceDescription}
                onChange={(v) => update("assistanceDescription", v)}
                error={errors.assistanceDescription}
                required
              />
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <FormSelect
              id="primary-talent"
              label="Primary Talent"
              value={data.primaryTalent}
              onChange={(v) =>
                update("primaryTalent", v as RegistrationFormData["primaryTalent"])
              }
              options={TALENT_OPTIONS}
              error={errors.primaryTalent}
              required
            />
            <FormCheckboxGroup
              label="Secondary Talents"
              values={data.secondaryTalents}
              onChange={(v) =>
                update("secondaryTalents", v as PrimaryTalent[])
              }
              options={TALENT_OPTIONS.filter((t) => t !== data.primaryTalent)}
            />
            <div className="grid sm:grid-cols-2 gap-5">
              <FormSelect
                id="talent-experience"
                label="Talent Experience"
                value={data.talentExperience}
                onChange={(v) =>
                  update(
                    "talentExperience",
                    v as RegistrationFormData["talentExperience"]
                  )
                }
                options={EXPERIENCE_OPTIONS}
                error={errors.talentExperience}
                required
              />
              <FormSelect
                id="performance-level"
                label="Performance Level"
                value={data.performanceLevel}
                onChange={(v) =>
                  update(
                    "performanceLevel",
                    v as RegistrationFormData["performanceLevel"]
                  )
                }
                options={LEVEL_OPTIONS}
                error={errors.performanceLevel}
                required
              />
            </div>
            <FormRadioGroup
              name="performed-before"
              label="Have you performed on stage before?"
              value={data.performedBefore}
              onChange={(v) =>
                update("performedBefore", v as RegistrationFormData["performedBefore"])
              }
              options={[
                { value: "yes", label: "Yes" },
                { value: "no", label: "No" },
              ]}
            />
            {data.performedBefore === "yes" && (
              <FormTextarea
                id="performance-desc"
                label="Describe previous performances"
                value={data.performanceDescription}
                onChange={(v) => update("performanceDescription", v)}
                error={errors.performanceDescription}
                required
              />
            )}
            <DynamicTalentFields
              data={data}
              updateTalentDetails={updateTalentDetails}
            />
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="rounded-2xl bg-gold-50/60 border border-gold-100 p-6 md:p-8 space-y-5">
              <div>
                <h3 className="font-display text-xl font-semibold text-charcoal mb-2">
                  Upload Your Files via Google Form
                </h3>
                <p className="text-sm text-warm-gray leading-relaxed">
                  To make it easy to submit your photo and audition
                  recording without worrying about file size limits, we
                  collect these through a short Google Form instead of
                  here. It accepts large photos, audio, and video files
                  directly — no compression or Google Drive link needed.
                </p>
              </div>

              <div className="rounded-xl bg-white border border-gold-100 p-5 space-y-2">
                <p className="text-sm font-medium text-charcoal">
                  In the Google Form, please upload:
                </p>
                <ul className="text-sm text-warm-gray space-y-1.5 list-disc list-inside">
                  <li>Your participant photograph (JPG, PNG, or WEBP)</li>
                  <li>Your audition performance file (MP3, WAV, MP4, or MOV)</li>
                </ul>
              </div>

              <p className="text-sm text-warm-gray leading-relaxed">
                <span className="font-medium text-charcoal">
                  Please finish and submit this registration first.
                </span>{" "}
                Once submitted, you'll receive a unique Registration ID on
                the confirmation page — enter that ID in the Google Form so
                we can match your uploaded files to this exact application.
              </p>

              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSdPZnLIfem8zXfZQhbPYGx_kHqrT7dQRPoCwUqcL4iGkS9-9w/viewform?usp=dialog"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-charcoal px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-gold-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500"
              >
                Open Google Form (use after submitting)
              </a>

              <p className="text-xs text-warm-gray/80">
                You don't need to upload anything here — just continue to
                the next step and finish your registration.
              </p>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-8">
            <div className="space-y-6">
              <h3 className="font-display text-2xl font-semibold text-charcoal">
                Availability & Future Opportunities
              </h3>
              <FormRadioGroup
                name="travel-comfort"
                label="Comfortable Traveling Across Karnataka?"
                value={data.travelComfort}
                onChange={(v) =>
                  update("travelComfort", v as RegistrationFormData["travelComfort"])
                }
                options={[
                  { value: "yes", label: "Yes" },
                  { value: "no", label: "No" },
                  { value: "maybe", label: "Maybe" },
                ]}
                error={errors.travelComfort}
                required
              />
              <FormRadioGroup
                name="future-opportunities"
                label="Interested in Future Opportunities with Kamasale Entertainment?"
                value={data.futureOpportunities}
                onChange={(v) =>
                  update(
                    "futureOpportunities",
                    v as RegistrationFormData["futureOpportunities"]
                  )
                }
                options={[
                  { value: "yes", label: "Yes" },
                  { value: "no", label: "No" },
                ]}
                error={errors.futureOpportunities}
                required
              />
              <FormRadioGroup
                name="notifications"
                label="Would you like to receive future audition, event, performance, and talent opportunity notifications?"
                value={data.notifications}
                onChange={(v) =>
                  update("notifications", v as RegistrationFormData["notifications"])
                }
                options={[
                  { value: "yes", label: "Yes" },
                  { value: "no", label: "No" },
                ]}
                error={errors.notifications}
                required
              />
              <div className="grid sm:grid-cols-2 gap-5">
                <FormInput
                  id="instagram"
                  label="Instagram (Optional)"
                  value={data.instagram}
                  onChange={(v) => update("instagram", v)}
                />
                <FormInput
                  id="youtube"
                  label="YouTube (Optional)"
                  value={data.youtube}
                  onChange={(v) => update("youtube", v)}
                />
                <FormInput
                  id="facebook"
                  label="Facebook (Optional)"
                  value={data.facebook}
                  onChange={(v) => update("facebook", v)}
                />
                <FormInput
                  id="portfolio-website"
                  label="Portfolio Website (Optional)"
                  value={data.portfolioWebsite}
                  onChange={(v) => update("portfolioWebsite", v)}
                />
              </div>
              <FormTextarea
                id="biography"
                label="Short Biography (Optional)"
                value={data.biography}
                onChange={(v) => update("biography", v)}
              />
              <FormTextarea
                id="achievements"
                label="Achievements (Optional)"
                value={data.achievements}
                onChange={(v) => update("achievements", v)}
              />
              <FormTextarea
                id="additional-notes"
                label="Additional Notes (Optional)"
                value={data.additionalNotes}
                onChange={(v) => update("additionalNotes", v)}
              />
            </div>

            <div className="rounded-2xl bg-cream p-6 md:p-8 card-border">
              <h3 className="font-display text-2xl font-semibold text-charcoal mb-6">
                Review Your Application
              </h3>
              <dl className="space-y-1">
                <ReviewRow label="Guardian" value={data.guardianName} />
                <ReviewRow label="Mobile" value={data.guardianMobile} />
                <ReviewRow label="District" value={data.district} />
                <ReviewRow label="Participant" value={data.participantName} />
                <ReviewRow label="Age" value={data.participantAge} />
                <ReviewRow
                  label="Special Ability"
                  value={data.specialAbilityCategory}
                />
                <ReviewRow label="Primary Talent" value={data.primaryTalent} />
                <ReviewRow
                  label="Experience"
                  value={data.talentExperience}
                />
                <ReviewRow
                  label="Performance Level"
                  value={data.performanceLevel}
                />
                <ReviewRow
                  label="Photo / Audition"
                  value="Submitted via Google Form"
                />
              </dl>
            </div>

            {submitError && (
              <div
                className={`rounded-2xl p-4 text-sm ${
                  isDuplicateError
                    ? "bg-amber-50 border border-amber-200 text-amber-800"
                    : "text-red-500"
                }`}
                role="alert"
              >
                {submitError}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div ref={wizardRef} className="rounded-3xl bg-white p-6 md:p-10 card-border premium-shadow-lg">
      <ProgressBar currentStep={step} />

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          role="group"
          aria-live="polite"
          aria-label={`Step ${step}: ${REGISTRATION_STEPS[step - 1]?.label}`}
        >
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-charcoal mb-6">
            {REGISTRATION_STEPS[step - 1]?.label}
          </h2>
          {renderStep()}
        </motion.div>
      </AnimatePresence>

      <div className="mt-10 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {step > 1 ? (
          <button
            type="button"
            onClick={goBack}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-gold-200 px-6 py-3.5 text-sm font-medium text-charcoal transition-all duration-300 hover:bg-gold-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500"
          >
            <ChevronLeft size={18} aria-hidden="true" />
            Back
          </button>
        ) : (
          <div />
        )}

        {step < REGISTRATION_STEPS.length ? (
          <button
            type="button"
            onClick={goNext}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-charcoal px-8 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-gold-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500"
          >
            Continue
            <ChevronRight size={18} aria-hidden="true" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-charcoal px-8 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-gold-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 disabled:opacity-70"
          >
            {submitting ? (
              <>
                <Loader2 size={18} className="animate-spin" aria-hidden="true" />
                Submitting...
              </>
            ) : (
              "Submit Application"
            )}
          </button>
        )}
      </div>
    </div>
  );
}