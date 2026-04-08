"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, Zap, Shield, Rocket } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { api } from "@/lib/api";

interface Tier {
  name: string;
  priceMonthlyEur: number;
  features: string[];
}

function TierCard({
  tier,
  popular,
  popularLabel,
  perMonth,
  cta,
  delay,
}: {
  tier: Tier;
  popular: boolean;
  popularLabel: string;
  perMonth: string;
  cta: string;
  delay: number;
}) {
  const getIcon = () => {
    if (tier.name === "PRO") return <Rocket size={18} strokeWidth={1.5} />;
    if (tier.name === "SHIELD") return <Shield size={18} strokeWidth={1.5} />;
    return <Zap size={18} strokeWidth={1.5} />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="relative flex flex-col"
      style={{
        border: popular
          ? "1px solid rgba(0,212,255,0.4)"
          : "1px solid rgba(255,255,255,0.07)",
        background: popular ? "rgba(0,212,255,0.04)" : "rgba(255,255,255,0.02)",
        padding: "2.5rem",
      }}
    >
      {popular && (
        <div
          className="absolute top-0 right-0 px-3 py-1"
          style={{
            fontFamily: "var(--font-jetbrains, monospace)",
            fontSize: "0.6rem",
            letterSpacing: "0.1em",
            background: "#00D4FF",
            color: "#000",
            fontWeight: 600,
          }}
        >
          {popularLabel}
        </div>
      )}

      {/* Tier header */}
      <div className="flex items-center gap-3 mb-6">
        <div
          style={{
            padding: "8px",
            border: "1px solid rgba(0,212,255,0.2)",
            background: "rgba(0,212,255,0.06)",
            color: popular ? "#00D4FF" : "rgba(255,255,255,0.4)",
          }}
        >
          {getIcon()}
        </div>
        <div>
          <h3
            style={{
              fontFamily: "var(--font-space-grotesk, sans-serif)",
              fontWeight: 800,
              fontSize: "1rem",
              letterSpacing: "0.06em",
              color: "rgba(255,255,255,0.9)",
            }}
          >
            {tier.name}
          </h3>
        </div>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-2 mb-8">
        <span
          style={{
            fontFamily: "var(--font-space-grotesk, sans-serif)",
            fontWeight: 800,
            fontSize: tier.priceMonthlyEur === 0 ? "2.5rem" : "3.2rem",
            color: "rgba(255,255,255,0.95)",
            lineHeight: 1,
          }}
        >
          {tier.priceMonthlyEur === 0 ? "GRATIS" : `€${tier.priceMonthlyEur.toString().replace(".", ",")}`}
        </span>
        {tier.priceMonthlyEur > 0 && (
          <span
            style={{
              fontFamily: "var(--font-jetbrains, monospace)",
              fontSize: "0.72rem",
              color: "rgba(255,255,255,0.3)",
              letterSpacing: "0.06em",
            }}
          >
            {perMonth}
          </span>
        )}
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: "rgba(255,255,255,0.06)", marginBottom: "1.5rem" }} />

      {/* Features */}
      <ul className="flex flex-col gap-4 flex-1 mb-8">
        {tier.features.map((feature, i) => (
          <li key={i} className="flex items-start gap-3">
            <Check
              size={14}
              style={{ color: popular ? "#00D4FF" : "rgba(255,255,255,0.3)", marginTop: 3, flexShrink: 0 }}
            />
            <span style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>
              {feature}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Link
        href="/dashboard"
        className={popular ? "lp-btn-primary" : "lp-btn-secondary"}
        style={{ justifyContent: "center", textAlign: "center" }}
      >
        {cta}
      </Link>
    </motion.div>
  );
}

const STATIC_TIERS: Tier[] = [
  {
    name: "FREE",
    priceMonthlyEur: 0,
    features: [
      "3 Use Cases (Kündigung, Preiserhöhung, DSGVO)",
      "Basis-KI (Gemini 2.5 Flash)",
      "10 Aktionen pro Monat",
      "Blog & Wissens-Hub Zugang",
      "EU-Hosting (europe-west4)",
    ],
  },
  {
    name: "PRO",
    priceMonthlyEur: 19,
    features: [
      "Alle 8 Sovereign Module",
      "Sovereign Twin (Gemma 4 · On-Device)",
      "Unbegrenzte Aktionen",
      "Priority EU-Cloud Processing",
      "Audit Trail Export (PDF/JSON)",
      "Senate Score für alle Outputs",
      "E-Mail Support",
    ],
  },
  {
    name: "APEX",
    priceMonthlyEur: 49,
    features: [
      "Alles aus PRO",
      "API-Zugang (REST + Webhooks)",
      "Dedizierte EU-Cloud-Instanz",
      "White-Label Option",
      "SLA 99.9% Uptime",
      "Buch: Sovereign Marketing (PDF)",
      "Priority Support + Onboarding",
    ],
  },
];

export default function Pricing() {
  const t = useTranslations("pricing");
  const [tiers, setTiers] = useState<Tier[]>(STATIC_TIERS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.public.getPricing()
      .then((data) => { if (data?.tiers?.length) setTiers(data.tiers); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const getCta = (name: string) => {
    if (name === "SHIELD") return t("cta.shield");
    if (name === "PRO") return t("cta.pro");
    return t("cta.free");
  };

  return (
    <section
      className="relative py-32 px-6"
      id="pricing"
      style={{
        background: "#0D1526",
        borderTop: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-16 text-center">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lp-section-tag mb-6"
          >
            {t("tag")}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="lp-headline mb-4"
            style={{ fontSize: "clamp(2.2rem, 5vw, 3.8rem)" }}
          >
            {t("headline")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            style={{ fontSize: "1.05rem", color: "rgba(255,255,255,0.4)", maxWidth: 480, margin: "0 auto" }}
          >
            {t("sub")}
          </motion.p>
        </div>

        {/* Tiers */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
          {loading
            ? [1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="p-10 animate-pulse"
                  style={{ borderRight: i < 3 ? "1px solid rgba(255,255,255,0.07)" : "none" }}
                >
                  <div style={{ width: 48, height: 48, background: "rgba(255,255,255,0.04)", marginBottom: 24 }} />
                  <div style={{ width: 80, height: 40, background: "rgba(255,255,255,0.06)", marginBottom: 32 }} />
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} style={{ width: "80%", height: 14, background: "rgba(255,255,255,0.03)", marginBottom: 12 }} />
                  ))}
                </div>
              ))
            : tiers.map((tier, i) => (
                <div
                  key={i}
                  style={{ borderRight: i < tiers.length - 1 ? "1px solid rgba(255,255,255,0.07)" : "none" }}
                >
                  <TierCard
                    tier={tier}
                    popular={tier.name === "PRO"}
                    popularLabel={t("popular")}
                    perMonth={t("perMonth")}
                    cta={getCta(tier.name)}
                    delay={0.1 * (i + 1)}
                  />
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}
