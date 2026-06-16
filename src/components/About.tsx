import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useContent } from "../context/LanguageContext";
import { SectionHeading } from "./ui/SectionHeading";

export function About() {
  const { content } = useContent();

  return (
    <section id="about" className="py-20 md:py-28 bg-white" aria-labelledby="about-heading">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading title={content.about.title} />

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden glow-gold">
              <img
                src="/gallery/1.jpeg"
                alt="Kamsale performers in traditional costume during a cultural event"
                className="w-full aspect-[4/5] object-cover"
                loading="lazy"
                width={600}
                height={750}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/30 via-transparent to-transparent" />
            </div>

            <div
              className="absolute -bottom-6 -right-4 md:-right-8 w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden border-4 border-white premium-shadow-lg hidden sm:block"
              aria-hidden="true"
            >
              <img
                src="/gallery/5.jpeg"
                alt=""
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            <div
              className="absolute -top-4 -left-4 w-20 h-20 rounded-full border-2 border-gold-300/50 bg-gold-50/80 backdrop-blur-sm"
              aria-hidden="true"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <h3
              id="about-heading"
              className="font-display text-3xl md:text-4xl font-semibold text-charcoal leading-snug mb-6"
            >
              {content.about.heading}
            </h3>

            <p className="text-warm-gray text-lg leading-relaxed mb-8">
              {content.about.description}
            </p>

            <ul className="space-y-4">
              {content.about.highlights.map((item, i) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <span className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-gold-100 flex items-center justify-center">
                    <Check size={14} className="text-gold-600" strokeWidth={2.5} aria-hidden="true" />
                  </span>
                  <span className="text-charcoal/90 leading-relaxed">{item}</span>
                </motion.li>
              ))}
            </ul>

            <div className="mt-10 pt-8 border-t border-gold-100">
              <p className="font-display text-2xl italic text-gold-600">
                &ldquo;{content.about.quote}&rdquo;
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}