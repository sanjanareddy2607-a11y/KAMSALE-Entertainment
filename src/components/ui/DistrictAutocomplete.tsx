import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown, MapPin } from "lucide-react";
import { filterDistricts } from "../../data/districts";

interface DistrictAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function DistrictAutocomplete({
  value,
  onChange,
  error,
}: DistrictAutocompleteProps) {
  const id = useId();
  const listboxId = `${id}-listbox`;
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = filterDistricts(value);
  const hasValue = value.trim().length > 0;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const select = (district: string) => {
    onChange(district);
    setOpen(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open && (e.key === "ArrowDown" || e.key === "Enter")) {
      setOpen(true);
      return;
    }

    if (!open) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((h) => Math.min(h + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter" && suggestions[highlighted]) {
      e.preventDefault();
      select(suggestions[highlighted]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <MapPin
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-500 pointer-events-none"
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          id={id}
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
            setHighlighted(0);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder=" "
          autoComplete="off"
          role="combobox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-invalid={!!error}
          aria-required="true"
          className={`peer w-full rounded-xl border bg-white pl-11 pr-10 pt-6 pb-2 text-charcoal transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gold-400/40 ${
            error
              ? "border-red-400 focus:border-red-400"
              : "border-gold-200/80 focus:border-gold-400"
          }`}
        />
        <label
          htmlFor={id}
          className={`absolute left-11 transition-all duration-300 pointer-events-none ${
            hasValue || open
              ? "top-2 text-xs text-gold-600 font-medium"
              : "top-1/2 -translate-y-1/2 text-warm-gray"
          }`}
        >
          District *
        </label>
        <ChevronDown
          size={18}
          className={`absolute right-4 top-1/2 -translate-y-1/2 text-warm-gray transition-transform duration-300 pointer-events-none ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </div>

      {open && suggestions.length > 0 && (
        <ul
          id={listboxId}
          role="listbox"
          className="absolute z-30 mt-2 w-full max-h-56 overflow-y-auto rounded-xl border border-gold-100 bg-white premium-shadow-lg py-2"
        >
          {suggestions.map((district, index) => (
            <li key={district} role="option" aria-selected={index === highlighted}>
              <button
                type="button"
                onMouseEnter={() => setHighlighted(index)}
                onClick={() => select(district)}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                  index === highlighted
                    ? "bg-gold-50 text-gold-800"
                    : "text-charcoal hover:bg-cream"
                }`}
              >
                {district}
              </button>
            </li>
          ))}
        </ul>
      )}

      {open && suggestions.length === 0 && value.trim() && (
        <p className="absolute z-30 mt-2 w-full rounded-xl border border-gold-100 bg-white premium-shadow-lg px-4 py-3 text-sm text-warm-gray">
          No districts match your search
        </p>
      )}

      {error && (
        <p className="mt-1.5 text-sm text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
