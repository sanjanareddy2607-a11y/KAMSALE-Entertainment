import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { useContent } from "../context/LanguageContext";
import { SectionHeading } from "./ui/SectionHeading";

export function Testimonials() {
  const { content } = useContent();

  return (
    <section
      className="py-20 md:py-28 bg-gradient-to-b from-white to-cream"
      aria-labelledby="testimonials-heading"
    >
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          title={content.testimonials.title}
          subtitle={content.testimonials.subtitle}
        />

        <div
          id="testimonials-heading"
          className="grid sm:grid-cols-2 gap-6 md:gap-8"
        >
          {content.testimonials.items.map((testimonial, index) => (
            <motion.article
              key={testimonial.author}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -4 }}
              className="group relative rounded-3xl bg-white p-8 md:p-10 card-border premium-shadow hover:glow-gold transition-all duration-500"
            >
              <Quote
                size={40}
                className="absolute top-6 right-6 text-gold-100 group-hover:text-gold-200 transition-colors duration-300"
                aria-hidden="true"
              />

              <div className="flex gap-1 mb-5" aria-label={`${testimonial.rating} out of 5 stars`}>
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className="fill-gold-400 text-gold-400"
                    aria-hidden="true"
                  />
                ))}
              </div>

              <blockquote className="relative z-10">
                <p className="font-display text-xl md:text-2xl text-charcoal leading-relaxed italic">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <footer className="mt-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-200 to-gold-400 flex items-center justify-center">
                    <span className="font-display text-sm font-semibold text-white">
                      {testimonial.author.charAt(0)}
                    </span>
                  </div>
                  <cite className="not-italic text-warm-gray font-medium">
                    — {testimonial.author}
                  </cite>
                </footer>
              </blockquote>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}