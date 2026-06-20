import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronDown, CheckCircle2, ArrowLeft } from "lucide-react";
import { useContent } from "../context/LanguageContext";
import { RegistrationWizard } from "../registration/RegistrationWizard";

function FaqItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="rounded-2xl bg-white card-border overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-gold-50/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500"
        aria-expanded={isOpen}
      >
        <span className="font-medium text-charcoal">{question}</span>
        <ChevronDown
          size={20}
          className={`flex-shrink-0 text-gold-500 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </button>
      {isOpen && (
        <div className="px-6 pb-5 text-warm-gray leading-relaxed border-t border-gold-100/80 pt-4">
          {answer}
        </div>
      )}
    </div>
  );
}

export function RegisterVinootanaPage() {
  const { content } = useContent();
  const { featured } = content.upcomingEvents;
  const page = content.registrationPage;
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <>
      <section
        className="relative pt-28 pb-16 md:pt-36 md:pb-24 bg-gradient-to-b from-cream to-white overflow-hidden"
        aria-labelledby="register-hero-heading"
      >
        <div
          className="absolute inset-0 opacity-30"
          aria-hidden="true"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, rgba(184,134,46,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(184,134,46,0.06) 0%, transparent 40%)",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-5 md:px-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-warm-gray hover:text-gold-600 transition-colors mb-8 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 rounded-lg"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            {page.backToHome}
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <span className="inline-block mb-4 px-4 py-1.5 rounded-full bg-gold-50 border border-gold-200/60 text-xs font-medium tracking-wider uppercase text-gold-700">
              {page.onlineAuditionsBadge}
            </span>
            <h1
              id="register-hero-heading"
              className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-charcoal tracking-tight"
            >
              {featured.name}
            </h1>
            <p className="mt-4 text-gold-600 text-lg md:text-xl font-medium">
              {featured.subtitle}
            </p>
            <p className="mt-6 text-warm-gray text-lg leading-relaxed">
              {featured.description} {featured.extendedDescription}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-white" aria-labelledby="overview-heading">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <h2
            id="overview-heading"
            className="font-display text-3xl md:text-4xl font-semibold text-charcoal mb-8"
          >
            {page.overview.heading}
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <p className="text-warm-gray leading-relaxed text-lg">
              {page.overview.description}
            </p>
            <ul className="space-y-3">
              {featured.highlights.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 text-charcoal"
                >
                  <CheckCircle2
                    size={20}
                    className="text-gold-500 flex-shrink-0"
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section
        className="py-16 md:py-20 bg-cream"
        aria-labelledby="eligibility-heading"
      >
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <h2
            id="eligibility-heading"
            className="font-display text-3xl md:text-4xl font-semibold text-charcoal mb-8"
          >
            {page.eligibility.heading}
          </h2>
          <ul className="grid sm:grid-cols-2 gap-4 max-w-4xl">
            {page.eligibility.points.map((point) => (
              <li
                key={point}
                className="flex items-start gap-3 rounded-2xl bg-white p-5 card-border"
              >
                <CheckCircle2
                  size={20}
                  className="text-gold-500 flex-shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <span className="text-warm-gray leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        className="py-16 md:py-20 bg-white"
        aria-labelledby="process-heading"
      >
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <h2
            id="process-heading"
            className="font-display text-3xl md:text-4xl font-semibold text-charcoal mb-10"
          >
            {page.process.heading}
          </h2>
          <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {page.process.steps.map((item) => (
              <li
                key={item.step}
                className="rounded-3xl bg-cream p-6 md:p-8 card-border premium-shadow hover:glow-gold transition-all duration-500"
              >
                <span className="font-display text-3xl font-semibold text-gold-400">
                  {item.step}
                </span>
                <h3 className="font-display text-xl font-semibold text-charcoal mt-4 mb-2">
                  {item.title}
                </h3>
                <p className="text-warm-gray text-sm leading-relaxed">
                  {item.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-cream" aria-labelledby="faq-heading">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <h2
            id="faq-heading"
            className="font-display text-3xl md:text-4xl font-semibold text-charcoal mb-8 text-center"
          >
            {page.faq.heading}
          </h2>
          <div className="space-y-3">
            {page.faq.items.map((item, index) => (
              <FaqItem
                key={item.question}
                question={item.question}
                answer={item.answer}
                isOpen={openFaq === index}
                onToggle={() =>
                  setOpenFaq(openFaq === index ? null : index)
                }
              />
            ))}
          </div>
        </div>
      </section>

      <section
        id="registration-form"
        className="py-16 md:py-24 bg-white"
        aria-labelledby="form-heading"
      >
        <div className="mx-auto max-w-4xl px-5 md:px-8">
          <div className="text-center mb-10">
            <h2
              id="form-heading"
              className="font-display text-3xl md:text-4xl font-semibold text-charcoal"
            >
              {page.form.heading}
            </h2>
            <p className="mt-4 text-warm-gray max-w-xl mx-auto">
              {page.form.subtitle}
            </p>
          </div>
          <RegistrationWizard />
        </div>
      </section>
    </>
  );
}