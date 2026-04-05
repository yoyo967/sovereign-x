import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

function deepMerge<T extends Record<string, unknown>>(base: T, override: Partial<T>): T {
  const result = { ...base };
  for (const key in override) {
    const bv = base[key];
    const ov = override[key];
    if (ov !== null && typeof ov === "object" && !Array.isArray(ov) && typeof bv === "object" && bv !== null) {
      result[key] = deepMerge(bv as Record<string, unknown>, ov as Record<string, unknown>) as T[typeof key];
    } else if (ov !== undefined) {
      result[key] = ov as T[typeof key];
    }
  }
  return result;
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const localeMessages = (await import(`../../messages/${locale}.json`)).default;

  // For non-default locales, merge with English as fallback so new keys don't break
  let messages = localeMessages;
  if (locale !== "en" && locale !== "de") {
    const enMessages = (await import("../../messages/en.json")).default;
    messages = deepMerge(enMessages, localeMessages);
  }

  return { locale, messages };
});
