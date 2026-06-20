import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, Maximize2 } from "lucide-react";
import { useContent } from "../context/LanguageContext";
import { SectionHeading } from "./ui/SectionHeading";

const SLIDE_INTERVAL = 3000;

function subscribeReducedMotion(cb: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

function getReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function Gallery() {
  const { content } = useContent();
  const gallery = content.gallery;
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    () => false
  );
  const total = gallery.images.length;

  const goTo = useCallback(
    (index: number) => {
      setCurrent(((index % total) + total) % total);
    },
    [total]
  );

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
    if (isPaused || lightboxOpen || prefersReducedMotion) return;
    const timer = setInterval(next, SLIDE_INTERVAL);
    return () => clearInterval(timer);
  }, [isPaused, lightboxOpen, prefersReducedMotion, next]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightboxOpen, next, prev]);

  return (
    <section
      id="gallery"
      className="py-20 md:py-28 bg-white"
      aria-labelledby="gallery-heading"
    >
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading title={gallery.title} subtitle={gallery.description} headingId="gallery-heading" />

        <div
          className="relative max-w-5xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocus={() => setIsPaused(true)}
          onBlur={() => setIsPaused(false)}
        >
          <div className="relative rounded-3xl overflow-hidden glow-gold card-border bg-charcoal/5">
            <div className="absolute inset-0 rounded-3xl ring-1 ring-gold-300/30 pointer-events-none z-10" />

            <div className="relative aspect-[16/10] md:aspect-[16/9] overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.img
                  key={current}
                  src={gallery.images[current]}
                  alt={`Kamsale performance showcase ${current + 1} of ${total}`}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="absolute inset-0 w-full h-full object-cover cursor-zoom-in"
                  onClick={() => setLightboxOpen(true)}
                  loading={current < 2 ? "eager" : "lazy"}
                />
              </AnimatePresence>

              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/20 via-transparent to-transparent pointer-events-none" />
            </div>

            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-white/90 text-charcoal hover:bg-white premium-shadow transition-all duration-300 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500"
              aria-label="Open fullscreen gallery"
            >
              <Maximize2 size={18} />
            </button>

            <button
              type="button"
              onClick={prev}
              className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/90 text-charcoal hover:bg-white premium-shadow transition-all duration-300 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500"
              aria-label="Previous image"
            >
              <ChevronLeft size={24} />
            </button>

            <button
              type="button"
              onClick={next}
              className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/90 text-charcoal hover:bg-white premium-shadow transition-all duration-300 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500"
              aria-label="Next image"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          <div
            className="flex items-center justify-center gap-2 mt-6"
            role="tablist"
            aria-label="Gallery navigation"
          >
            {gallery.images.map((_, index) => (
              <button
                key={index}
                type="button"
                role="tab"
                aria-selected={index === current}
                aria-label={`Go to image ${index + 1}`}
                onClick={() => goTo(index)}
                className={`transition-all duration-300 rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 ${
                  index === current
                    ? "w-8 h-2.5 bg-gold-500 glow-gold"
                    : "w-2.5 h-2.5 bg-gold-200 hover:bg-gold-300"
                }`}
              />
            ))}
          </div>

          <p className="text-center mt-4 text-sm text-warm-gray" aria-live="polite">
            {current + 1} / {total}
          </p>
        </div>
      </div>

      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal/95 backdrop-blur-sm p-4 md:p-8"
            role="dialog"
            aria-modal="true"
            aria-label="Fullscreen gallery view"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              aria-label="Close fullscreen view"
            >
              <X size={24} />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft size={28} />
            </button>

            <motion.img
              key={`lightbox-${current}`}
              src={gallery.images[current]}
              alt={`Kamsale performance ${current + 1}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg glow-gold"
              onClick={(e) => e.stopPropagation()}
            />

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              aria-label="Next image"
            >
              <ChevronRight size={28} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}