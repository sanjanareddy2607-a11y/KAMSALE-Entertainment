import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useContent } from "../context/LanguageContext";

const heroImages = ["/gallery/kamsale-stage.jpg", "/gallery/0.jpeg", "/gallery/2.jpeg"];
const SLIDE_DURATION = 5000;

export function Hero() {
  const { content } = useContent();
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSlide((s) => (s + 1) % heroImages.length);
    }, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      aria-label="Hero"
    >
      <div className="absolute inset-0">
        <AnimatePresence mode="sync">
          <motion.img
            key={heroImages[slide]}
            src={heroImages[slide]}
            alt=""
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute inset-0 h-full w-full object-cover"
            loading="eager"
            fetchPriority="high"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/70 via-charcoal/50 to-charcoal/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/40 via-transparent to-charcoal/30" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-8 py-32 md:py-40 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-block mb-6 px-5 py-2 rounded-full border border-gold-400/40 bg-white/10 backdrop-blur-sm text-gold-200 text-sm tracking-[0.25em] uppercase font-medium"
          >
            {content.hero.title}
          </motion.span>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-white leading-[1.1] tracking-tight max-w-4xl mx-auto">
            {content.hero.subtitle}
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-6 md:mt-8 max-w-2xl mx-auto text-white/85 text-base md:text-lg leading-relaxed font-light"
          >
            {content.hero.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              type="button"
              onClick={() => scrollTo("gallery")}
              className="w-full sm:w-auto min-w-[180px] rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-charcoal transition-all duration-300 hover:bg-gold-100 hover:shadow-xl hover:shadow-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {content.hero.ctaPrimary}
            </button>
            <button
              type="button"
              onClick={() => scrollTo("contact")}
              className="w-full sm:w-auto min-w-[180px] rounded-full border-2 border-gold-400/80 bg-gold-500/20 backdrop-blur-sm px-8 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-gold-500/40 hover:border-gold-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-400"
            >
              {content.hero.ctaSecondary}
            </button>
          </motion.div>
        </motion.div>
      </div>

      <motion.button
        type="button"
        onClick={() => scrollTo("about")}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{
          opacity: { delay: 1, duration: 0.6 },
          y: { delay: 1, duration: 2, repeat: Infinity, ease: "easeInOut" },
        }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-white/70 hover:text-white transition-colors"
        aria-label="Scroll to about section"
      >
        <ChevronDown size={32} />
      </motion.button>
    </section>
  );
}