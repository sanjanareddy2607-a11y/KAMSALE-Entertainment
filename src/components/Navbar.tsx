import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

import { useContent } from "../context/LanguageContext";
import { useScrollSpy } from "../hooks/useScrollSpy";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const { lang, toggleLanguage, content } = useContent();

  const isHome = location.pathname === "/";
  const activeId = useScrollSpy(content.navItems.map((item) => item.id));

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const scrollTo = (id: string) => {
    setMobileOpen(false);

    if (!isHome) {
      navigate(`/#${id}`);
      return;
    }

    // Wait for mobile menu animation to finish
    setTimeout(() => {
      const el = document.getElementById(id);

      if (el) {
        el.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 350);
  };

  useEffect(() => {
    if (isHome && location.hash) {
      const id = location.hash.replace("#", "");

      // Wait for page render
      setTimeout(() => {
        const el = document.getElementById(id);

        if (el) {
          el.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 500);
    }
  }, [isHome, location.hash]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled || !isHome
          ? "glass-nav premium-shadow"
          : "bg-transparent"
      }`}
    >
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 group"
          aria-label="Go to home"
        >
          <img
            src="/kamsale_logo_nobg_hd.png"
            alt="Kamsale Entertainment logo"
            className="h-10 w-10 md:h-12 md:w-12 object-contain transition-transform duration-300 group-hover:scale-105"
            width={48}
            height={48}
          />

          <div className="text-left">
            <span className="font-display text-lg md:text-xl font-semibold text-charcoal leading-tight block">
              {content.site.name}
            </span>

            <span className="text-[9px] md:text-[10px] text-gold-600 tracking-[0.18em] uppercase hidden sm:block font-medium">
              {content.site.tagline}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden lg:flex items-center gap-0.5 xl:gap-1">
          {content.navItems.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => scrollTo(item.id)}
                className={`relative px-3 xl:px-4 py-2 text-sm font-medium tracking-wide transition-colors duration-300 rounded-full whitespace-nowrap ${
                  isHome && activeId === item.id
                    ? "text-gold-600"
                    : scrolled || !isHome
                    ? "text-warm-gray hover:text-charcoal"
                    : "text-white/80 hover:text-white"
                }`}
              >
                {item.label}

                {isHome && activeId === item.id && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute inset-0 rounded-full bg-gold-50 border border-gold-200/60 -z-10"
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                )}
              </button>
            </li>
          ))}
        </ul>

        {/* Right Side Actions */}
        <div className="flex items-center">
          {/* Desktop Book Event Button */}
          <button
            type="button"
            onClick={() => scrollTo("contact")}
            className={`hidden lg:inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 ${
              scrolled || !isHome
                ? "bg-charcoal text-white hover:bg-gold-600 hover:shadow-lg hover:shadow-gold-400/20"
                : "bg-white text-charcoal hover:bg-gold-100 hover:shadow-xl"
            }`}
          >
            {content.bookEvent}
          </button>

          {/* Language Toggle */}
          <button
            type="button"
            onClick={toggleLanguage}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all duration-300 ml-2 lg:ml-3 ${
              scrolled || !isHome
                ? "border-gold-200 text-charcoal hover:bg-gold-50"
                : "border-white/30 text-white hover:bg-white/10"
            }`}
            aria-label="Toggle language"
          >
            {lang === "en" ? "🇮🇳 ಕನ್ನಡ" : "🇬🇧 English"}
          </button>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className={`lg:hidden ml-2 p-2 rounded-lg transition-colors ${
              scrolled || !isHome
                ? "text-charcoal hover:bg-gold-50"
                : "text-white hover:bg-white/10"
            }`}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden glass-nav border-t border-gold-100/50 overflow-hidden"
          >
            <ul className="flex flex-col px-5 py-4 gap-1">
              {content.navItems.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => scrollTo(item.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                      isHome && activeId === item.id
                        ? "bg-gold-50 text-gold-700"
                        : "text-charcoal hover:bg-cream"
                    }`}
                  >
                    {item.label}
                  </button>
                </li>
              ))}

              {/* Mobile Book Event Button */}
              <li className="pt-2">
                <button
                  type="button"
                  onClick={() => scrollTo("contact")}
                  className="w-full rounded-xl bg-charcoal px-4 py-3 text-white font-medium hover:bg-gold-600 transition-colors"
                >
                  {content.bookEvent}
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}