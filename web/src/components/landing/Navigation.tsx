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
    { href: `/${locale}/souveraenitaet`, label: "Datensouveränität", tag: "DATENSCHUTZ", desc: "Deine Daten, deine Regeln" },
    { href: `/${locale}/architektur`, label: "APEX Architektur", tag: "TECHNOLOGIE", desc: "Die 4 Schichten des Systems" },
    { href: `/${locale}/sicherheit`, label: "EU AI Act & DSGVO", tag: "EU AI ACT", desc: "Compliance durch Design" },
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
                  <div className="grid grid-cols-3 gap-8">
                    {/* Column 1: Pillars & Book */}
                    <div>
                      <p style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.55rem", letterSpacing: "0.12em", color: "rgba(0,212,255,0.4)", textTransform: "uppercase", marginBottom: "1rem" }}>
                        Pillars & Basis
                      </p>
                      <div className="flex flex-col gap-1">
                        {pillarLinks.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setWissenOpen(false)}
                            style={{ display: "flex", flexDirection: "column", padding: "0.75rem", background: "transparent", textDecoration: "none", transition: "background 0.15s" }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                          >
                            <span style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontWeight: 600, fontSize: "0.85rem", color: "rgba(255,255,255,0.9)" }}>{link.label}</span>
                            <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.3)" }}>{link.desc}</span>
                          </Link>
                        ))}
                        <Link
                          href={`/${locale}/buch`}
                          onClick={() => setWissenOpen(false)}
                          style={{ display: "flex", flexDirection: "column", padding: "0.75rem", background: "rgba(255,214,0,0.05)", border: "1px solid rgba(255,214,0,0.1)", textDecoration: "none", marginTop: "0.5rem" }}
                        >
                          <span style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontWeight: 700, fontSize: "0.85rem", color: "#FFD600" }}>Sovereign Marketing</span>
                          <span style={{ fontSize: "0.65rem", color: "rgba(255,214,0,0.5)" }}>Das Handbuch (erscheint 2026)</span>
                        </Link>
                      </div>
                    </div>

                    {/* Column 2: APEX Features */}
                    <div>
                      <p style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.55rem", letterSpacing: "0.12em", color: "rgba(0,212,255,0.4)", textTransform: "uppercase", marginBottom: "1rem" }}>
                        APEX Architecture
                      </p>
                      <div className="flex flex-col gap-1">
                        {[
                          { href: `/${locale}/features/agentmemory`, label: "AgentMemory", tag: "DATA LAYER" },
                          { href: `/${locale}/features/privacy-guardian`, label: "Privacy Guardian", tag: "PROTECTION" },
                          { href: `/${locale}/features/execution-center`, label: "Execution Center", tag: "CONTROL" },
                          { href: `/${locale}/features/audit-trail`, label: "Audit Trail", tag: "TRUST" },
                        ].map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setWissenOpen(false)}
                            style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.65rem", textDecoration: "none", transition: "background 0.15s" }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                          >
                            <span style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.45rem", color: "rgba(0,212,255,0.4)", minWidth: "55px" }}>{link.tag}</span>
                            <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.7)" }}>{link.label}</span>
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Column 3: Use Cases */}
                    <div>
                      <p style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.55rem", letterSpacing: "0.12em", color: "rgba(0,212,255,0.4)", textTransform: "uppercase", marginBottom: "1rem" }}>
                        Use Case Hub
                      </p>
                      <div className="flex flex-col gap-1">
                        {[
                          { href: `/${locale}/use-cases/kuendigung`, label: "Vertrag kündigen", tag: "BGB" },
                          { href: `/${locale}/use-cases/preiserhoehung`, label: "Widerspruch", tag: "FINANCE" },
                          { href: `/${locale}/use-cases/datenschutz`, label: "DSGVO Anfragen", tag: "PRIVACY" },
                          { href: `/${locale}/use-cases/finanzen`, label: "Wealth Twin", tag: "WEALTH" },
                        ].map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setWissenOpen(false)}
                            style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.65rem", textDecoration: "none", transition: "background 0.15s" }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                          >
                            <span style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.45rem", color: "rgba(187,134,252,0.4)", minWidth: "45px" }}>{link.tag}</span>
                            <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.7)" }}>{link.label}</span>
                          </Link>
                        ))}
                        <Link
                          href={`/${locale}/use-cases`}
                          onClick={() => setWissenOpen(false)}
                          style={{ marginTop: "0.75rem", paddingLeft: "0.65rem", fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.55rem", color: "var(--sovereign-cyan, #00E5FF)", textDecoration: "none", textTransform: "uppercase" }}
                        >
                          Alle Use Cases →
                        </Link>
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

            {/* Mobile Pillar links */}
            <div>
              <p style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.6rem", letterSpacing: "0.12em", color: "rgba(0,212,255,0.4)", textTransform: "uppercase", marginBottom: "1rem" }}>
                Pillar Guides
              </p>
              {pillarLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  style={{ display: "block", fontFamily: "var(--font-space-grotesk, sans-serif)", fontSize: "1.1rem", fontWeight: 700, color: "rgba(255,255,255,0.75)", textDecoration: "none", marginBottom: "0.75rem" }}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Mobile Blog link */}
            <Link
              href={`/${locale}/blog`}
              onClick={() => setMenuOpen(false)}
              style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontSize: "1.1rem", fontWeight: 700, color: "rgba(255,255,255,0.75)", textDecoration: "none" }}
            >
              Blog & Wissen
            </Link>

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
