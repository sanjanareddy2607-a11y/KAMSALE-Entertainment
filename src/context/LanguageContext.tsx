import { createContext, useContext, useState, type ReactNode } from "react";

export type Language = "en" | "kn";

const translations = {
  en: {
    // Navbar
    "nav.bookEvent": "Book Event",
    "nav.home": "Home",
    "nav.about": "About",
    "nav.services": "Services",
    "nav.gallery": "Gallery",
    "nav.events": "Events",
    "nav.contact": "Contact",
    // Contact form
    "contact.name": "Name",
    "contact.phone": "Phone Number",
    "contact.date": "Event Date",
    "contact.venue": "Venue / City",
    "contact.notes": "Additional Notes",
    "contact.submit": "Send Booking Request",
    "contact.success": "Opening WhatsApp with your booking details...",
    // Registration buttons
    "reg.continue": "Continue",
    "reg.back": "Back",
    "reg.submit": "Submit Application",
    "reg.submitting": "Submitting...",
    // Registration steps
    "step.1": "Guardian Details",
    "step.2": "Participant Details",
    "step.3": "Special Ability",
    "step.4": "Talent & Performance",
    "step.5": "Audition Files",
    "step.6": "Review & Submit",
    // Step 1 fields
    "field.guardianName": "Guardian Full Name",
    "field.mobile": "Mobile Number",
    "field.altMobile": "Alternate Mobile Number",
    "field.email": "Email Address",
    "field.district": "District",
    "field.city": "City / Taluk",
    "field.address": "Complete Address",
    "field.pincode": "Pincode",
    // Step 2 fields
    "field.participantName": "Participant Full Name",
    "field.dob": "Date of Birth",
    "field.age": "Age",
    "field.gender": "Gender",
    "field.photo": "Participant Photograph",
    // Step 3 fields
    "field.specialAbility": "Category of Special Ability",
    "field.specialDesc": "Additional Description (Optional)",
    "field.assistance": "Do you require special assistance during future events?",
    "field.assistanceDesc": "Please describe",
    // Step 4 fields
    "field.primaryTalent": "Primary Talent",
    "field.secondaryTalents": "Secondary Talents",
    "field.experience": "Talent Experience",
    "field.level": "Performance Level",
    "field.performed": "Have you performed on stage before?",
    "field.performDesc": "Describe previous performances",
    // Step 5 fields
    "field.audition": "Audition Performance File",
    "field.portfolio": "Additional Portfolio Documents (Optional)",
    // Step 6 fields
    "field.travel": "Comfortable Traveling Across Karnataka?",
    "field.future": "Interested in Future Opportunities with Kamasale Entertainment?",
    "field.notifications": "Would you like to receive future audition, event, performance, and talent opportunity notifications?",
    "field.instagram": "Instagram (Optional)",
    "field.youtube": "YouTube (Optional)",
    "field.facebook": "Facebook (Optional)",
    "field.website": "Portfolio Website (Optional)",
    "field.bio": "Short Biography (Optional)",
    "field.achievements": "Achievements (Optional)",
    "field.extraNotes": "Additional Notes (Optional)",
    "field.review": "Review Your Application",
    // Common
    "common.yes": "Yes",
    "common.no": "No",
    "common.maybe": "Maybe",
    "common.select": "Select an option",
  },
  kn: {
    // Navbar
    "nav.bookEvent": "ಕಾರ್ಯಕ್ರಮ ಬುಕ್ ಮಾಡಿ",
    "nav.home": "ಮುಖಪುಟ",
    "nav.about": "ನಮ್ಮ ಬಗ್ಗೆ",
    "nav.services": "ಸೇವೆಗಳು",
    "nav.gallery": "ಗ್ಯಾಲರಿ",
    "nav.events": "ಕಾರ್ಯಕ್ರಮಗಳು",
    "nav.contact": "ಸಂಪರ್ಕಿಸಿ",
    // Contact form
    "contact.name": "ಹೆಸರು",
    "contact.phone": "ಫೋನ್ ನಂಬರ್",
    "contact.date": "ಕಾರ್ಯಕ್ರಮದ ದಿನಾಂಕ",
    "contact.venue": "ಸ್ಥಳ / ನಗರ",
    "contact.notes": "ಹೆಚ್ಚುವರಿ ಟಿಪ್ಪಣಿಗಳು",
    "contact.submit": "ಬುಕಿಂಗ್ ವಿನಂತಿ ಕಳುಹಿಸಿ",
    "contact.success": "WhatsApp ತೆರೆಯಲಾಗುತ್ತಿದೆ...",
    // Registration buttons
    "reg.continue": "ಮುಂದುವರಿಯಿರಿ",
    "reg.back": "ಹಿಂದೆ",
    "reg.submit": "ಅರ್ಜಿ ಸಲ್ಲಿಸಿ",
    "reg.submitting": "ಸಲ್ಲಿಸಲಾಗುತ್ತಿದೆ...",
    // Registration steps
    "step.1": "ಪೋಷಕರ ವಿವರಗಳು",
    "step.2": "ಭಾಗವಹಿಸುವವರ ವಿವರಗಳು",
    "step.3": "ವಿಶೇಷ ಸಾಮರ್ಥ್ಯ",
    "step.4": "ಪ್ರತಿಭೆ ಮತ್ತು ಪ್ರದರ್ಶನ",
    "step.5": "ಆಡಿಶನ್ ಫೈಲ್‌ಗಳು",
    "step.6": "ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಸಲ್ಲಿಸಿ",
    // Step 1 fields
    "field.guardianName": "ಪೋಷಕರ ಪೂರ್ಣ ಹೆಸರು",
    "field.mobile": "ಮೊಬೈಲ್ ನಂಬರ್",
    "field.altMobile": "ಪರ್ಯಾಯ ಮೊಬೈಲ್ ನಂಬರ್",
    "field.email": "ಇಮೇಲ್ ವಿಳಾಸ",
    "field.district": "ಜಿಲ್ಲೆ",
    "field.city": "ನಗರ / ತಾಲೂಕು",
    "field.address": "ಸಂಪೂರ್ಣ ವಿಳಾಸ",
    "field.pincode": "ಪಿನ್‌ಕೋಡ್",
    // Step 2 fields
    "field.participantName": "ಭಾಗವಹಿಸುವವರ ಪೂರ್ಣ ಹೆಸರು",
    "field.dob": "ಜನ್ಮ ದಿನಾಂಕ",
    "field.age": "ವಯಸ್ಸು",
    "field.gender": "ಲಿಂಗ",
    "field.photo": "ಭಾಗವಹಿಸುವವರ ಫೋಟೋ",
    // Step 3 fields
    "field.specialAbility": "ವಿಶೇಷ ಸಾಮರ್ಥ್ಯದ ವರ್ಗ",
    "field.specialDesc": "ಹೆಚ್ಚುವರಿ ವಿವರಣೆ (ಐಚ್ಛಿಕ)",
    "field.assistance": "ಮುಂದಿನ ಕಾರ್ಯಕ್ರಮಗಳಲ್ಲಿ ವಿಶೇಷ ನೆರವು ಬೇಕೇ?",
    "field.assistanceDesc": "ದಯವಿಟ್ಟು ವಿವರಿಸಿ",
    // Step 4 fields
    "field.primaryTalent": "ಪ್ರಾಥಮಿಕ ಪ್ರತಿಭೆ",
    "field.secondaryTalents": "ಮಾಧ್ಯಮಿಕ ಪ್ರತಿಭೆಗಳು",
    "field.experience": "ಪ್ರತಿಭೆಯ ಅನುಭವ",
    "field.level": "ಪ್ರದರ್ಶನ ಮಟ್ಟ",
    "field.performed": "ಈ ಹಿಂದೆ ವೇದಿಕೆಯಲ್ಲಿ ಪ್ರದರ್ಶನ ನೀಡಿದ್ದೀರಾ?",
    "field.performDesc": "ಹಿಂದಿನ ಪ್ರದರ್ಶನಗಳನ್ನು ವಿವರಿಸಿ",
    // Step 5 fields
    "field.audition": "ಆಡಿಶನ್ ಪ್ರದರ್ಶನ ಫೈಲ್",
    "field.portfolio": "ಹೆಚ್ಚುವರಿ ಪೋರ್ಟ್‌ಫೋಲಿಯೋ ದಾಖಲೆಗಳು (ಐಚ್ಛಿಕ)",
    // Step 6 fields
    "field.travel": "ಕರ್ನಾಟಕದಾದ್ಯಂತ ಪ್ರಯಾಣಿಸಲು ಸಿದ್ಧರಿದ್ದೀರಾ?",
    "field.future": "ಕಮ್ಸಾಲೆ ಎಂಟರ್‌ಟೈನ್‌ಮೆಂಟ್ ಜೊತೆ ಭವಿಷ್ಯದ ಅವಕಾಶಗಳಲ್ಲಿ ಆಸಕ್ತಿ ಇದೆಯೇ?",
    "field.notifications": "ಮುಂದಿನ ಆಡಿಶನ್, ಕಾರ್ಯಕ್ರಮ ಮತ್ತು ಪ್ರತಿಭಾ ಅವಕಾಶ ಅಧಿಸೂಚನೆಗಳನ್ನು ಸ್ವೀಕರಿಸಲು ಬಯಸುತ್ತೀರಾ?",
    "field.instagram": "ಇನ್‌ಸ್ಟಾಗ್ರಾಮ್ (ಐಚ್ಛಿಕ)",
    "field.youtube": "ಯೂಟ್ಯೂಬ್ (ಐಚ್ಛಿಕ)",
    "field.facebook": "ಫೇಸ್‌ಬುಕ್ (ಐಚ್ಛಿಕ)",
    "field.website": "ಪೋರ್ಟ್‌ಫೋಲಿಯೋ ವೆಬ್‌ಸೈಟ್ (ಐಚ್ಛಿಕ)",
    "field.bio": "ಸಣ್ಣ ಜೀವನಚರಿತ್ರೆ (ಐಚ್ಛಿಕ)",
    "field.achievements": "ಸಾಧನೆಗಳು (ಐಚ್ಛಿಕ)",
    "field.extraNotes": "ಹೆಚ್ಚುವರಿ ಟಿಪ್ಪಣಿಗಳು (ಐಚ್ಛಿಕ)",
    "field.review": "ನಿಮ್ಮ ಅರ್ಜಿ ಪರಿಶೀಲಿಸಿ",
    // Common
    "common.yes": "ಹೌದು",
    "common.no": "ಇಲ್ಲ",
    "common.maybe": "ಬಹುಶಃ",
    "common.select": "ಆಯ್ಕೆ ಮಾಡಿ",
  },
} as const;

type TranslationKey = keyof typeof translations.en;

interface LanguageContextType {
  lang: Language;
  toggleLanguage: () => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>("en");
  const toggleLanguage = () => setLang((l) => (l === "en" ? "kn" : "en"));
  const t = (key: TranslationKey): string => translations[lang][key] ?? key;

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
}