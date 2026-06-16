import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Sparkles, ArrowRight, Users } from "lucide-react";
import { useContent } from "../context/LanguageContext";
import { SectionHeading } from "./ui/SectionHeading";

export function UpcomingEvents() {
  const { content } = useContent();
  const { featured } = content.upcomingEvents;

  return (
    <section
      id="events"
      className="py-20 md:py-28 bg-gradient-to-b from-white to-cream"
      aria-labelledby="events-heading"
    >
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          title={content.upcomingEvents.title}
          subtitle={content.upcomingEvents.subtitle}
          headingId="events-heading"
        />

        <motion.article
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="group relative max-w-4xl mx-auto rounded-3xl bg-white card-border premium-shadow-lg overflow-hidden hover:glow-gold transition-all duration-500"
        >
          <div
            className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-gold-100/70 to-transparent rounded-bl-full opacity-60 group-hover:opacity-100 transition-opacity duration-500"
            aria-hidden="true"
          />

          <div className="relative p-8 md:p-12">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-gold-50 border border-gold-200/60 px-4 py-1.5 text-xs font-medium tracking-wider uppercase text-gold-700">
                <Sparkles size={14} aria-hidden="true" />
                {content.upcomingEvents.featuredBadge}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-cream border border-gold-100 px-4 py-1.5 text-xs font-medium text-warm-gray">
                <Calendar size={14} aria-hidden="true" />
                {content.upcomingEvents.auditionsBadge}
              </span>
            </div>

            <h3 className="font-display text-3xl md:text-4xl font-semibold text-charcoal mb-2">
              {featured.name}
            </h3>

            <p className="text-gold-600 font-medium text-lg mb-6">
              {featured.subtitle}
            </p>

            <p className="text-warm-gray leading-relaxed mb-4">
              {featured.description}
            </p>

            <p className="text-warm-gray leading-relaxed mb-8">
              {featured.extendedDescription}
            </p>

            <ul className="flex flex-wrap gap-2 mb-10" aria-label="Program focus areas">
              {featured.highlights.map((item) => (
                <li
                  key={item}
                  className="inline-flex items-center gap-1.5 rounded-full bg-gold-50/80 border border-gold-200/50 px-3.5 py-1.5 text-sm text-gold-800"
                >
                  <Users size={14} className="text-gold-500" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>

            <Link
              to={featured.registerPath}
              className="inline-flex items-center justify-center gap-3 rounded-full bg-charcoal px-8 py-4 text-sm font-semibold text-white transition-all duration-300 hover:bg-gold-600 hover:shadow-lg hover:shadow-gold-400/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 w-full sm:w-auto"
            >
              {featured.cta}
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </motion.article>
      </div>
    </section>
  );
}