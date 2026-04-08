// src/components/ui/Breadcrumb.tsx
// ─── Server Component — Breadcrumb + BreadcrumbList Schema.org ───

import Link from "next/link";
import JsonLd from "@/components/SEO/JsonLd";

const BASE_URL = "https://sovereign.de";

export interface BreadcrumbItem {
  label: string;
  href?: string; // omit for current (last) item
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  locale: string;
}

export default function Breadcrumb({ items, locale }: BreadcrumbProps) {
  // BreadcrumbList schema — always starts with Home
  const allItems: BreadcrumbItem[] = [
    { label: locale === "de" ? "Startseite" : "Home", href: `/${locale}` },
    ...items,
  ];

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: allItems.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: `${BASE_URL}${item.href}` } : {}),
    })),
  };

  return (
    <>
      <JsonLd data={schema} />
      <nav
        aria-label="Breadcrumb"
        style={{
          padding: "1rem 0 0",
          maxWidth: "1400px",
          margin: "0 auto",
          paddingLeft: "clamp(1.5rem, 4vw, 4rem)",
          paddingRight: "clamp(1.5rem, 4vw, 4rem)",
        }}
      >
        <ol
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "0.2rem",
          }}
        >
          {allItems.map((item, i) => {
            const isLast = i === allItems.length - 1;
            return (
              <li
                key={i}
                style={{ display: "flex", alignItems: "center", gap: "0.2rem" }}
              >
                {i > 0 && (
                  <span
                    aria-hidden="true"
                    style={{
                      fontFamily: "var(--font-jetbrains, monospace)",
                      fontSize: "0.55rem",
                      color: "rgba(255,255,255,0.15)",
                      margin: "0 0.15rem",
                    }}
                  >
                    /
                  </span>
                )}
                {isLast || !item.href ? (
                  <span
                    aria-current="page"
                    style={{
                      fontFamily: "var(--font-jetbrains, monospace)",
                      fontSize: "0.58rem",
                      letterSpacing: "0.06em",
                      color: "rgba(255,255,255,0.45)",
                    }}
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    style={{
                      fontFamily: "var(--font-jetbrains, monospace)",
                      fontSize: "0.58rem",
                      letterSpacing: "0.06em",
                      color: "rgba(0,212,255,0.5)",
                      textDecoration: "none",
                    }}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
