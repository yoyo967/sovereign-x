"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { ChevronRight } from "lucide-react";
import { api } from "@/lib/api";
import SovereignIris from "@/components/SovereignIris";

export default function Hero() {
  const t = useTranslations("hero");
  const locale = useLocale();
  const [stats, setStats] = useState({ totalUsers: 0, totalContractsAnalyzed: 0, totalSavingsEur: 0 });

  useEffect(() => {
    api.public.getStats().then(setStats).catch(() => {});
  }, []);

  const badges = [
    t("badge.status"),
    t("badge.location"),
    t("badge.region"),
    t("badge.build"),
  ];

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        paddingTop: "120px",
        paddingBottom: "80px",
        background: "#080E1A",
      }}
    >
      {/* Blueprint grid */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Iris ambient glow behind */}
      <div
        className="absolute z-0"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 640,
          height: 640,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,212,255,0.07) 0%, rgba(0,60,120,0.04) 40%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6">
        <div className="flex flex-col items-center text-center">

          {/* Iris SVG — hero centerpiece */}
          <div
            className="mb-12"
            style={{
              animation: "lp-fade-up 1s ease forwards",
              animationDelay: "0.2s",
              opacity: 0,
            }}
          >
            <SovereignIris size={320} className="mx-auto" />
          </div>

          {/* Status badge strip */}
          <div
            className="flex flex-wrap justify-center gap-2 mb-8"
            style={{
              animation: "lp-fade-up 0.8s ease forwards",
              animationDelay: "0.4s",
              opacity: 0,
            }}
          >
            {badges.map((badge, i) => (
              <span
                key={i}
                className="lp-badge"
                style={i === 0 ? { color: "rgba(0,212,255,0.8)", borderColor: "rgba(0,212,255,0.3)", background: "rgba(0,212,255,0.06)" } : {}}
              >
                {i === 0 && (
                  <span
                    style={{
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      background: "#00D4FF",
                      display: "inline-block",
                      animation: "lp-pulse-dot 2s ease-in-out infinite",
                    }}
                  />
                )}
                {badge}
              </span>
            ))}
          </div>

          {/* Eyebrow */}
          <p
            className="lp-section-tag mb-4"
            style={{
              animation: "lp-fade-up 0.8s ease forwards",
              animationDelay: "0.5s",
              opacity: 0,
            }}
          >
            {t("eyebrow")}
          </p>

          {/* Main headline — brand name, always in English */}
          <h1
            className="lp-headline mb-6"
            style={{
              fontSize: "clamp(4rem, 14vw, 10rem)",
              letterSpacing: "-0.04em",
              lineHeight: 0.9,
              animation: "lp-fade-up 0.9s ease forwards",
              animationDelay: "0.6s",
              opacity: 0,
            }}
          >
            SOVEREIGN
            <br />
            <span style={{ color: "rgba(0,212,255,0.9)" }}>2030</span>
          </h1>

          {/* Subtitle */}
          <p
            style={{
              maxWidth: 640,
              fontSize: "1.1rem",
              lineHeight: 1.7,
              color: "rgba(255,255,255,0.5)",
              marginBottom: "2.5rem",
              animation: "lp-fade-up 0.9s ease forwards",
              animationDelay: "0.75s",
              opacity: 0,
            }}
          >
            {t("sub")}
          </p>

          {/* CTAs */}
          <div
            className="flex flex-col sm:flex-row items-center gap-4"
            style={{
              animation: "lp-fade-up 0.9s ease forwards",
              animationDelay: "0.9s",
              opacity: 0,
            }}
          >
            <Link href="/dashboard" className="lp-btn-primary">
              {t("cta.primary")}
              <ChevronRight size={16} />
            </Link>
            <Link href={`/${locale}#features`} className="lp-btn-secondary">
              {t("cta.secondary")}
            </Link>
          </div>

          {/* Trust Badges */}
          <div
            className="flex flex-wrap justify-center gap-3 mt-6"
            style={{
              animation: "lp-fade-up 0.9s ease forwards",
              animationDelay: "1.05s",
              opacity: 0,
            }}
          >
            {[
              { icon: "🇪🇺", label: "EU AI Act konform" },
              { icon: "🛡️", label: "DSGVO · Privacy by Design" },
              { icon: "⚡", label: "Zero Tracking · Kein Datenverkauf" },
            ].map((badge) => (
              <span
                key={badge.label}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  fontFamily: "var(--font-jetbrains, monospace)",
                  fontSize: "0.58rem",
                  letterSpacing: "0.08em",
                  color: "rgba(255,255,255,0.35)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  padding: "5px 12px",
                  background: "rgba(255,255,255,0.02)",
                }}
              >
                <span style={{ fontSize: "0.75rem" }}>{badge.icon}</span>
                {badge.label}
              </span>
            ))}
          </div>

          {/* Stats row — static fallback + API override */}
          <div
            className="mt-16 w-full grid grid-cols-1 md:grid-cols-3 gap-0"
            style={{
              borderTop: "1px solid rgba(255,255,255,0.06)",
              paddingTop: "2.5rem",
              animation: "lp-fade-up 1s ease forwards",
              animationDelay: "1.1s",
              opacity: 0,
            }}
          >
            {[
              {
                label: t("stats.contracts"),
                value: stats.totalContractsAnalyzed > 0
                  ? stats.totalContractsAnalyzed.toLocaleString()
                  : "12.400+",
              },
              {
                label: t("stats.value"),
                value: stats.totalSavingsEur > 0
                  ? `€${stats.totalSavingsEur.toLocaleString()}`
                  : "€2,8M",
              },
              {
                label: t("stats.nodes"),
                value: stats.totalUsers > 0
                  ? stats.totalUsers.toLocaleString()
                  : "3.200+",
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-2 px-8 py-6"
                style={{
                  borderRight: i < 2 ? "1px solid rgba(255,255,255,0.06)" : "none",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-jetbrains, monospace)",
                    fontSize: "0.6rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.3)",
                  }}
                >
                  {stat.label}
                </span>
                <span
                  className="lp-stat-number"
                  style={{ fontSize: "2.5rem" }}
                >
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 z-10 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, transparent, #080E1A)",
        }}
      />
    </section>
  );
}
