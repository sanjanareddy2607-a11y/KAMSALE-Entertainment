import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Send,
  CheckCircle2,
} from "lucide-react";
import { useContent } from "../context/LanguageContext";
import { SectionHeading } from "./ui/SectionHeading";
import { VenueAutocomplete } from "./VenueAutocomplete";
import { openWhatsAppBooking, type BookingFormData } from "../utils/whatsapp";

interface FormErrors {
  name?: string;
  phone?: string;
  eventDate?: string;
  venue?: string;
}

type ContactErrorMessages = {
  name: string;
  phone: string;
  phoneInvalid: string;
  eventDate: string;
  venue: string;
};

function FloatingInput({
  id,
  label,
  type = "text",
  value,
  onChange,
  error,
  min,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  min?: string;
}) {
  const hasValue = value.trim().length > 0;

  return (
    <div>
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={type === "date" ? undefined : " "}
          min={min}
          aria-invalid={!!error}
          className={
            "peer w-full rounded-xl border bg-white px-4 text-charcoal transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gold-400/40 " +
            (type === "date" ? "pt-7 pb-2 " : "pt-6 pb-2 ") +
            "placeholder-shown:pt-6 placeholder-shown:pb-2 " +
            (error
              ? "border-red-400 focus:border-red-400"
              : "border-gold-200/80 focus:border-gold-400")
          }
        />
        <label
          htmlFor={id}
          className={
            "absolute left-4 transition-all duration-300 pointer-events-none " +
            (type === "date" || hasValue
              ? "top-2 text-xs text-gold-600 font-medium"
              : "top-1/2 -translate-y-1/2 text-warm-gray peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-gold-600 peer-focus:font-medium")
          }
        >
          {label}
        </label>
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function validateForm(data: BookingFormData, e: ContactErrorMessages): FormErrors {
  const errors: FormErrors = {};
  if (!data.name.trim()) errors.name = e.name;
  if (!data.phone.trim()) {
    errors.phone = e.phone;
  } else if (!/^[+\d\s-]{10,15}$/.test(data.phone.trim())) {
    errors.phone = e.phoneInvalid;
  }
  if (!data.eventDate) errors.eventDate = e.eventDate;
  if (!data.venue.trim()) errors.venue = e.venue;
  return errors;
}

export function Contact() {
  const { content } = useContent();

  const [form, setForm] = useState<BookingFormData>({
    name: "",
    phone: "",
    eventDate: "",
    venue: "",
    notes: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const update = (field: keyof BookingFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm(form, content.contact.errors);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setSubmitted(true);
    openWhatsAppBooking(form);
    setTimeout(() => setSubmitted(false), 4000);
  };

  const today = new Date().toISOString().split("T")[0];

  const mailtoHref = "mailto:" + content.site.email;
  const telHref = "tel:" + content.site.phone.replace(/\s/g, "");
  const waHref = "https://wa.me/" + content.site.phoneRaw;

  return (
    <section
      id="contact"
      className="py-20 md:py-28 bg-white"
      aria-labelledby="contact-heading"
    >
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          title={content.contact.title}
          subtitle={content.contact.subtitle}
          headingId="contact-heading"
        />

        <div className="grid lg:grid-cols-5 gap-10 lg:gap-16">
          <motion.aside
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <h3 className="font-display text-2xl md:text-3xl font-semibold text-charcoal mb-8">
              {content.contact.details}
            </h3>

            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <span className="flex-shrink-0 w-11 h-11 rounded-xl bg-gold-50 flex items-center justify-center text-gold-600">
                  <MapPin size={20} aria-hidden="true" />
                </span>
                <div>
                  <p className="font-medium text-charcoal">{content.contact.locationLabel}</p>
                  <p className="text-warm-gray mt-0.5">{content.site.location}</p>
                  <p className="text-sm text-gold-600 mt-1">{content.site.availability}</p>
                </div>
              </li>

              <li className="flex items-start gap-4">
                <span className="flex-shrink-0 w-11 h-11 rounded-xl bg-gold-50 flex items-center justify-center text-gold-600">
                  <Mail size={20} aria-hidden="true" />
                </span>
                <div>
                  <p className="font-medium text-charcoal">{content.contact.emailLabel}</p>
                  <a
                    href={mailtoHref}
                    className="text-warm-gray hover:text-gold-600 transition-colors mt-0.5 inline-block"
                  >
                    {content.site.email}
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-4">
                <span className="flex-shrink-0 w-11 h-11 rounded-xl bg-gold-50 flex items-center justify-center text-gold-600">
                  <Phone size={20} aria-hidden="true" />
                </span>
                <div>
                  <p className="font-medium text-charcoal">{content.contact.phoneLabel}</p>
                  <a
                    href={telHref}
                    className="text-warm-gray hover:text-gold-600 transition-colors mt-0.5 inline-block"
                  >
                    {content.site.phone}
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-4">
                <span className="flex-shrink-0 w-11 h-11 rounded-xl bg-[#25D366]/10 flex items-center justify-center text-[#25D366]">
                  <MessageCircle size={20} aria-hidden="true" />
                </span>
                <div>
                  <p className="font-medium text-charcoal">{content.contact.whatsappLabel}</p>
                  <a
                    href={waHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-1 text-[#25D366] font-medium hover:underline"
                  >
                    {content.contact.chatNow}
                  </a>
                </div>
              </li>
            </ul>
          </motion.aside>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-3"
          >
            <form
              onSubmit={handleSubmit}
              className="rounded-3xl bg-cream p-6 md:p-10 card-border premium-shadow-lg"
              noValidate
            >
              <p className="text-warm-gray mb-8 leading-relaxed">
                {content.contact.formHint}
              </p>

              <div className="grid sm:grid-cols-2 gap-5 md:gap-6">
                <FloatingInput
                  id="booking-name"
                  label={content.contact.name}
                  value={form.name}
                  onChange={(v) => update("name", v)}
                  error={errors.name}
                />
                <FloatingInput
                  id="booking-phone"
                  label={content.contact.phoneNumber}
                  type="tel"
                  value={form.phone}
                  onChange={(v) => update("phone", v)}
                  error={errors.phone}
                />
                <FloatingInput
                  id="booking-date"
                  label={content.contact.eventDate}
                  type="date"
                  value={form.eventDate}
                  onChange={(v) => update("eventDate", v)}
                  error={errors.eventDate}
                  min={today}
                />
                <VenueAutocomplete
                  value={form.venue}
                  onChange={(v) => update("venue", v)}
                  error={errors.venue}
                />
              </div>

              <div className="mt-5 md:mt-6">
                <div className="relative">
                  <textarea
                    id="booking-notes"
                    value={form.notes}
                    onChange={(e) => update("notes", e.target.value)}
                    placeholder=" "
                    rows={4}
                    className="peer w-full rounded-xl border border-gold-200/80 bg-white px-4 pt-6 pb-2 text-charcoal transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gold-400/40 focus:border-gold-400 resize-none"
                  />
                  <label
                    htmlFor="booking-notes"
                    className={
                      "absolute left-4 transition-all duration-300 pointer-events-none " +
                      (form.notes.trim()
                        ? "top-2 text-xs text-gold-600 font-medium"
                        : "top-4 text-warm-gray")
                    }
                  >
                    {content.contact.additionalNotes}
                  </label>
                </div>
              </div>

              <div className="mt-8 relative">
                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-full bg-[#25D366] px-8 py-4 text-white font-semibold transition-all duration-300 hover:bg-[#1fb855] hover:shadow-lg hover:shadow-[#25D366]/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366] disabled:opacity-70"
                >
                  <Send size={18} aria-hidden="true" />
                  {content.contact.sendRequest}
                </button>

                <AnimatePresence>
                  {submitted && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="mt-4 flex items-center gap-2 text-[#25D366] font-medium"
                      role="status"
                    >
                      <CheckCircle2 size={20} aria-hidden="true" />
                      {content.contact.openingWhatsApp}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}