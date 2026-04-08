import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/SEO/JsonLd";
import PremiumBanner from "@/components/landing/PremiumBanner";
import NexusIcon from "@/components/landing/NexusIcon";
import PreiserhoehungGenerator from "@/components/use-cases/PreiserhoehungGenerator";

const BASE_URL = "https://sovereign.de";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Preiserhöhungen widersprechen | Inflation Shield | Sovereign 2030",
    description:
      "Nutze deinen Sovereign Twin, um Preiserhöhungen automatisch zu erkennen und rechtssicher zu widersprechen.",
    alternates: { canonical: `${BASE_URL}/${locale}/use-cases/preiserhoehung` },
  };
}

export default async function PreiserhoehungPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "Preiserhöhungen widersprechen mit Sovereign 2030",
    "step": [
      { "name": "Detection", "text": "Erkennung von Anomalien via PSD2-Banking." },
      { "name": "Comparison", "text": "Vergleich mit Marktdaten und Verträgen." },
      { "name": "Opposition", "text": "Erstellung eines juristisch präzisen Widerspruchs." },
      { "name": "Execution", "text": "Freigabe via SwipeToApprove im Execution Center." }
    ]
  };

  return (
    <div style={{ background: "#080E1A", minHeight: "100vh", color: "rgba(255,255,255,0.85)" }}>
      <JsonLd data={jsonLd} />

      <PremiumBanner
        type="guardian"
        imagePath="/assets/nexus/privacy-guardian.png"
        tag="Use Case · Finance · Protection"
        title="Inflation Shield"
        subtitle="Preiserhöhungen abwehren. Dein digitaler Schutzschild gegen versteckte Kostensteigerungen bei Strom, Gas, Abos und Versicherungen."
      />

      <article className="max-w-4xl mx-auto px-6 py-20">
        <div className="nexus-card" style={{ padding: "1.5rem", marginBottom: "4rem", borderLeft: "3px solid #FFD600", background: "rgba(255,214,0,0.02)" }}>
           <p style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.65rem", color: "#FFD600", margin: 0 }}>
             <span style={{ fontWeight: 700 }}>INFLATION SHIELD ACTIVE:</span> Automatische Überwachung von Kostenerhöhungen &gt; 2%. Analyse via Finance Guardian Node.
           </p>
        </div>

        <section style={{ marginBottom: "5rem" }}>
          <h2 style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontWeight: 800, fontSize: "1.8rem", color: "rgba(255,255,255,0.95)", marginBottom: "2.5rem" }}>Verteidigungsprozess</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
            {jsonLd.step.map((step, i) => (
              <div key={i} className="nexus-card" style={{ padding: "2rem", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.65rem", color: "#FFD600", marginBottom: "0.75rem" }}>SHIELD 0{i + 1}</div>
                <h3 style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontWeight: 700, fontSize: "1.2rem", color: "rgba(255,255,255,0.9)", marginBottom: "0.5rem" }}>{step.name}</h3>
                <p style={{ fontSize: "0.9rem", lineHeight: 1.6, color: "rgba(255,255,255,0.45)", margin: 0 }}>{step.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Rechtssicherheit */}
        <section style={{ border: "1px solid rgba(255,214,0,0.1)", padding: "2rem", background: "rgba(255,214,0,0.02)", marginBottom: "4rem" }}>
          <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
            <NexusIcon type="execution" size={40} />
            <div>
              <h2 style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontWeight: 800, fontSize: "1.5rem", color: "rgba(255,255,255,0.95)", marginBottom: "0.5rem" }}>Rechtssicherheit</h2>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.7, color: "rgba(255,255,255,0.5)", margin: 0 }}>
                Dein Twin nutzt aktuelle BGB-Vorlagen und Sonderkündigungsrechte, um unbegründete Erhöhungen abzuwehren. Jede Aktion wird dokumentiert und ist rechtlich bindend.
              </p>
            </div>
          </div>
        </section>

        {/* Widerspruchsschreiben Generator */}
        <section style={{ marginBottom: "5rem" }}>
          <div style={{ marginBottom: "1.5rem" }}>
            <h2 style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontWeight: 800, fontSize: "1.8rem", color: "rgba(255,255,255,0.95)", marginBottom: "0.5rem" }}>
              Widerspruchsschreiben Generator
            </h2>
            <p style={{ fontSize: "0.92rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.65, margin: 0, maxWidth: 580 }}>
              Erstelle in unter 2 Minuten ein rechtssicheres Widerspruchsschreiben — kostenlos, personalisiert, sofort versendbereit.
            </p>
          </div>
          <PreiserhoehungGenerator />
        </section>

        {/* Rechtsgrundlagen */}
        <section style={{ marginBottom: "4rem" }}>
          <h2 style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontWeight: 800, fontSize: "1.5rem", color: "rgba(255,255,255,0.95)", marginBottom: "1.5rem" }}>
            Wichtige Rechtsgrundlagen
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.06)" }}>
            {[
              { gesetz: "§ 41 Abs. 3 EnWG", bereich: "Strom & Gas", detail: "Sonderkündigungsrecht bei Preisanpassung — Frist: 2 Wochen nach Ankündigung" },
              { gesetz: "§ 57 Abs. 1 TKG", bereich: "Mobilfunk / Internet", detail: "Sonderkündigung bei Vertragsänderung — Frist: 3 Monate nach Ankündigung" },
              { gesetz: "§ 40 VVG", bereich: "Kfz-Versicherung", detail: "Sonderkündigung bei Beitragserhöhung — Frist: 1 Monat nach Zugang" },
              { gesetz: "§ 314 BGB", bereich: "Alle Dauerschuldverh.", detail: "Außerordentliche Kündigung aus wichtigem Grund — unverzüglich nach Kenntnis" },
            ].map((row) => (
              <div key={row.gesetz} style={{ padding: "1.25rem", background: "#080E1A" }}>
                <div style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.65rem", color: "rgba(0,212,255,0.7)", marginBottom: "0.35rem" }}>{row.gesetz}</div>
                <div style={{ fontWeight: 700, fontSize: "0.88rem", color: "rgba(255,255,255,0.85)", marginBottom: "0.3rem" }}>{row.bereich}</div>
                <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.38)", lineHeight: 1.55 }}>{row.detail}</div>
              </div>
            ))}
          </div>
        </section>

        <footer style={{ marginTop: "6rem", textAlign: "center", paddingTop: "4rem", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <h2 style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontWeight: 800, fontSize: "2rem", color: "rgba(255,255,255,0.9)", marginBottom: "1rem" }}>Lass dich nicht ausbeuten.</h2>
          <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.45)", marginBottom: "2.5rem" }}>Aktiviere den Finance Guardian und schütze deine Liquidität vor unlauteren Praktiken.</p>
          <Link href="/dashboard" className="lp-btn-primary">Schutzschild aktivieren</Link>
        </footer>
      </article>
    </div>
  );
}
