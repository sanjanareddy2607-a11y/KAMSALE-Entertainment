export const KARNATAKA_DISTRICTS = [
  "Bagalkot",
  "Ballari",
  "Belagavi",
  "Bengaluru Rural",
  "Bengaluru Urban",
  "Bidar",
  "Chamarajanagar",
  "Chikkaballapur",
  "Chikkamagaluru",
  "Chitradurga",
  "Dakshina Kannada",
  "Davanagere",
  "Dharwad",
  "Gadag",
  "Hassan",
  "Haveri",
  "Kalaburagi",
  "Kodagu",
  "Kolar",
  "Koppal",
  "Mandya",
  "Mysuru",
  "Raichur",
  "Ramanagara",
  "Shivamogga",
  "Tumakuru",
  "Udupi",
  "Uttara Kannada",
  "Vijayapura",
  "Vijayanagara",
  "Yadgir",
] as const;

export type KarnatakaDistrict = (typeof KARNATAKA_DISTRICTS)[number];

export function filterDistricts(query: string): KarnatakaDistrict[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [...KARNATAKA_DISTRICTS];
  return KARNATAKA_DISTRICTS.filter((district) =>
    district.toLowerCase().includes(normalized)
  );
}
