import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard", "/api/", "/_next/"],
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
        allow: ["/", "/de/", "/en/", "/blog/", "/souveraenitaet", "/architektur", "/sicherheit"],
        disallow: ["/dashboard"],
      },
    ],
    sitemap: "https://sovereign.de/sitemap.xml",
    host: "https://sovereign.de",
  };
}
