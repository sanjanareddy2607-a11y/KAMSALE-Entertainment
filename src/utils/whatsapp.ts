import { SITE } from "../data/content";

export interface BookingFormData {
  name: string;
  phone: string;
  eventDate: string;
  venue: string;
  notes: string;
}

export function buildWhatsAppMessage(data: BookingFormData): string {
  const lines = [
    "🎉 *Kamsale Entertainment — Event Booking Request*",
    "",
    `*Name:* ${data.name}`,
    `*Phone:* ${data.phone}`,
    `*Event Date:* ${data.eventDate}`,
    `*Venue / City:* ${data.venue}`,
  ];

  if (data.notes.trim()) {
    lines.push(`*Additional Notes:* ${data.notes.trim()}`);
  }

  lines.push("", "Please confirm availability and share pricing details. Thank you!");

  return lines.join("\n");
}

export function openWhatsAppBooking(data: BookingFormData): void {
  const message = buildWhatsAppMessage(data);
  const url = `https://wa.me/${SITE.phoneRaw}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}
