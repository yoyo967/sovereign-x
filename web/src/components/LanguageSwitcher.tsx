"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Globe } from "lucide-react";
import { locales, type Locale } from "@/i18n/routing";

const languageLabels: Record<Locale, { label: string; flag: string }> = {
  de: { label: "Deutsch", flag: "🇩🇪" },
  en: { label: "English", flag: "🇬🇧" },
  fr: { label: "Français", flag: "🇫🇷" },
  es: { label: "Español", flag: "🇪🇸" },
  it: { label: "Italiano", flag: "🇮🇹" },
  pt: { label: "Português", flag: "🇧🇷" },
  ru: { label: "Русский", flag: "🇷🇺" },
  ar: { label: "العربية", flag: "🇸🇦" },
  zh: { label: "中文", flag: "🇨🇳" },
  ja: { label: "日本語", flag: "🇯🇵" },
};

export default function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const switchLocale = (next: Locale) => {
    setOpen(false);
    // Replace the locale segment in the current path
    const segments = pathname.split("/");
    segments[1] = next;
    router.push(segments.join("/"));
  };

  const current = languageLabels[locale];

  return (
    <div ref={ref} className="relative" aria-label="Language selector">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 hover:border-cyan/30 transition-all text-sm text-text-secondary hover:text-white"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <Globe size={14} className="text-cyan shrink-0" />
        <span>{current.flag}</span>
        <span className="hidden sm:inline font-mono text-xs tracking-widest uppercase">
          {locale.toUpperCase()}
        </span>
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Select language"
          className="absolute top-full mt-2 end-0 z-50 min-w-[160px] rounded-xl border border-white/10 bg-space-black/95 backdrop-blur-xl shadow-2xl overflow-hidden"
        >
          {locales.map((l) => {
            const info = languageLabels[l];
            return (
              <button
                key={l}
                role="option"
                aria-selected={l === locale}
                onClick={() => switchLocale(l)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left hover:bg-white/5 transition-colors ${
                  l === locale
                    ? "text-cyan bg-cyan/5 font-semibold"
                    : "text-text-secondary"
                }`}
              >
                <span className="text-base">{info.flag}</span>
                <span>{info.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
