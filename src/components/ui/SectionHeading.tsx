import { motion } from "framer-motion";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  headingId?: string;
}

export function SectionHeading({
  title,
  subtitle,
  align = "center",
  headingId,
}: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`mb-12 md:mb-16 ${align === "center" ? "text-center" : "text-left"}`}
    >
      <div
        className={`flex items-center gap-4 mb-4 ${align === "center" ? "justify-center" : ""}`}
      >
        <span className="h-px w-12 bg-gradient-to-r from-transparent to-gold-400" aria-hidden="true" />
        <span className="text-gold-500 text-sm font-medium tracking-[0.2em] uppercase">
          Kamsale Entertainment
        </span>
        <span className="h-px w-12 bg-gradient-to-l from-transparent to-gold-400" aria-hidden="true" />
      </div>
      <h2
        id={headingId}
        className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-charcoal tracking-tight"
      >
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 max-w-2xl text-warm-gray text-lg leading-relaxed mx-auto">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
