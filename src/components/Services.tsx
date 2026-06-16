import { motion } from "framer-motion";
import {
  Music,
  Sparkles,
  Landmark,
  Building2,
  Palette,
} from "lucide-react";
import { useContent } from "../context/LanguageContext";
import { SectionHeading } from "./ui/SectionHeading";

const iconMap = {
  music: Music,
  sparkles: Sparkles,
  landmark: Landmark,
  building: Building2,
  palette: Palette,
} as const;

export function Services() {
  const { content } = useContent();

  return (
    <section
      id="services"
      className="py-20 md:py-28 bg-gradient-to-b from-cream to-white"
      aria-labelledby="services-heading"
    >
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          title={content.services.title}
          subtitle={content.services.subtitle}
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-6 gap-6 md:gap-8">
          {content.services.items.map((service, index) => {
            const Icon = iconMap[service.icon as keyof typeof iconMap];
            const colSpan = index < 3 ? "sm:col-span-1 lg:col-span-2" : "sm:col-span-1 lg:col-span-3";
            return (
              <motion.article
                key={service.title}
                id={index === 0 ? "services-heading" : undefined}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: index * 0.08, duration: 0.5 }}
                whileHover={{ y: -8 }}
                className={`group relative rounded-3xl bg-white p-8 card-border premium-shadow hover:glow-gold transition-all duration-500 overflow-hidden ${colSpan}`}
              >
                <div
                  className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-gold-100/60 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  aria-hidden="true"
                />

                <div className="relative">
                  <div className="mb-6 inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-50 to-gold-100 text-gold-600 group-hover:from-gold-100 group-hover:to-gold-200 transition-all duration-500">
                    <Icon size={26} strokeWidth={1.5} aria-hidden="true" />
                  </div>

                  <h3 className="font-display text-2xl font-semibold text-charcoal mb-3 group-hover:text-gold-700 transition-colors duration-300">
                    {service.title}
                  </h3>

                  <p className="text-warm-gray leading-relaxed">
                    {service.description}
                  </p>

                  <div className="mt-6 h-0.5 w-0 bg-gradient-to-r from-gold-400 to-gold-200 group-hover:w-full transition-all duration-500" />
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}