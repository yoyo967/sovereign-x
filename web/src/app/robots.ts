import { MetadataRoute } from "next";

// Pages that should not be indexed — legal/util pages & authenticated area
const NOINDEX_PATHS = [
  "/dashboard/",
  "/api/",
  "/_next/",
  "/de/impressum",
  "/en/impressum",
  "/de/datenschutz",
  "/en/datenschutz",
  "/de/agb",
  "/en/agb",
];

// High-value content paths explicitly allowed for AI crawlers (GEO)
const GEO_ALLOW = [
  "/",
  "/de/",
  "/en/",
  "/de/blog/",
  "/en/blog/",
  "/de/module/",
  "/en/module/",
  "/de/eu-regulierung",
  "/en/eu-regulierung",
  "/de/manifesto",
  "/en/manifesto",
  "/de/roadmap",
  "/en/roadmap",
  "/de/vergleich",
  "/en/vergleich",
  "/de/technologie",
  "/en/technologie",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: NOINDEX_PATHS,
      },
      {
        // Allow major AI crawlers for GEO (Generative Engine Optimization)
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "Google-Extended",
          "PerplexityBot",
          "Amazonbot",
          "ClaudeBot",
          "anthropic-ai",
          "cohere-ai",
        ],
        allow: GEO_ALLOW,
        disallow: ["/dashboard/", "/api/"],
      },
    ],
    sitemap: "https://sovereign.de/sitemap.xml",
    host: "https://sovereign.de",
  };
}
