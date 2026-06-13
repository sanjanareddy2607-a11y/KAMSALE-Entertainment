import { useNavigate, useLocation } from "react-router-dom";
import { SITE, NAV_ITEMS } from "../data/content";

export function Footer() {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";

  const scrollTo = (id: string) => {
    if (!isHome) {
      navigate(`/#${id}`);
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const year = new Date().getFullYear();

  return (
    <footer className="bg-charcoal text-white/80 py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-4">
            <img
              src="/kamsale_logo_nobg_hd.png"
              alt=""
              className="h-12 w-12 object-contain brightness-0 invert opacity-90"
              width={48}
              height={48}
            />
            <div>
              <p className="font-display text-xl font-semibold text-white">
                {SITE.name}
              </p>
              <p className="text-xs text-white/50 mt-0.5 tracking-[0.15em] uppercase">
                {SITE.tagline}
              </p>
            </div>
          </div>

          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {NAV_ITEMS.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => scrollTo(item.id)}
                    className="text-sm text-white/60 hover:text-gold-300 transition-colors"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-10 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/40">
          <p>
            &copy; {year} {SITE.name}. All rights reserved.
          </p>
          <p>
            {SITE.location} · {SITE.availability}
          </p>
        </div>
      </div>
    </footer>
  );
}
