import { Inter, Space_Grotesk } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { cookies } from "next/headers";
import "../globals.css";
import DashboardClientLayout from "./DashboardClientLayout";

const inter = Inter({ variable: "--font-inter", subsets: ["latin", "cyrillic"], display: "swap" });
const spaceGrotesk = Space_Grotesk({ variable: "--font-space-grotesk", subsets: ["latin"], display: "swap" });

const SUPPORTED_LOCALES = ["de", "en", "fr", "es", "it", "pt", "ru", "ar", "zh", "ja"] as const;
type SupportedLocale = typeof SUPPORTED_LOCALES[number];

async function getDashboardLocale(): Promise<SupportedLocale> {
  const cookieStore = await cookies();
  const raw = cookieStore.get("NEXT_LOCALE")?.value;
  if (raw && SUPPORTED_LOCALES.includes(raw as SupportedLocale)) {
    return raw as SupportedLocale;
  }
  return "de";
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const locale = await getDashboardLocale();

  // Load full messages for the detected locale, fall back to "de"
  let messages: Record<string, unknown>;
  try {
    messages = (await import(`../../../messages/${locale}.json`)).default;
  } catch {
    messages = (await import("../../../messages/de.json")).default;
  }

  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceGrotesk.variable} antialiased`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <DashboardClientLayout>{children}</DashboardClientLayout>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
