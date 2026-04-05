import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/SEO/JsonLd";
import PremiumBanner from "@/components/landing/PremiumBanner";
import NexusIcon from "@/components/landing/NexusIcon";

const BASE_URL = "https://sovereign.de";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Sovereign Use Cases | Reale Anwendungen für Datensouveränität",
    description:
      "Erfahre wie du den Sovereign Twin für Kündigungen, Widersprüche und Finanzoptimierung einsetzt.",
    alternates: { canonical: `${BASE_URL}/${locale}/use-cases` },
  };
}

export default async function UseCasesHub({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Sovereign Use Cases — Reale Anwendungsszenarien",
  };

  const useCases = [
    {
      title: "Automatisierte Kündigung",
      tag: "CONSUMER",
      desc: "Lass deinen Twin Kündigungsfristen überwachen und rechtssichere Schreiben autonom verfassen.",
      href: `/${locale}/use-cases/kuendigung`,
      type: "execution" as const
    },
    {
      title: "Preiserhöhung ablehnen",
      tag: "FINANZEN",
      desc: "Schutz vor inflationären Taktiken. Der Twin erkennt Anomalien im Bank-Stream.",
      href: `/${locale}/use-cases/preiserhoehung`,
      type: "guardian" as const
    },
    {
      title: "DSGVO Durchsetzung",
      tag: "PRIVACY",
      desc: "Automatische Auskunftsbegehren nach Art. 15 DSGVO. Fordere deine Daten von Konzernen zurück.",
      href: `/${locale}/use-cases/datenschutz`,
      type: "audit" as const
    },
    {
      title: "Wealth-Twin Optimierung",
      tag: "WEALTH",
      desc: "PSD2-basierte Analyse deines Cashflows. Identifiziere Einsparpotenziale.",
      href: `/${locale}/use-cases/finanzen`,
      type: "memory" as const
    }
  ];

  return (
    <div style={{ background: "#080E1A", minHeight: "100vh", color: "rgba(255,255,255,0.85)" }}>
      <JsonLd data={jsonLd} />

      <PremiumBanner
        type="execution"
        imagePath="/assets/nexus/architecture.png"
        tag="Application Layer · Autonomy · UX"
        title="NEXUS Scenarios"
        subtitle="Praktische Autonomie. Souveränität zeigt sich in der Fähigkeit, in kritischen Momenten die Kontrolle über das eigene Leben zurückzugewinnen."
      />

      <article className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {useCases.map((uc, i) => (
            <Link key={i} href={uc.href} style={{ textDecoration: "none" }}>
              <div className="nexus-card" style={{ padding: "3rem", background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.05)", transition: "all 0.3s ease" }}>
                <div style={{ marginBottom: "2rem" }}>
                  <NexusIcon type={uc.type} size={40} />
                </div>
                <div style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.55rem", color: "rgba(0,212,255,0.5)", letterSpacing: "0.15em", marginBottom: "0.75rem", textTransform: "uppercase" }}>{uc.tag}</div>
                <h2 style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontWeight: 700, fontSize: "1.5rem", color: "rgba(255,255,255,0.9)", marginBottom: "1rem" }}>{uc.title}</h2>
                <p style={{ fontSize: "0.95rem", lineHeight: 1.6, color: "rgba(255,255,255,0.45)" }}>{uc.desc}</p>
                <div style={{ marginTop: "2rem", fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.65rem", color: "var(--sovereign-cyan, #00E5FF)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Case Study Öffnen →</div>
              </div>
            </Link>
          ))}
        </div>

        <section style={{ marginTop: "6rem", padding: "3rem", border: "1px solid rgba(0,229,255,0.1)", background: "rgba(0,229,255,0.02)" }}>
           <h3 style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontWeight: 800, fontSize: "1.5rem", color: "rgba(255,255,255,0.95)", marginBottom: "1rem" }}>Compliance & Transparenz</h3>
           <p style={{ fontSize: "1rem", lineHeight: 1.7, color: "rgba(255,255,255,0.5)", margin: 0 }}>
             Jeder Use Case wird durch das Nexus-System überwacht. Innerhalb jeder Anwendung hast du Zugriff auf den vollständigen Audit Trail nach EU AI Act Art. 12. Keine verdeckten Aktionen — nur beweisbare Autonomie.
           </p>
        </section>
      </article>
    </div>
  );
}
