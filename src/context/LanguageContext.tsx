import { createContext, useContext, useState, type ReactNode } from "react";

export type Language = "en" | "kn";

const EN = {
  site: {
    name: "Kamsale Entertainment",
    tagline: "Traditional Entertainment for Your Events",
    phone: "+91 86600 55132",
    phoneRaw: "918660055132",
    email: "thewittyenterprise.com",
    location: "Bangalore, Karnataka",
    availability: "Available across India",
  },
  hero: {
    title: "Kamsale Entertainment",
    subtitle: "Bringing Culture to Life at Every Celebration",
    description:
      "We deliver authentic Kamsale and folk performances for weddings, temple functions, corporate events and festivals across Karnataka. Create memorable rituals, graceful rhythm, and powerful stage energy in one complete package.",
    ctaPrimary: "View Gallery",
    ctaSecondary: "Book Event",
  },
  stats: [
    { value: 100, suffix: "+", label: "Events Organized", icon: "calendar" },
    { value: 50, suffix: "+", label: "Weddings Served", icon: "heart" },
    { value: 8, suffix: "+", label: "Years Experience", icon: "award" },
    { value: 100, suffix: "%", label: "Client Satisfaction", icon: "star" },
  ],
  about: {
    title: "About Us",
    heading: "Preserving Karnataka's Living Tradition",
    description:
      "Kamsale Entertainment preserves Karnataka's living tradition through dynamic temple art and cultural shows. Our artists perform with powerful drums, cymbals, and devotional routines that inspire guests and create a truly immersive celebration.",
    highlights: [
      "Authentic Kamsale performances rooted in centuries of tradition",
      "Professional artists trained in temple art and folk rhythm",
      "End-to-end coordination for weddings, temples, and corporate events",
      "Trusted across Karnataka and available throughout India",
    ],
    quote: "Culture is not just performed — it is felt.",
  },
  services: {
    title: "Our Services",
    subtitle:
      "From custom rituals to event entertainment, we provide end-to-end cultural performance solutions for your wedding, reception, temple event or festival.",
    items: [
      {
        title: "Cultural Performances",
        description:
          "Traditional Kamsale routines with drums, cymbals, and temple-style rhythm that deliver a devotional experience.",
        icon: "music",
      },
      {
        title: "Wedding Entertainment",
        description:
          "Full-scale wedding acts that complement your ceremony and reception with drama, heritage and artistic energy.",
        icon: "sparkles",
      },
      {
        title: "Temple Events",
        description:
          "Devotional shows and processions for temple festivals, poojas, and special ritual celebrations.",
        icon: "landmark",
      },
      {
        title: "Corporate & Private Events",
        description:
          "Memorable performances tailored for corporate gatherings, launches, anniversaries and family celebrations.",
        icon: "building",
      },
      {
        title: "Customized Shows",
        description:
          "Personalized cultural programs built around your theme, schedule, and venue requirements.",
        icon: "palette",
      },
    ],
  },
  gallery: {
    title: "Gallery",
    description:
      "Snapshots from our performances and event presentations, featuring costumes, staging, and the vibrant energy of Kamsale art.",
    images: [
      "/gallery/kamsale-stage.jpg",
      "/gallery/0.jpeg",
      "/gallery/1.jpeg",
      "/gallery/2.jpeg",
      "/gallery/3.jpeg",
      "/gallery/4.jpeg",
      "/gallery/5.jpeg",
      "/gallery/6.jpeg",
      "/gallery/8.jpeg",
      "/gallery/9.jpeg",
      "/gallery/22.jpeg",
    ],
  },
  testimonials: {
    title: "Client Testimonials",
    subtitle:
      "Trusted by families and event planners for authentic performances, seamless service, and memorable cultural moments.",
    items: [
      {
        quote:
          "Amazing performance! It added a divine vibe to our wedding and every guest was impressed.",
        author: "Happy Client",
        rating: 5,
      },
      {
        quote:
          "Highly professional team and stunning traditional choreography. The event felt complete.",
        author: "Event Organizer",
        rating: 5,
      },
      {
        quote:
          "Guests loved the traditional touch and the artists were friendly, punctual and skilled.",
        author: "Family Member",
        rating: 5,
      },
      {
        quote:
          "The puja performance and procession were beautifully executed. The energy was unforgettable.",
        author: "Bride & Groom",
        rating: 5,
      },
    ],
  },
  contact: {
    title: "Book Your Event Today",
    subtitle:
      "Reserve your date now and connect directly on WhatsApp for fast booking and planning support.",
    formHint:
      "Tell us your event date, venue and audience size so we can plan the perfect performance.",
    details: "Contact Details",
    locationLabel: "Location",
    emailLabel: "Email",
    phoneLabel: "Phone",
    whatsappLabel: "WhatsApp",
    chatNow: "Chat now",
    name: "Name",
    phoneNumber: "Phone Number",
    eventDate: "Event Date",
    venue: "Venue / City",
    additionalNotes: "Additional Notes",
    sendRequest: "Send Booking Request",
    openingWhatsApp: "Opening WhatsApp with your booking details...",
    errors: {
      name: "Please enter your name",
      phone: "Please enter your phone number",
      phoneInvalid: "Please enter a valid phone number",
      eventDate: "Please select an event date",
      venue: "Please enter venue or city",
    },
  },
  navItems: [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "services", label: "Services" },
    { id: "gallery", label: "Gallery" },
    { id: "events", label: "Upcoming Events" },
    { id: "contact", label: "Contact" },
  ],
  upcomingEvents: {
    title: "Upcoming Events",
    subtitle:
      "Discover talent initiatives and cultural programs curated by Kamsale Entertainment across Karnataka.",
    featuredBadge: "Featured Event",
    auditionsBadge: "Online Auditions Open",
    featured: {
      slug: "vinootana-golden-singers",
      name: "Vinootana Golden Singers",
      subtitle: "Karnataka Statewide Talent Discovery & Online Auditions",
      description:
        "Vinootana Golden Singers is an initiative dedicated to discovering, encouraging, and promoting talented specially-abled individuals across Karnataka.",
      extendedDescription:
        "The program provides opportunities for singers, dancers, actors, choreographers, directors, cinematographers, performers, and other talented individuals to showcase their skills and receive future opportunities through Kamasale Entertainment.",
      highlights: ["Talent", "Confidence", "Opportunity", "Inclusion", "Creativity", "Growth"],
      cta: "Register for Audition",
      registerPath: "/register/vinootana-golden-singers",
    },
  },
  bookEvent: "Book Event",
};

