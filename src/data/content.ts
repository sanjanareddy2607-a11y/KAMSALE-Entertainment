export const SITE = {
  name: "Kamsale Entertainment",
  tagline: "Traditional Entertainment for Your Events",
  phone: "+91 86600 55132",
  phoneRaw: "918660055132",
  email: "thewittyenterprise.com",
  location: "Bangalore, Karnataka",
  availability: "Available across India",
} as const;

export const HERO = {
  title: "Kamsale Entertainment",
  subtitle: "Bringing Culture to Life at Every Celebration",
  description:
    "We deliver authentic Kamsale and folk performances for weddings, temple functions, corporate events and festivals across Karnataka. Create memorable rituals, graceful rhythm, and powerful stage energy in one complete package.",
  ctaPrimary: "View Gallery",
  ctaSecondary: "Book Event",
} as const;

export const STATS = [
  { value: 100, suffix: "+", label: "Events Organized", icon: "calendar" },
  { value: 50, suffix: "+", label: "Weddings Served", icon: "heart" },
  { value: 8, suffix: "+", label: "Years Experience", icon: "award" },
  { value: 100, suffix: "%", label: "Client Satisfaction", icon: "star" },
] as const;

export const ABOUT = {
  title: "About Us",
  description:
    "Kamsale Entertainment preserves Karnataka's living tradition through dynamic temple art and cultural shows. Our artists perform with powerful drums, cymbals, and devotional routines that inspire guests and create a truly immersive celebration.",
  highlights: [
    "Authentic Kamsale performances rooted in centuries of tradition",
    "Professional artists trained in temple art and folk rhythm",
    "End-to-end coordination for weddings, temples, and corporate events",
    "Trusted across Karnataka and available throughout India",
  ],
} as const;

export const SERVICES = [
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
] as const;

export const GALLERY = {
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
} as const;

export const TESTIMONIALS = [
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
] as const;

export const CONTACT = {
  title: "Book Your Event Today",
  subtitle:
    "Reserve your date now and connect directly on WhatsApp for fast booking and planning support.",
  formHint:
    "Tell us your event date, venue and audience size so we can plan the perfect performance.",
} as const;

export const NAV_ITEMS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "services", label: "Services" },
  { id: "gallery", label: "Gallery" },
  { id: "events", label: "Upcoming Events" },
  { id: "contact", label: "Contact" },
] as const;

export const UPCOMING_EVENTS = {
  title: "Upcoming Events",
  subtitle:
    "Discover talent initiatives and cultural programs curated by Kamsale Entertainment across Karnataka.",
  featured: {
    slug: "vinootana-golden-singers",
    name: "Vinootana Golden Singers",
    subtitle: "Karnataka Statewide Talent Discovery & Online Auditions",
    description:
      "Vinootana Golden Singers is an initiative dedicated to discovering, encouraging, and promoting talented specially-abled individuals across Karnataka.",
    extendedDescription:
      "The program provides opportunities for singers, dancers, actors, choreographers, directors, cinematographers, performers, and other talented individuals to showcase their skills and receive future opportunities through Kamasale Entertainment.",
    highlights: [
      "Talent",
      "Confidence",
      "Opportunity",
      "Inclusion",
      "Creativity",
      "Growth",
    ],
    cta: "Register for Audition",
    registerPath: "/register/vinootana-golden-singers",
  },
} as const;
