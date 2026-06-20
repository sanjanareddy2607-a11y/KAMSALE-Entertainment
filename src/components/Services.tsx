import { useState } from "react";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import {
  Music,
  Sparkles,
  Landmark,
  Building2,
  Palette,
  ChevronLeft,
  ChevronRight,
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

// Distance (in px) a swipe must travel before we treat it as "next/prev"
const SWIPE_THRESHOLD = 60;

export function Services() {
  const { content } = useContent();
  const items = content.services.items;

  // `direction` tracks which way we're animating (1 = forward, -1 = backward)
  // so the slide-in/slide-out direction always matches the swipe direction.
  const [[activeIndex, direction], setSlide] = useState<[number, number]>([0, 0]);

  const goTo = (newIndex: number, dir: number) => {
    const wrapped = (newIndex + items.length) % items.length;
    setSlide([wrapped, dir]);
  };

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (info.offset.x < -SWIPE_THRESHOLD) {
      goTo(activeIndex + 1, 1); // swiped left -> next card
    } else if (info.offset.x > SWIPE_THRESHOLD) {
      goTo(activeIndex - 1, -1); // swiped right -> previous card
    }
  };

  const service = items[activeIndex];
  const Icon = iconMap[service.icon as keyof typeof iconMap];

  return (
    <section
      id="services"
      className="py-20 md:py-28 bg-gradient-to-b from-cream to-white overflow-hidden"
      aria-labelledby="services-heading"
    >
      <div className="mx-auto max-w-3xl px-5 md:px-8">
        <SectionHeading
          title={content.services.title}
          subtitle={content.services.subtitle}
        />

        {/* Carousel viewport */}
        <div className="relative">
          <div className="relative h-[360px] md:h-[340px]">
            <AnimatePresence initial={false} mode="popLayout">
              <motion.article
                key={activeIndex}
                id={activeIndex === 0 ? "services-heading" : undefined}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.6}
                onDragEnd={handleDragEnd}
                initial={{ opacity: 0, x: direction >= 0 ? 80 : -80 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction >= 0 ? -80 : 80 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                whileTap={{ cursor: "grabbing" }}
                className="absolute inset-0 cursor-grab select-none rounded-3xl bg-white p-8 md:p-10 card-border premium-shadow hover:glow-gold transition-shadow duration-500 overflow-hidden flex flex-col"
              >
                <div
                  className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-gold-100/60 to-transparent rounded-bl-full"
                  aria-hidden="true"
                />

                <div className="relative flex flex-col flex-1">
                  <div className="mb-6 inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-50 to-gold-100 text-gold-600">
                    <Icon size={26} strokeWidth={1.5} aria-hidden="true" />
                  </div>

                  <h3 className="font-display text-2xl font-semibold text-charcoal mb-3">
                    {service.title}
                  </h3>

                  <p className="text-warm-gray leading-relaxed">
                    {service.description}
                  </p>

                  <div className="mt-6 h-0.5 w-full bg-gradient-to-r from-gold-400 to-gold-200" />

                  <p className="mt-auto pt-6 text-xs text-warm-gray/70 text-center md:hidden">
                    Swipe to explore more services
                  </p>
                </div>
              </motion.article>
            </AnimatePresence>
          </div>

          {/* Desktop arrow controls */}
          <button
            type="button"
            onClick={() => goTo(activeIndex - 1, -1)}
            aria-label="Previous service"
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-14 items-center justify-center w-11 h-11 rounded-full bg-white card-border premium-shadow text-charcoal hover:text-gold-600 hover:glow-gold transition-all duration-300"
          >
            <ChevronLeft size={20} strokeWidth={1.75} />
          </button>
          <button
            type="button"
            onClick={() => goTo(activeIndex + 1, 1)}
            aria-label="Next service"
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-14 items-center justify-center w-11 h-11 rounded-full bg-white card-border premium-shadow text-charcoal hover:text-gold-600 hover:glow-gold transition-all duration-300"
          >
            <ChevronRight size={20} strokeWidth={1.75} />
          </button>
        </div>

        {/* Dot indicators (also tappable on mobile) */}
        <div className="mt-8 flex items-center justify-center gap-2">
          {items.map((item, i) => (
            <button
              key={item.title}
              type="button"
              onClick={() => goTo(i, i > activeIndex ? 1 : -1)}
              aria-label={`Go to ${item.title}`}
              aria-current={i === activeIndex}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                i === activeIndex
                  ? "w-8 bg-gold-500"
                  : "w-2.5 bg-gold-200 hover:bg-gold-300"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}