const KN: typeof EN = {
  site: {
    name: "ಕಮ್ಸಾಲೆ ಎಂಟರ್‌ಟೈನ್‌ಮೆಂಟ್",
    tagline: "ನಿಮ್ಮ ಕಾರ್ಯಕ್ರಮಗಳಿಗೆ ಸಾಂಪ್ರದಾಯಿಕ ಮನರಂಜನೆ",
    phone: "+91 86600 55132",
    phoneRaw: "918660055132",
    email: "thewittyenterprise.com",
    location: "ಬೆಂಗಳೂರು, ಕರ್ನಾಟಕ",
    availability: "ಭಾರತಾದ್ಯಂತ ಲಭ್ಯ",
  },
  hero: {
    title: "ಕಮ್ಸಾಲೆ ಎಂಟರ್‌ಟೈನ್‌ಮೆಂಟ್",
    subtitle: "ಪ್ರತಿ ಆಚರಣೆಯಲ್ಲಿ ಸಂಸ್ಕೃತಿಯನ್ನು ಜೀವಂತಗೊಳಿಸುತ್ತೇವೆ",
    description:
      "ಕರ್ನಾಟಕದಾದ್ಯಂತ ಮದುವೆ, ದೇವಾಲಯ ಕಾರ್ಯಕ್ರಮಗಳು, ಕಾರ್ಪೊರೇಟ್ ಕಾರ್ಯಕ್ರಮಗಳು ಮತ್ತು ಉತ್ಸವಗಳಿಗೆ ನಾವು ಅಧಿಕೃತ ಕಮ್ಸಾಲೆ ಮತ್ತು ಜಾನಪದ ಪ್ರದರ್ಶನಗಳನ್ನು ನೀಡುತ್ತೇವೆ. ಒಂದೇ ಪ್ಯಾಕೇಜ್‌ನಲ್ಲಿ ಸ್ಮರಣೀಯ ಆಚರಣೆ, ಲಯಬದ್ಧ ಕಲೆ ಮತ್ತು ಶಕ್ತಿಶಾಲಿ ವೇದಿಕೆ ಶಕ್ತಿ ಅನುಭವಿಸಿ.",
    ctaPrimary: "ಗ್ಯಾಲರಿ ನೋಡಿ",
    ctaSecondary: "ಕಾರ್ಯಕ್ರಮ ಬುಕ್ ಮಾಡಿ",
  },
  stats: [
    { value: 100, suffix: "+", label: "ಕಾರ್ಯಕ್ರಮಗಳು ಆಯೋಜಿಸಲಾಗಿದೆ", icon: "calendar" },
    { value: 50, suffix: "+", label: "ಮದುವೆ ಕಾರ್ಯಕ್ರಮಗಳು", icon: "heart" },
    { value: 8, suffix: "+", label: "ವರ್ಷಗಳ ಅನುಭವ", icon: "award" },
    { value: 100, suffix: "%", label: "ಗ್ರಾಹಕರ ತೃಪ್ತಿ", icon: "star" },
  ],
  about: {
    title: "ನಮ್ಮ ಬಗ್ಗೆ",
    heading: "ಕರ್ನಾಟಕದ ಜೀವಂತ ಸಂಪ್ರದಾಯವನ್ನು ಸಂರಕ್ಷಿಸುತ್ತೇವೆ",
    description:
      "ಕಮ್ಸಾಲೆ ಎಂಟರ್‌ಟೈನ್‌ಮೆಂಟ್ ಚೈತನ್ಯಮಯ ದೇವಾಲಯ ಕಲೆ ಮತ್ತು ಸಾಂಸ್ಕೃತಿಕ ಕಾರ್ಯಕ್ರಮಗಳ ಮೂಲಕ ಕರ್ನಾಟಕದ ಜೀವಂತ ಸಂಪ್ರದಾಯವನ್ನು ಸಂರಕ್ಷಿಸುತ್ತದೆ. ನಮ್ಮ ಕಲಾವಿದರು ಶಕ್ತಿಶಾಲಿ ತಾಳ, ಜಾಗಟೆ ಮತ್ತು ಭಕ್ತಿಮಯ ಆರಾಧನೆಗಳೊಂದಿಗೆ ಅತಿಥಿಗಳನ್ನು ಪ್ರೇರೇಪಿಸುತ್ತಾರೆ.",
    highlights: [
      "ಶತಮಾನಗಳ ಸಂಪ್ರದಾಯದಲ್ಲಿ ಬೇರೂರಿದ ಅಧಿಕೃತ ಕಮ್ಸಾಲೆ ಪ್ರದರ್ಶನಗಳು",
      "ದೇವಾಲಯ ಕಲೆ ಮತ್ತು ಜಾನಪದ ಲಯದಲ್ಲಿ ತರಬೇತಿ ಪಡೆದ ವೃತ್ತಿಪರ ಕಲಾವಿದರು",
      "ಮದುವೆ, ದೇವಾಲಯ ಮತ್ತು ಕಾರ್ಪೊರೇಟ್ ಕಾರ್ಯಕ್ರಮಗಳಿಗೆ ಸಂಪೂರ್ಣ ಸಮನ್ವಯ",
      "ಕರ್ನಾಟಕದಾದ್ಯಂತ ವಿಶ್ವಾಸಾರ್ಹ ಮತ್ತು ಭಾರತಾದ್ಯಂತ ಲಭ್ಯ",
    ],
    quote: "ಸಂಸ್ಕೃತಿ ಕೇವಲ ಪ್ರದರ್ಶನದಲ್ಲಿ ಅಲ್ಲ — ಅದನ್ನು ಅನುಭವಿಸಬೇಕು.",
  },
  services: {
    title: "ನಮ್ಮ ಸೇವೆಗಳು",
    subtitle:
      "ಕಸ್ಟಮ್ ಆಚರಣೆಗಳಿಂದ ಕಾರ್ಯಕ್ರಮ ಮನರಂಜನೆಯವರೆಗೆ, ನಿಮ್ಮ ಮದುವೆ, ಸ್ವಾಗತ, ದೇವಾಲಯ ಕಾರ್ಯಕ್ರಮ ಅಥವಾ ಉತ್ಸವಕ್ಕೆ ನಾವು ಸಂಪೂರ್ಣ ಸಾಂಸ್ಕೃತಿಕ ಪ್ರದರ್ಶನ ಪರಿಹಾರಗಳನ್ನು ನೀಡುತ್ತೇವೆ.",
    items: [
      {
        title: "ಸಾಂಸ್ಕೃತಿಕ ಪ್ರದರ್ಶನಗಳು",
        description:
          "ಭಕ್ತಿಮಯ ಅನುಭವ ನೀಡುವ ಸಾಂಪ್ರದಾಯಿಕ ಕಮ್ಸಾಲೆ ತಾಳ, ಜಾಗಟೆ ಮತ್ತು ದೇವಾಲಯ-ಶೈಲಿಯ ಲಯ.",
        icon: "music",
      },
      {
        title: "ಮದುವೆ ಮನರಂಜನೆ",
        description:
          "ನಾಟಕ, ಪರಂಪರೆ ಮತ್ತು ಕಲಾತ್ಮಕ ಶಕ್ತಿಯಿಂದ ನಿಮ್ಮ ಮದುವೆ ಸಮಾರಂಭ ಮತ್ತು ಸ್ವಾಗತ ಕಾರ್ಯಕ್ರಮವನ್ನು ಅಲಂಕರಿಸುವ ಪೂರ್ಣ ಪ್ರದರ್ಶನ.",
        icon: "sparkles",
      },
      {
        title: "ದೇವಾಲಯ ಕಾರ್ಯಕ್ರಮಗಳು",
        description:
          "ದೇವಾಲಯ ಉತ್ಸವ, ಪೂಜೆ ಮತ್ತು ವಿಶೇಷ ಆಚರಣೆಗಳಿಗೆ ಭಕ್ತಿಮಯ ಕಾರ್ಯಕ್ರಮಗಳು ಮತ್ತು ಮೆರವಣಿಗೆ.",
        icon: "landmark",
      },
      {
        title: "ಕಾರ್ಪೊರೇಟ್ ಮತ್ತು ಖಾಸಗಿ ಕಾರ್ಯಕ್ರಮಗಳು",
        description:
          "ಕಾರ್ಪೊರೇಟ್ ಸಮ್ಮೇಳನ, ಉತ್ಪನ್ನ ಬಿಡುಗಡೆ, ವಾರ್ಷಿಕೋತ್ಸವ ಮತ್ತು ಕೌಟುಂಬಿಕ ಆಚರಣೆಗಳಿಗೆ ಸ್ಮರಣೀಯ ಪ್ರದರ್ಶನಗಳು.",
        icon: "building",
      },
      {
        title: "ಕಸ್ಟಮೈಸ್ ಮಾಡಿದ ಕಾರ್ಯಕ್ರಮಗಳು",
        description:
          "ನಿಮ್ಮ ವಿಷಯ, ವೇಳಾಪಟ್ಟಿ ಮತ್ತು ಸ್ಥಳ ಅವಶ್ಯಕತೆಗಳ ಸುತ್ತ ನಿರ್ಮಿಸಿದ ವೈಯಕ್ತಿಕ ಸಾಂಸ್ಕೃತಿಕ ಕಾರ್ಯಕ್ರಮಗಳು.",
        icon: "palette",
      },
    ],
  },
  gallery: {
    title: "ಗ್ಯಾಲರಿ",
    description:
      "ನಮ್ಮ ಪ್ರದರ್ಶನಗಳು ಮತ್ತು ಕಾರ್ಯಕ್ರಮಗಳ ಕ್ಷಣಗಳು — ವೇಷಭೂಷಣ, ವೇದಿಕೆ ಮತ್ತು ಕಮ್ಸಾಲೆ ಕಲೆಯ ಚೈತನ್ಯಮಯ ಶಕ್ತಿ.",
    images: [
      "/gallery/kamsale-stage.jpg",
      "/gallery/0.jpeg",
      "/gallery/1.jpeg",
      "/gallery/2.jpeg",
      "/gallery/3.jpeg",
      "/gallery/4.jpeg",
      "/gallery/5.jpeg",
      "/gallery/6.jpeg",
      "/gallery/8.jpeg",
      "/gallery/9.jpeg",
      "/gallery/22.jpeg",
    ],
  },
  testimonials: {
    title: "ಗ್ರಾಹಕರ ಅಭಿಪ್ರಾಯಗಳು",
    subtitle:
      "ಅಧಿಕೃತ ಪ್ರದರ್ಶನ, ನಿರ್ಬಾಧ ಸೇವೆ ಮತ್ತು ಸ್ಮರಣೀಯ ಸಾಂಸ್ಕೃತಿಕ ಕ್ಷಣಗಳಿಗಾಗಿ ಕುಟುಂಬಗಳು ಮತ್ತು ಆಯೋಜಕರು ನಮ್ಮನ್ನು ನಂಬಿದ್ದಾರೆ.",
    items: [
      {
        quote: "ಅದ್ಭುತ ಪ್ರದರ್ಶನ! ಇದು ನಮ್ಮ ಮದುವೆಗೆ ದಿವ್ಯ ವಾತಾವರಣ ನೀಡಿತು ಮತ್ತು ಎಲ್ಲಾ ಅತಿಥಿಗಳು ಮೆಚ್ಚಿದರು.",
        author: "ಸಂತೋಷದ ಗ್ರಾಹಕರು",
        rating: 5,
      },
      {
        quote: "ಅತ್ಯಂತ ವೃತ್ತಿಪರ ತಂಡ ಮತ್ತು ಅದ್ಭುತ ಸಾಂಪ್ರದಾಯಿಕ ನೃತ್ಯ. ಕಾರ್ಯಕ್ರಮ ಪರಿಪೂರ್ಣವಾಗಿ ಮುಗಿಯಿತು.",
        author: "ಕಾರ್ಯಕ್ರಮ ಆಯೋಜಕರು",
        rating: 5,
      },
      {
        quote: "ಅತಿಥಿಗಳಿಗೆ ಸಾಂಪ್ರದಾಯಿಕ ಸ್ಪರ್ಶ ಇಷ್ಟವಾಯಿತು ಮತ್ತು ಕಲಾವಿದರು ಸ್ನೇಹಪರ, ಸಮಯಕ್ಕೆ ಬಂದು ನುರಿತರಾಗಿದ್ದರು.",
        author: "ಕುಟುಂಬದ ಸದಸ್ಯ",
        rating: 5,
      },
      {
        quote: "ಪೂಜೆ ಪ್ರದರ್ಶನ ಮತ್ತು ಮೆರವಣಿಗೆ ಸುಂದರವಾಗಿ ನಡೆಯಿತು. ಆ ಶಕ್ತಿ ಮರೆಯಲಾಗದು.",
        author: "ವಧು ಮತ್ತು ವರ",
        rating: 5,
      },
    ],
  },
  contact: {
    title: "ಇಂದೇ ನಿಮ್ಮ ಕಾರ್ಯಕ್ರಮ ಬುಕ್ ಮಾಡಿ",
    subtitle:
      "ನಿಮ್ಮ ದಿನಾಂಕ ಈಗಲೇ ಕಾಯ್ದಿರಿಸಿ ಮತ್ತು ತ್ವರಿತ ಬುಕಿಂಗ್ ಮತ್ತು ಯೋಜನೆ ಬೆಂಬಲಕ್ಕಾಗಿ WhatsApp ನಲ್ಲಿ ನೇರವಾಗಿ ಸಂಪರ್ಕಿಸಿ.",
    formHint:
      "ನಾವು ಪರಿಪೂರ್ಣ ಪ್ರದರ್ಶನ ಯೋಜಿಸಲು ನಿಮ್ಮ ಕಾರ್ಯಕ್ರಮದ ದಿನಾಂಕ, ಸ್ಥಳ ಮತ್ತು ಪ್ರೇಕ್ಷಕರ ಸಂಖ್ಯೆ ತಿಳಿಸಿ.",
    details: "ಸಂಪರ್ಕ ವಿವರಗಳು",
    locationLabel: "ಸ್ಥಳ",
    emailLabel: "ಇಮೇಲ್",
    phoneLabel: "ಫೋನ್",
    whatsappLabel: "ವಾಟ್ಸ್‌ಆಪ್",
    chatNow: "ಈಗ ಮಾತನಾಡಿ",
    name: "ಹೆಸರು",
    phoneNumber: "ಫೋನ್ ನಂಬರ್",
    eventDate: "ಕಾರ್ಯಕ್ರಮದ ದಿನಾಂಕ",
    venue: "ಸ್ಥಳ / ನಗರ",
    additionalNotes: "ಹೆಚ್ಚುವರಿ ಟಿಪ್ಪಣಿಗಳು",
    sendRequest: "ಬುಕಿಂಗ್ ವಿನಂತಿ ಕಳುಹಿಸಿ",
    openingWhatsApp: "ನಿಮ್ಮ ಬುಕಿಂಗ್ ವಿವರಗಳೊಂದಿಗೆ WhatsApp ತೆರೆಯಲಾಗುತ್ತಿದೆ...",
    errors: {
      name: "ದಯವಿಟ್ಟು ನಿಮ್ಮ ಹೆಸರು ನಮೂದಿಸಿ",
      phone: "ದಯವಿಟ್ಟು ನಿಮ್ಮ ಫೋನ್ ನಂಬರ್ ನಮೂದಿಸಿ",
      phoneInvalid: "ದಯವಿಟ್ಟು ಮಾನ್ಯ ಫೋನ್ ನಂಬರ್ ನಮೂದಿಸಿ",
      eventDate: "ದಯವಿಟ್ಟು ಕಾರ್ಯಕ್ರಮದ ದಿನಾಂಕ ಆಯ್ಕೆ ಮಾಡಿ",
      venue: "ದಯವಿಟ್ಟು ಸ್ಥಳ ಅಥವಾ ನಗರ ನಮೂದಿಸಿ",
    },
  },
  navItems: [
    { id: "home", label: "ಮುಖಪುಟ" },
    { id: "about", label: "ನಮ್ಮ ಬಗ್ಗೆ" },
    { id: "services", label: "ಸೇವೆಗಳು" },
    { id: "gallery", label: "ಗ್ಯಾಲರಿ" },
    { id: "events", label: "ಮುಂಬರುವ ಕಾರ್ಯಕ್ರಮಗಳು" },
    { id: "contact", label: "ಸಂಪರ್ಕಿಸಿ" },
  ],
  upcomingEvents: {
    title: "ಮುಂಬರುವ ಕಾರ್ಯಕ್ರಮಗಳು",
    subtitle:
      "ಕರ್ನಾಟಕದಾದ್ಯಂತ ಕಮ್ಸಾಲೆ ಎಂಟರ್‌ಟೈನ್‌ಮೆಂಟ್ ನಿರ್ಮಿಸಿದ ಪ್ರತಿಭಾ ಉಪಕ್ರಮಗಳು ಮತ್ತು ಸಾಂಸ್ಕೃತಿಕ ಕಾರ್ಯಕ್ರಮಗಳನ್ನು ಅನ್ವೇಷಿಸಿ.",
    featuredBadge: "ವಿಶೇಷ ಕಾರ್ಯಕ್ರಮ",
    auditionsBadge: "ಆನ್‌ಲೈನ್ ಆಡಿಶನ್ ತೆರೆದಿದೆ",
    featured: {
      slug: "vinootana-golden-singers",
      name: "ವಿನೂತನ ಗೋಲ್ಡನ್ ಸಿಂಗರ್ಸ್",
      subtitle: "ಕರ್ನಾಟಕ ರಾಜ್ಯ ಪ್ರತಿಭಾ ಶೋಧ ಮತ್ತು ಆನ್‌ಲೈನ್ ಆಡಿಶನ್",
      description:
        "ವಿನೂತನ ಗೋಲ್ಡನ್ ಸಿಂಗರ್ಸ್ ಕರ್ನಾಟಕದಾದ್ಯಂತ ಪ್ರತಿಭಾವಂತ ವಿಶೇಷ ಚೇತನ ವ್ಯಕ್ತಿಗಳನ್ನು ಶೋಧಿಸಲು, ಪ್ರೋತ್ಸಾಹಿಸಲು ಮತ್ತು ಉತ್ತೇಜಿಸಲು ಮೀಸಲಾದ ಉಪಕ್ರಮ.",
      extendedDescription:
        "ಈ ಕಾರ್ಯಕ್ರಮ ಗಾಯಕರು, ನರ್ತಕರು, ನಟರು, ನೃತ್ಯ ನಿರ್ದೇಶಕರು, ನಿರ್ದೇಶಕರು, ಛಾಯಾಗ್ರಾಹಕರು ಮತ್ತು ಇತರ ಪ್ರತಿಭಾವಂತ ವ್ಯಕ್ತಿಗಳಿಗೆ ಕಮ್ಸಾಲೆ ಎಂಟರ್‌ಟೈನ್‌ಮೆಂಟ್ ಮೂಲಕ ಭವಿಷ್ಯದ ಅವಕಾಶಗಳನ್ನು ಪಡೆಯಲು ಅವಕಾಶ ನೀಡುತ್ತದೆ.",
      highlights: ["ಪ್ರತಿಭೆ", "ಆತ್ಮವಿಶ್ವಾಸ", "ಅವಕಾಶ", "ಒಳಗೊಳ್ಳುವಿಕೆ", "ಸೃಜನಶೀಲತೆ", "ಬೆಳವಣಿಗೆ"],
      cta: "ಆಡಿಶನ್‌ಗೆ ನೋಂದಣಿ ಮಾಡಿ",
      registerPath: "/register/vinootana-golden-singers",
    },
  },
  bookEvent: "ಕಾರ್ಯಕ್ರಮ ಬುಕ್ ಮಾಡಿ",
};

type ContentType = typeof EN;

interface LanguageContextType {
  lang: Language;
  toggleLanguage: () => void;
  content: ContentType;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>("en");
  const toggleLanguage = () => setLang((l) => (l === "en" ? "kn" : "en"));
  const content = lang === "en" ? EN : KN;
  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, content }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useContent() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useContent must be used inside LanguageProvider");
  return ctx;
}