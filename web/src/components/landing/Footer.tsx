"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";

export default function Footer() {
  const t = useTranslations("footer");
  const locale = useLocale();

  const sections = [
    {
      title: t("sections.product.title"),
      links: [
        { name: t("sections.product.features"), href: `/${locale}#features` },
        { name: t("sections.product.pricing"), href: `/${locale}#pricing` },
        { name: t("sections.product.security"), href: `/${locale}#security` },
        { name: t("sections.product.business"), href: `/${locale}/business` },
      ],
    },
    {
      title: t("sections.legal.title"),
      links: [
        { name: t("sections.legal.impressum"), href: `/${locale}/impressum` },
        { name: t("sections.legal.privacy"), href: `/${locale}/datenschutz` },
        { name: t("sections.legal.terms"), href: `/${locale}/agb` },
        { name: t("sections.legal.compliance"), href: `/${locale}/compliance` },
      ],
    },
    {
      title: t("sections.resources.title"),
      links: [
        { name: t("sections.resources.blog"), href: `/${locale}/blog` },
        { name: t("sections.resources.docs"), href: `/${locale}/docs` },
        { name: t("sections.resources.api"), href: `/${locale}/api-docs` },
        { name: t("sections.resources.press"), href: `/${locale}/presse` },
      ],
    },
  ];

  return (
    <footer
      className="relative overflow-hidden"
      style={{
        background: "#080E1A",
        borderTop: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      {/* Blueprint grid */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">

          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link
              href={`/${locale}`}
              style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  border: "1.5px solid rgba(0,212,255,0.35)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    background: "#00D4FF",
                    borderRadius: "50%",
                    boxShadow: "0 0 8px rgba(0,212,255,0.7)",
                  }}
                />
              </div>
              <span
                style={{
                  fontFamily: "var(--font-space-grotesk, sans-serif)",
                  fontWeight: 800,
                  fontSize: "0.9rem",
                  letterSpacing: "0.08em",
                  color: "rgba(255,255,255,0.9)",
                }}
              >
                SOVEREIGN 2030
              </span>
            </Link>
            <p
              style={{
                fontSize: "0.82rem",
                lineHeight: 1.7,
                color: "rgba(255,255,255,0.3)",
                maxWidth: 240,
                marginBottom: "1.5rem",
              }}
            >
              {t("tagline")}
            </p>

            {/* Build badge */}
            <span className="lp-badge">
              {t("build")}
            </span>
          </div>

          {/* Link columns */}
          {sections.map((section, i) => (
            <div key={i}>
              <h4
                style={{
                  fontFamily: "var(--font-jetbrains, monospace)",
                  fontSize: "0.6rem",
                  fontWeight: 600,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.25)",
                  marginBottom: "1.25rem",
                }}
              >
                {section.title}
              </h4>
              <ul className="flex flex-col gap-3">
                {section.links.map((link, j) => (
                  <li key={j}>
                    <Link
                      href={link.href}
                      style={{
                        fontFamily: "var(--font-space-grotesk, sans-serif)",
                        fontSize: "0.85rem",
                        color: "rgba(255,255,255,0.35)",
                        textDecoration: "none",
                        transition: "color 0.2s",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.75)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.35)"; }}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          <p
            style={{
              fontFamily: "var(--font-jetbrains, monospace)",
              fontSize: "0.62rem",
              letterSpacing: "0.06em",
              color: "rgba(255,255,255,0.2)",
            }}
          >
            {t("copyright")}
          </p>

          <div className="flex items-center gap-6">
            <span
              className="flex items-center gap-2"
              style={{
                fontFamily: "var(--font-jetbrains, monospace)",
                fontSize: "0.62rem",
                letterSpacing: "0.1em",
                color: "rgba(0,212,255,0.5)",
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
                }}
              />
              {t("status")}
            </span>
            <span
              style={{
                fontFamily: "var(--font-jetbrains, monospace)",
                fontSize: "0.62rem",
                letterSpacing: "0.1em",
                color: "rgba(255,255,255,0.2)",
              }}
            >
              {t("builtIn")}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
