import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Calendar, Heart, Award, Star } from "lucide-react";
import { useContent } from "../context/LanguageContext";
import { AnimatedCounter } from "./ui/AnimatedCounter";

const iconMap = {
  calendar: Calendar,
  heart: Heart,
  award: Award,
  star: Star,
} as const;

export function Stats() {
  const { content } = useContent();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section className="relative py-16 md:py-20 bg-cream" aria-label="Statistics">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div ref={ref} className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {content.stats.map((stat, index) => {
            const Icon = iconMap[stat.icon as keyof typeof iconMap];
            return (
              <motion.article
                key={stat.label}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className="group relative rounded-2xl bg-white p-6 md:p-8 card-border premium-shadow hover:glow-gold transition-shadow duration-500"
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-1 w-16 bg-gradient-to-r from-transparent via-gold-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true" />

                <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gold-50 text-gold-600 group-hover:bg-gold-100 transition-colors duration-300">
                  <Icon size={22} strokeWidth={1.5} aria-hidden="true" />
                </div>

                <p className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-charcoal" aria-label={`${stat.value}${stat.suffix} ${stat.label}`}>
                  <AnimatedCounter
                    value={stat.value}
                    suffix={stat.suffix}
                    isActive={isInView}
                  />
                </p>
                <p className="mt-2 text-sm md:text-base text-warm-gray font-medium">
                  {stat.label}
                </p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}