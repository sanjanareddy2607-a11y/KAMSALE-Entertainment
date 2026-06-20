import { Link, useLocation, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import { CheckCircle2, Home, Copy, Check, ExternalLink } from "lucide-react";
import { useContent } from "../context/LanguageContext";

interface SuccessPageState {
  registrationId?: number;
}

export function RegisterSuccessPage() {
  const { content } = useContent();
  const success = content.registrationPage.success;
  const location = useLocation();
  const state = location.state as SuccessPageState | null;
  const registrationId = state?.registrationId;
  const [copied, setCopied] = useState(false);

  // If someone lands here directly (refresh, bookmark, back button) without
  // having just submitted the form, there's no registrationId in state.
  // Send them home instead of showing a confusing blank ID.
  if (!registrationId) {
    return <Navigate to="/" replace />;
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(String(registrationId));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API can fail on some browsers/permissions; copy button
      // simply won't show the "copied" state, no crash either way.
    }
  };

  return (
    <section className="min-h-[70vh] flex items-center justify-center py-24 md:py-32 bg-gradient-to-b from-cream to-white">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-2xl px-5 md:px-8 text-center"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gold-50 border border-gold-200 mb-8">
          <CheckCircle2 size={40} className="text-gold-600" aria-hidden="true" />
        </div>

        <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-charcoal mb-6">
          {success.thankYouHeading}
        </h1>

        <div className="rounded-3xl bg-white p-8 md:p-10 card-border premium-shadow-lg text-left space-y-4">
          <p className="text-warm-gray leading-relaxed">{success.line1}</p>
          <p className="text-warm-gray leading-relaxed">{success.line2}</p>

          {/* Registration ID callout */}
          <div className="rounded-2xl bg-gold-50/70 border border-gold-200 p-6 space-y-3">
            <p className="text-sm font-medium text-charcoal">
              {success.idLabel}
            </p>
            <div className="flex items-center gap-3">
              <span className="font-display text-2xl md:text-3xl font-semibold text-gold-700">
                #{registrationId}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                aria-label="Copy registration ID"
                className="inline-flex items-center gap-1.5 rounded-full border border-gold-200 bg-white px-3 py-1.5 text-xs font-medium text-charcoal transition-all duration-300 hover:bg-gold-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500"
              >
                {copied ? (
                  <>
                    <Check size={14} aria-hidden="true" />
                    {success.copied}
                  </>
                ) : (
                  <>
                    <Copy size={14} aria-hidden="true" />
                    {success.copy}
                  </>
                )}
              </button>
            </div>
            <p className="text-sm text-warm-gray leading-relaxed">
              {success.idHint}
            </p>
          </div>

          <p className="text-warm-gray leading-relaxed">{success.line3}</p>
          <p className="text-charcoal font-medium leading-relaxed">
            {success.line4}
          </p>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSdPZnLIfem8zXfZQhbPYGx_kHqrT7dQRPoCwUqcL4iGkS9-9w/viewform?usp=dialog"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-charcoal px-8 py-4 text-sm font-semibold text-white transition-all duration-300 hover:bg-gold-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500"
          >
            <ExternalLink size={18} aria-hidden="true" />
            {success.openFormButton}
          </a>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-gold-200 px-8 py-4 text-sm font-semibold text-charcoal transition-all duration-300 hover:bg-gold-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500"
          >
            <Home size={18} aria-hidden="true" />
            {success.homeButton}
          </Link>
        </div>
      </motion.div>
    </section>
  );
}