"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { useAuth } from "@/hooks/useAuth";
import { Menu, X, ChevronDown } from "lucide-react";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function Navigation() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [wissenOpen, setWissenOpen] = useState(false);
  const [mobileCoreOpen, setMobileCoreOpen] = useState(false);
  const [mobileIntelOpen, setMobileIntelOpen] = useState(false);
  const wissenRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (wissenRef.current && !wissenRef.current.contains(e.target as Node)) {
        setWissenOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const pillarLinks = [
    { href: `/${locale}/module/sovereign-twin`,   label: "Sovereign Twin",     tag: "CORE",       desc: "Digitaler Zwilling · On-Device" },
    { href: `/${locale}/module/privacy-guardian`, label: "Privacy Guardian",   tag: "GOVERNANCE", desc: "PII-Schutz in Echtzeit" },
    { href: `/${locale}/module/execution-center`, label: "Execution Center",   tag: "CORE",       desc: "Autonome Task-Ausführung" },
    { href: `/${locale}/module/audit-trail`,      label: "Audit Trail",        tag: "GOVERNANCE", desc: "Kryptographische Transparenz" },
    { href: `/${locale}/module/sicherheit`,       label: "Security Senate",    tag: "GOVERNANCE", desc: "EU AI Act & Zero-Trust" },
    { href: `/${locale}/module/finanzautonomie`,  label: "Finanzautonomie",    tag: "INTELLIGENCE", desc: "Preiserhöhungen & Wealth" },
    { href: `/${locale}/module/ki-recht`,         label: "KI & Recht",         tag: "INTELLIGENCE", desc: "Vertragsrecht & DSGVO" },
    { href: `/${locale}/module/souveraenitaet`,   label: "Datensouveränität",  tag: "CORE",       desc: "Vollständige Datenkontrolle" },
  ];


  const mainLinks = [
    { href: `/${locale}#features`, label: t("features") },
    { href: `/${locale}#pricing`, label: t("pricing") },
  ];

  return (
    <>
      {/* Status bar */}
      <div
        className="fixed top-0 left-0 right-0 z-50 hidden md:flex items-center justify-center gap-6 h-6 px-6"
        style={{
          background: "#080E1A",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        <span
          className="flex items-center gap-2"
          style={{
            fontFamily: "var(--font-jetbrains, monospace)",
            fontSize: "0.58rem",
            letterSpacing: "0.12em",
            color: "rgba(255,255,255,0.28)",
          }}
        >
          <span
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: "#00D4FF",
              display: "inline-block",
              animation: "lp-pulse-dot 2s ease-in-out infinite",
              boxShadow: "0 0 6px rgba(0,212,255,0.7)",
            }}
          />
          SYSTEM STATUS: NOMINAL
        </span>
        <span style={{ color: "rgba(255,255,255,0.1)", fontSize: "0.58rem" }}>|</span>
        <span style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.58rem", letterSpacing: "0.12em", color: "rgba(255,255,255,0.28)" }}>
          BUILD: 2030.AI
        </span>
        <span style={{ color: "rgba(255,255,255,0.1)", fontSize: "0.58rem" }}>|</span>
        <span style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.58rem", letterSpacing: "0.12em", color: "rgba(255,255,255,0.28)" }}>
          EU-FIRST // BERLIN, DE
        </span>
        <span style={{ color: "rgba(255,255,255,0.1)", fontSize: "0.58rem" }}>|</span>
        <span style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.58rem", letterSpacing: "0.12em", color: "rgba(255,255,255,0.28)" }}>
          GEMINI 2.5 FLASH // VERTEX AI
        </span>
      </div>

      {/* Main nav */}
      <nav
        aria-label="Hauptnavigation"
        className="fixed left-0 right-0 z-40 transition-all duration-300"
        style={{
          top: "24px",
          background: scrolled ? "rgba(8,14,26,0.97)" : "transparent",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
          backdropFilter: scrolled ? "blur(24px)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-14">

          {/* Logo */}
          <Link href={`/${locale}`} style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 32, height: 32, border: "1.5px solid rgba(0,212,255,0.4)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 12, height: 12, border: "1px solid rgba(0,212,255,0.35)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 4, height: 4, background: "#00D4FF", borderRadius: "50%", boxShadow: "0 0 8px rgba(0,212,255,0.9)" }} />
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
              <span style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontWeight: 800, fontSize: "0.95rem", letterSpacing: "0.08em", color: "rgba(255,255,255,0.95)" }}>
                SOVEREIGN
              </span>
              <span style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.62rem", color: "rgba(0,212,255,0.65)", letterSpacing: "0.06em" }}>
                2030
              </span>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-7">
            {mainLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  fontFamily: "var(--font-space-grotesk, sans-serif)",
                  fontSize: "0.76rem",
                  fontWeight: 500,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.45)",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.9)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.45)"; }}
              >
                {link.label}
              </Link>
            ))}

            {/* Wissen Mega Menu */}
            <div ref={wissenRef} style={{ position: "relative" }}>
              <button
                onClick={() => setWissenOpen(!wissenOpen)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  fontFamily: "var(--font-space-grotesk, sans-serif)",
                  fontSize: "0.76rem",
                  fontWeight: 500,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: wissenOpen ? "var(--sovereign-cyan, #00E5FF)" : "rgba(255,255,255,0.45)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  transition: "color 0.2s",
                }}
              >
                Nexus Hub
                <ChevronDown
                  size={12}
                  style={{
                    transition: "transform 0.2s",
                    transform: wissenOpen ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                />
              </button>

              {wissenOpen && (
                <div
                  className="lp-nav-megamenu"
                  style={{
                    position: "absolute",
                    top: "calc(100% + 1rem)",
                    right: "-140px",
                    width: 720,
                    background: "rgba(8,14,26,0.98)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    backdropFilter: "blur(24px)",
                    padding: "2rem",
                    zIndex: 100,
                    boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
                  }}
                >
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "2rem" }}>

                    {/* Column 1: Pillars Core + Governance */}
                    <div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                        <p style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.5rem", letterSpacing: "0.12em", color: "rgba(0,212,255,0.4)", textTransform: "uppercase" }}>
                          Module Registry
                        </p>
                        <Link
                          href={`/${locale}/module`}
                          onClick={() => setWissenOpen(false)}
                          style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.48rem", color: "rgba(0,212,255,0.5)", textDecoration: "none", textTransform: "uppercase" }}
                        >
                          All 8 →
                        </Link>
                      </div>
                      <div className="flex flex-col gap-0">
                        {pillarLinks.slice(0, 4).map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setWissenOpen(false)}
                            style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.55rem 0.5rem", textDecoration: "none", transition: "background 0.15s", borderBottom: "1px solid rgba(255,255,255,0.03)" }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                          >
                            <span style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.44rem", color: "rgba(0,212,255,0.35)", minWidth: "60px", textTransform: "uppercase" }}>{link.tag}</span>
                            <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.75)", fontWeight: 500 }}>{link.label}</span>
                          </Link>
                        ))}
                        {pillarLinks.slice(4).map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setWissenOpen(false)}
                            style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.55rem 0.5rem", textDecoration: "none", transition: "background 0.15s", borderBottom: "1px solid rgba(255,255,255,0.03)" }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                          >
                            <span style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.44rem", color: "rgba(187,134,252,0.35)", minWidth: "60px", textTransform: "uppercase" }}>{link.tag}</span>
                            <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.75)", fontWeight: 500 }}>{link.label}</span>
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Column 2: Use Cases + Blog */}
                    <div>
                      <p style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.5rem", letterSpacing: "0.12em", color: "rgba(0,212,255,0.4)", textTransform: "uppercase", marginBottom: "1rem" }}>
                        Use Case Hub
                      </p>
                      <div className="flex flex-col gap-0">
                        {[
                          { href: `/${locale}/use-cases/kuendigung`,    label: "Vertrag kündigen",  tag: "BGB" },
                          { href: `/${locale}/use-cases/preiserhoehung`, label: "Preiserhöhung",     tag: "FINANCE" },
                          { href: `/${locale}/use-cases/datenschutz`,   label: "DSGVO Anfragen",    tag: "PRIVACY" },
                          { href: `/${locale}/use-cases/finanzen`,      label: "Wealth Twin",       tag: "WEALTH" },
                        ].map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setWissenOpen(false)}
                            style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.55rem 0.5rem", textDecoration: "none", transition: "background 0.15s", borderBottom: "1px solid rgba(255,255,255,0.03)" }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                          >
                            <span style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.44rem", color: "rgba(0,230,118,0.35)", minWidth: "48px", textTransform: "uppercase" }}>{link.tag}</span>
                            <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.75)", fontWeight: 500 }}>{link.label}</span>
                          </Link>
                        ))}
                      </div>
                      <div style={{ marginTop: "1.25rem", paddingTop: "1rem", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                        <p style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.5rem", letterSpacing: "0.12em", color: "rgba(0,212,255,0.4)", textTransform: "uppercase", marginBottom: "0.6rem" }}>
                          Intelligence Matrix
                        </p>
                        <Link href={`/${locale}/blog`} onClick={() => setWissenOpen(false)} style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.55rem 0.5rem", textDecoration: "none", transition: "background 0.15s" }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                          <span style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.44rem", color: "rgba(0,212,255,0.35)", minWidth: "48px", textTransform: "uppercase" }}>BLOG</span>
                          <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.75)", fontWeight: 500 }}>Blog & Cluster</span>
                        </Link>
                      </div>
                    </div>

                    {/* Column 3: Quick Access + Mehr */}
                    <div>
                      <p style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.5rem", letterSpacing: "0.12em", color: "rgba(0,212,255,0.4)", textTransform: "uppercase", marginBottom: "0.75rem" }}>
                        Quick Access
                      </p>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginBottom: "1rem" }}>
                        <Link href={`/${locale}/module`} onClick={() => setWissenOpen(false)} style={{
                          padding: "0.75rem",
                          background: "rgba(0,212,255,0.06)", border: "1px solid rgba(0,212,255,0.15)",
                          textDecoration: "none", display: "flex", flexDirection: "column", gap: 3,
                        }}>
                          <span style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.5rem", color: "rgba(0,212,255,0.6)", textTransform: "uppercase" }}>PILLAR REGISTRY</span>
                          <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>Module Registry →</span>
                          <span style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.3)" }}>Alle 8 Module im Überblick</span>
                        </Link>
                        <Link href="/dashboard" onClick={() => setWissenOpen(false)} style={{
                          padding: "0.65rem",
                          background: "#00D4FF", color: "#080E1A",
                          textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center",
                          fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.6rem",
                          letterSpacing: "0.1em", fontWeight: 700, textTransform: "uppercase",
                        }}>
                          Enter OS →
                        </Link>
                      </div>
                      {/* Mehr */}
                      <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "0.75rem" }}>
                        <p style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.5rem", letterSpacing: "0.12em", color: "rgba(255,255,255,0.2)", textTransform: "uppercase", marginBottom: "0.6rem" }}>
                          Mehr
                        </p>
                        {[
                          { href: `/${locale}/manifesto`,      label: "Das Manifest",      tag: "VISION" },
                          { href: `/${locale}/eu-regulierung`, label: "EU-Regulierung",    tag: "LEGAL" },
                          { href: `/${locale}/buch`,           label: "Das Handbuch",      tag: "BUCH" },
                          { href: `/${locale}/roadmap`,        label: "Roadmap 2030",      tag: "PLAN" },
                        ].map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setWissenOpen(false)}
                            style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.45rem 0.5rem", textDecoration: "none", borderBottom: "1px solid rgba(255,255,255,0.03)" }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                          >
                            <span style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.44rem", color: "rgba(255,255,255,0.2)", minWidth: "40px", textTransform: "uppercase" }}>{link.tag}</span>
                            <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.65)", fontWeight: 500 }}>{link.label}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-4">
            <LanguageSwitcher />
            {user ? (
              <Link href="/dashboard" className="lp-btn-primary" style={{ padding: "8px 20px", fontSize: "0.72rem" }}>
                {t("toDashboard")}
              </Link>
            ) : (
              <>
                <Link
                  href="/dashboard"
                  style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontSize: "0.76rem", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", textDecoration: "none" }}
                >
                  {t("login")}
                </Link>
                <Link href="/dashboard" className="lp-btn-primary" style={{ padding: "8px 20px", fontSize: "0.72rem" }}>
                  {t("start")}
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ color: "rgba(255,255,255,0.7)", background: "none", border: "none", cursor: "pointer", padding: 4 }}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-30 flex flex-col pt-28 px-6 pb-8 overflow-y-auto"
          style={{ background: "rgba(8,14,26,0.99)", backdropFilter: "blur(24px)" }}
        >
          <div className="flex flex-col gap-6 mt-4">
            {mainLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontSize: "1.4rem", fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(255,255,255,0.85)", textDecoration: "none" }}
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile Pillar links — 2 collapsible groups */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {/* Group 1: Core + Governance */}
              <div>
                <button
                  onClick={() => setMobileCoreOpen(!mobileCoreOpen)}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    width: "100%", padding: "0.75rem 0",
                    background: "none", border: "none", borderBottom: "1px solid rgba(255,255,255,0.07)",
                    cursor: "pointer", textAlign: "left",
                  }}
                >
                  <span style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.6rem", letterSpacing: "0.12em", color: "rgba(0,212,255,0.5)", textTransform: "uppercase" }}>
                    Core / Governance
                  </span>
                  <ChevronDown size={14} style={{ color: "rgba(255,255,255,0.3)", transition: "transform 0.2s", transform: mobileCoreOpen ? "rotate(180deg)" : "rotate(0deg)" }} />
                </button>
                {mobileCoreOpen && (
                  <div style={{ paddingTop: "0.5rem", paddingBottom: "0.5rem" }}>
                    {pillarLinks.filter(l => l.tag === "CORE" || l.tag === "GOVERNANCE").map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMenuOpen(false)}
                        style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.6rem 0.5rem", textDecoration: "none", borderBottom: "1px solid rgba(255,255,255,0.03)" }}
                      >
                        <span style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.44rem", color: "rgba(0,212,255,0.4)", minWidth: "60px", textTransform: "uppercase" }}>{link.tag}</span>
                        <span style={{ fontSize: "1rem", fontWeight: 700, color: "rgba(255,255,255,0.8)", fontFamily: "var(--font-space-grotesk, sans-serif)" }}>{link.label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Group 2: Intelligence */}
              <div>
                <button
                  onClick={() => setMobileIntelOpen(!mobileIntelOpen)}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    width: "100%", padding: "0.75rem 0",
                    background: "none", border: "none", borderBottom: "1px solid rgba(255,255,255,0.07)",
                    cursor: "pointer", textAlign: "left",
                  }}
                >
                  <span style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.6rem", letterSpacing: "0.12em", color: "rgba(187,134,252,0.5)", textTransform: "uppercase" }}>
                    Intelligence Layer
                  </span>
                  <ChevronDown size={14} style={{ color: "rgba(255,255,255,0.3)", transition: "transform 0.2s", transform: mobileIntelOpen ? "rotate(180deg)" : "rotate(0deg)" }} />
                </button>
                {mobileIntelOpen && (
                  <div style={{ paddingTop: "0.5rem", paddingBottom: "0.5rem" }}>
                    {pillarLinks.filter(l => l.tag === "INTELLIGENCE").map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMenuOpen(false)}
                        style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.6rem 0.5rem", textDecoration: "none", borderBottom: "1px solid rgba(255,255,255,0.03)" }}
                      >
                        <span style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.44rem", color: "rgba(187,134,252,0.4)", minWidth: "60px", textTransform: "uppercase" }}>{link.tag}</span>
                        <span style={{ fontSize: "1rem", fontWeight: 700, color: "rgba(255,255,255,0.8)", fontFamily: "var(--font-space-grotesk, sans-serif)" }}>{link.label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Mobile secondary links */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {[
                { href: `/${locale}/blog`,           label: "Blog & Wissen" },
                { href: `/${locale}/manifesto`,      label: "Das Manifest" },
                { href: `/${locale}/eu-regulierung`, label: "EU-Regulierung" },
                { href: `/${locale}/module`,         label: "Module Registry" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontSize: "1.05rem", fontWeight: 600, color: "rgba(255,255,255,0.6)", textDecoration: "none" }}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="mt-4 flex flex-col gap-3">
              {user ? (
                <Link href="/dashboard" className="lp-btn-primary" onClick={() => setMenuOpen(false)} style={{ justifyContent: "center" }}>
                  {t("toDashboard")}
                </Link>
              ) : (
                <>
                  <Link href="/dashboard" className="lp-btn-secondary" onClick={() => setMenuOpen(false)} style={{ justifyContent: "center" }}>
                    {t("login")}
                  </Link>
                  <Link href="/dashboard" className="lp-btn-primary" onClick={() => setMenuOpen(false)} style={{ justifyContent: "center" }}>
                    {t("start")}
                  </Link>
                </>
              )}
            </div>
            <div className="mt-2">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
