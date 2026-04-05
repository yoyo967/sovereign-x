import { defineRouting } from "next-intl/routing";

export const locales = [
  "de", "en", "fr", "es", "it", "pt",
  "ru", "ar", "zh", "ja",
] as const;

export type Locale = (typeof locales)[number];

export const rtlLocales: Locale[] = ["ar"];

export const routing = defineRouting({
  locales,
  defaultLocale: "de",
  localePrefix: "always",
});
