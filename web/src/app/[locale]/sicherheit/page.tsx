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
  const isDE = locale === "de";
  return {
    title: isDE
      ? "EU AI Act & DSGVO 2026: Sicherheit, Zero-Trust & Datenschutz | SOVEREIGN"
      : "EU AI Act & GDPR 2026: Security, Zero-Trust & Data Protection | SOVEREIGN",
    description: isDE
      ? "EU AI Act Risikoklassen, DSGVO-Rechte, Zero-Trust-Architektur und wie SOVEREIGN 2030 vollständige Compliance durch Design implementiert."
      : "EU AI Act risk classes, GDPR rights, Zero-Trust architecture and how SOVEREIGN 2030 implements full compliance by design.",
    alternates: {
      canonical: `${BASE_URL}/${locale}/sicherheit`,
    },
  };
}

export default async function SicherheitPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: "EU AI Act & DSGVO 2026: Sicherheit & Datenschutz",
    description: "Wie SOVEREIGN 2030 vollständige Compliance durch Design implementiert.",
    author: { "@type": "Organization", name: "SOVEREIGN 2030" },
  };

  return (
    <div style={{ background: "#050d18", minHeight: "100vh", color: "rgba(255,255,255,0.85)" }}>
      <JsonLd data={jsonLd} />

      {/* 🚀 THE NEXUS EXCELLENCE BANNER */}
      <PremiumBanner
        type="security"
        imagePath="/assets/nexus/security.png"
        tag="Security · Compliance · Zero-Trust"
        title="Sicherheit"
        subtitle="EU AI Act & DSGVO 2026: Souveränität durch Architektur. Wir bauen Compliance nicht als Versprechen, sondern als technisches Fundament."
        showAnimation={true}
      />

      <article className="max-w-7xl mx-auto px-6 py-24 relative z-10">
        
        {/* Modular Dashboard-Style Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-12">
          
          {/* Main Dossier Content */}
          <div className="space-y-24">
            
            {/* Section I: EU AI Act Timeline */}
            <Section id="eu-ai-act" index="01" title="EU AI Act: Die Roadmap">
              <p className="text-xl leading-relaxed text-white/60 mb-12">
                Am 1. August 2024 trat der EU AI Act in Kraft — die weltweit erste umfassende Regulierung von Künstlicher Intelligenz. 
                Sovereign 2030 ist bereits auf den **Final Enforcement 2026** vorbereitet.
              </p>
              <Timeline items={[
                { date: "Feb. 2025", label: "Verbotene Praktiken", desc: "Soziales Scoring und manipulative KI sind nun EU-weit untersagt." },
                { date: "Aug. 2025", label: "GPAI & Hochrisiko", desc: "Transparenzpflichten für große Modelle wie Gemini/GPT treten in Kraft." },
                { date: "Aug. 2026", label: "Full Enforcement", desc: "Alle KI-Systeme in der EU müssen vollständig konform sein." },
              ]} />
            </Section>

            {/* Section II: Risk Classification Card Grid */}
            <Section id="risikoklassen" index="02" title="Risikoklassifizierung">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                {[
                  { level: "VERBOTEN", title: "Unzulässige Praktiken", desc: "Manipulative KI und soziales Scoring.", icon: "riskred" },
                  { level: "LOW RISK", title: "Sovereign Standard", desc: "Assistenten wie SOVEREIGN mit Fokus auf Transparenz und lokale Kontrolle.", icon: "cyan" },
                ].map((cls) => (
                  <div key={cls.level} className="glass-card p-8 border-white/5 hover:border-[var(--sovereign-cyan)]/30 group transition-all">
                    <span className={`font-mono text-[0.6rem] tracking-widest text-[var(--sovereign-${cls.icon})]`}>[{cls.level}]</span>
                    <h4 className="text-2xl font-bold mt-4 mb-3 text-white/90 group-hover:text-white transition-colors">{cls.title}</h4>
                    <p className="text-sm text-white/40 leading-relaxed">{cls.desc}</p>
                  </div>
                ))}
              </div>
            </Section>

            {/* Section III: Privacy Shield Engine */}
            <Section id="dsgvo-rechte" index="03" title="Privacy Shield Engine">
              <p className="text-lg leading-relaxed text-white/60 mb-8">
                 Wir interpretieren DSGVO-Rechte nicht als Formulare, sondern als technische Endpunkte. 
              </p>
              <div className="glass-card overflow-hidden border-white/5">
                {[
                  { art: "Art. 15", right: "Auskunftsrecht", meta: "Direct Access / JSON Export", icon: "memory" },
                  { art: "Art. 17", right: "Recht auf Löschung", meta: "Instant Vault Purge", icon: "guardian" },
                  { art: "Art. 20", right: "Übertragbarkeit", meta: "Portable Data Package", icon: "execution" },
                ].map((row, i) => (
                  <div key={i} className="flex items-center justify-between p-6 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-center gap-6">
                       <NexusIcon type={row.icon as any} size={20} />
                       <div>
                          <div className="font-mono text-[0.6rem] text-[var(--sovereign-cyan)] uppercase tracking-widest mb-1">{row.art}</div>
                          <div className="text-lg font-bold text-white/80">{row.right}</div>
                       </div>
                    </div>
                    <div className="font-mono text-[0.65rem] text-white/20 uppercase tracking-tighter">{row.meta}</div>
                  </div>
                ))}
              </div>
            </Section>

          </div>

          {/* Technical Specs Sidebar (STICKY) */}
          <aside className="space-y-8 lg:sticky lg:top-32 h-fit">
            <div className="glass-card p-6 border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent">
              <div className="font-mono text-[0.6rem] text-white/30 uppercase tracking-[0.2em] mb-6">Technical Audit</div>
              <div className="space-y-6">
                {[
                  { label: "AI Engine", value: "Gemma 1.5 PRO (Sanitized)" },
                  { label: "Data Residency", value: "EU-Region (Frankfurt)" },
                  { label: "Sync Protocol", value: "E2EE-Mesh" },
                  { label: "Auth Layer", value: "Zero-Trust v2.0" },
                ].map((spec) => (
                  <div key={spec.label} className="border-b border-white/5 pb-4 last:border-0">
                    <div className="text-[0.65rem] text-white/40 mb-1">{spec.label}</div>
                    <div className="text-sm font-bold text-white/90">{spec.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-6 border-[var(--sovereign-cyan)]/20 shadow-[0_0_20px_rgba(0,229,255,0.05)]">
               <h5 className="text-sm font-bold text-[var(--sovereign-cyan)] mb-4">Garantie & Vertrauen</h5>
               <p className="text-xs text-white/40 leading-relaxed mb-6">
                 Sovereign ist kein Blackbox-System. Jede Entscheidung der KI wird im Audit Trail kryptographisch signiert.
               </p>
               <button className="primary-aura-button w-full text-center">Audit Protokoll prüfen</button>
            </div>
          </aside>

        </div>

      </article>

      {/* Footer Final CTA */}
      <section className="py-32 border-t border-white/5 bg-gradient-to-b from-transparent to-black/20">
         <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-5xl md:text-7xl font-space-grotesk font-extrabold text-white mb-8 tracking-tighter">Sicherheit durch <span className="text-[var(--sovereign-cyan)]">Architektur.</span></h2>
            <p className="text-xl text-white/40 mb-12 max-w-2xl mx-auto">Erlebe die Freiheit eines Systems, das für deine Souveränität gebaut wurde.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
               <Link href="/dashboard" className="btn-primary">Jetzt starten</Link>
               <Link href={`/${locale}/architektur`} className="btn-secondary">Architektur-Manual</Link>
            </div>
         </div>
      </section>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────

function Section({ id, index, title, children }: { id: string; index: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-32">
      <div className="flex items-center gap-6 mb-12">
        <div className="w-12 h-12 flex items-center justify-center font-mono text-sm text-[var(--sovereign-cyan)] border border-[var(--sovereign-cyan)]/20 glass-card">
          {index}
        </div>
        <h2 className="font-space-grotesk font-bold text-4xl text-white tracking-tight">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

function Timeline({ items }: { items: { date: string; label: string; desc: string }[] }) {
  return (
    <div className="relative pl-8 space-y-12 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1px] before:bg-white/10">
      {items.map((item, i) => (
        <div key={i} className="relative group">
          <div className="absolute left-[-21px] top-2 w-[11px] h-[11px] rounded-full bg-[var(--sovereign-cyan)] shadow-[0_0_10px_rgba(0,229,255,0.5)] group-hover:scale-125 transition-transform" />
          <div className="font-mono text-[0.65rem] text-[var(--sovereign-cyan)] uppercase tracking-widest mb-2">{item.date}</div>
          <div className="text-xl font-bold text-white/90 mb-2">{item.label}</div>
          <div className="text-base text-white/40 leading-relaxed">{item.desc}</div>
        </div>
      ))}
    </div>
  );
}
