# SOVEREIGN-NEXUS-SEED.md
# Version: 1.0 · DNA-Sync: v3.0 · Masterplan: v4.1
# Zweck: Single Source of Truth für alle Agenten-Sessions (Cluster A, B, C)
# Regel: Diese Datei wird als ERSTES in jeden neuen Chat-Thread geladen.
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

---

## 1 · IDENTITÄT & TONALITÄT (Copy-Fixpunkte)

**Produkt:** Sovereign 2030 — Autonomous Life-OS
**Plattform:** sovereign.de (Landing) · app.sovereign.de (Web App) · Android
**Mission:** Demokratisierung von Verhandlungsmacht. Das Individuum erhält
             dieselben technologischen Werkzeuge wie Konzerne und Institutionen.

### Pflicht-Regeln für jedes Wort auf der Plattform

- Ton: Technischer Senior-Advisor. Klar, präzise, lösungsorientiert.
- Keine Floskeln: VERBOTEN sind "Unlock", "Empower", "Journey", "Seamless",
  "Next-level", "Game-changer", "Your all-in-one solution".
- Jeder H1 beantwortet exakt: **Was tut dieses System — für wen — warum jetzt?**
- "Sovereign" ist immer großgeschrieben. Immer.
- Begriffe sind technische Fixpunkte, keine Marketing-Labels:
    AgentMemory · Privacy Guardian · Execution Center · Audit Trail
    Sovereign Twin · Finance Guardian · Clause Intelligence Engine
    BoundaryConditions · SwipeToApprove · Life-Cases
- Zielgruppen (exakt):
    A) Sovereign Individual — Privatperson mit komplexem Vertragsleben
    B) Professional Shield — Freelancer, KMU, Handwerker ohne Rechtsabteilung
- Sprache: Deutsch (DE) als Default. EN-Varianten in /en/* Routen.
- Keine Emojis im Body-Copy. Emojis nur in System-Status-Labels (UI-Ebene).

---

## 2 · AI LAYER (Gemma 4 Multi-Tier — Fixpunkte)

| Layer              | Modell              | Ort                        | Zweck                              |
|--------------------|---------------------|----------------------------|------------------------------------|
| On-Device Mobile   | Gemma 4 E2B / E4B   | Endgerät des Nutzers       | 100% lokale Verarbeitung, Zero-PII |
| On-Device Browser  | Gemma 4 E2B         | IndexedDB + WASM           | Browser-Demo, kein Server-Call     |
| Backend Reasoning  | Gemma 4 26B MoE     | Cloud Run europe-west4     | Vertragsanalyse, Clause Engine     |
| Opus Magnum Core   | Gemma 4 31B Dense   | GKE Agent Sandbox          | Systemweite Orchestrierung         |
| Real-Time Terminal | Gemini 2.5 Flash    | Vertex AI europe-west4     | Live-Terminal Speed-Layer          |

**Kommunikationsregel im Copy:**
- On-Device Features → "Verarbeitung ausschließlich auf Ihrem Gerät."
- Backend Features → "Verschlüsselt. EU-Server. Kein Verkauf Ihrer Daten."
- Live Terminal → immer mit Disclaimer (siehe Block 3).

---

## 3 · EU AI ACT ART. 13 — DISCLAIMER (exakte Formulierungen, copy-paste)

### Standard-Disclaimer (alle Demo-Sektionen)
Dieses System interagiert mit einem KI-Modell
(Gemma 4 On-Device / Gemini 2.5 Flash · EU-Server europe-west4).
Ergebnisse dienen der Demonstration. Keine PII-Speicherung.

### Live-Terminal Label (UI-Badge, dezent, technisch)
System: Gemini 2.5 Flash · Processing: Cloud (EU-Region) · No PII storage

### Feature-Seiten mit Agent-Interaktion
KI-System aktiv: [Modellname] · Betrieben nach EU AI Act Art. 13 ·
Alle Aktionen erfordern menschliche Freigabe (Human-in-the-Loop).

### Audit-Trail Preview (simuliert auf Landing-Demos)
```json
{
  "timestamp": "2026-04-04T18:45:00Z",
  "model": "gemma-4-26b-moe",
  "action": "contract_analysis",
  "input_hash": "sha256:a3f...",
  "pii_detected": false,
  "human_approval_required": true,
  "eu_ai_act_compliant": true
}
```

---

## 4 · JSONLD SCHEMA-TEMPLATES (pro Route, copy-paste ready)

### /twin → Product Schema
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Sovereign Twin",
  "description": "Der persistente digitale Zwilling. On-Device Intelligence mit Gemma 4.",
  "brand": { "@type": "Brand", "name": "Sovereign 2030" },
  "offers": {
    "@type": "Offer",
    "price": "6.99",
    "priceCurrency": "EUR",
    "availability": "https://schema.org/InStock"
  }
}
```

### /buch → Book Schema
```json
{
  "@context": "https://schema.org",
  "@type": "Book",
  "name": "Sovereign Marketing",
  "author": { "@type": "Person", "name": "[AUTHOR_NAME]" },
  "numberOfPages": "[PAGES]",
  "inLanguage": "de",
  "offers": [
    { "@type": "Offer", "name": "E-Book",    "price": "19.90", "priceCurrency": "EUR" },
    { "@type": "Offer", "name": "Paperback", "price": "34.90", "priceCurrency": "EUR" }
  ]
}
```

### /use-cases → WebPage + BreadcrumbList
```json
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Sovereign Use Cases — Reale Anwendungsszenarien",
  "breadcrumb": {
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home",      "item": "https://sovereign.de" },
      { "@type": "ListItem", "position": 2, "name": "Use Cases", "item": "https://sovereign.de/use-cases" }
    ]
  }
}
```

### /features/* → TechArticle Schema (Template)
```json
{
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "headline": "[FEATURE_NAME] — Sovereign 2030",
  "description": "[FEATURE_DESCRIPTION]",
  "author": { "@type": "Organization", "name": "Sovereign 2030" },
  "inLanguage": "de"
}
```

### /use-cases/* → HowTo Schema (Template)
```json
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "[USE_CASE_TITLE]",
  "description": "[USE_CASE_DESCRIPTION]",
  "step": [
    { "@type": "HowToStep", "name": "Trigger erkennen",   "text": "[STEP_1]" },
    { "@type": "HowToStep", "name": "Analyse",            "text": "[STEP_2]" },
    { "@type": "HowToStep", "name": "Strategie",          "text": "[STEP_3]" },
    { "@type": "HowToStep", "name": "Execution freigeben","text": "[STEP_4]" }
  ]
}
```

---

## 5 · STRIPE PRICE IDs (Build-safe Konstanten)

```typescript
// lib/stripe-config.ts
// Platzhalter für Build. Echte IDs via .env.local / Vercel Env Vars.

export const PRICE_IDS = {
  // Abonnements
  PRO_MONTHLY:      process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY ?? "price_PRO_MONTHLY_PLACEHOLDER",
  PRO_YEARLY:       process.env.NEXT_PUBLIC_STRIPE_PRO_YEARLY  ?? "price_PRO_YEARLY_PLACEHOLDER",
  SHIELD_MONTHLY:   process.env.NEXT_PUBLIC_STRIPE_SHIELD_M    ?? "price_SHIELD_MONTHLY_PLACEHOLDER",
  SHIELD_YEARLY:    process.env.NEXT_PUBLIC_STRIPE_SHIELD_Y    ?? "price_SHIELD_YEARLY_PLACEHOLDER",

  // Buch (one_time)
  BOOK_EBOOK:       process.env.NEXT_PUBLIC_STRIPE_BOOK_EBOOK  ?? "price_BOOK_EBOOK_PLACEHOLDER",
  BOOK_PRINT:       process.env.NEXT_PUBLIC_STRIPE_BOOK_PRINT  ?? "price_BOOK_PRINT_PLACEHOLDER",

  // Micro-Transactions
  ADDON_KUENDIGUNG: process.env.NEXT_PUBLIC_STRIPE_ADDON_K     ?? "price_ADDON_K_PLACEHOLDER",
  ADDON_VORLAGE:    process.env.NEXT_PUBLIC_STRIPE_ADDON_V     ?? "price_ADDON_V_PLACEHOLDER",
} as const;

// Zahlungsmethoden (Google Pay inklusive — Stripe aktiviert nativ)
export const PAYMENT_METHODS = ["card", "sepa_debit", "google_pay"] as const;

// MwSt.-Hinweis im UI:
// E-Book (digital): 19% MwSt.
// Paperback:         7% MwSt. (DE Buchpreisbindung — steuerlich prüfen)
```

---

## 6 · DESIGN-TOKENS (Sovereign Blueprint — Fixpunkte)

```css
/* Sovereign Design System — Web-Mapping aus coreui/theme/Color.kt */

:root {
  --sovereign-navy:        #0A1628;  /* Primärer Hintergrund */
  --sovereign-space-black: #050D18;  /* Tiefster Hintergrund */
  --sovereign-surface:     #0F2035;  /* Karten-Hintergrund */
  --sovereign-cyan:        #00E5FF;  /* Primär-Akzent (CTAs, aktive Zustände) */
  --sovereign-purple:      #BB86FC;  /* Sekundär-Akzent (Strategie, Vision) */
  --sovereign-teal:        #00BFA5;  /* Erfolg, positive Ergebnisse */
  --sovereign-gold:        #FFD600;  /* Attention, Savings */
  --sovereign-pink:        #FF4081;  /* Warnung, Risiko */
  --sovereign-risk-red:    #FF1744;  /* Kritisches Risiko */
  --sovereign-success:     #00E676;  /* Erfolgreiche Aktion */
  --sovereign-text:        #E0E0E0;  /* Primärtext */
  --sovereign-text-muted:  #9E9E9E;  /* Sekundärtext */
  --sovereign-border:      rgba(255,255,255,0.12); /* 1px Grid */
  --glass-bg:              rgba(15,32,53,0.8);     /* Glassmorphism */

  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
  --font-body: 'Inter', sans-serif;
}
```

**Design-Regeln (nicht verhandelbar):**
- Hintergrund: ausschließlich `--sovereign-navy` oder `--sovereign-space-black`
- Kein `#ffffff` oder heller Hintergrund auf irgendeiner Seite
- `--sovereign-cyan` NUR für CTAs und aktive Zustände — nicht als Dekoration
- Alle Code/Daten-Blöcke: `--font-mono`
- Border: ausschließlich `1px solid var(--sovereign-border)`
- Cards: `background: var(--glass-bg); backdrop-filter: blur(12px);`
- Kein Light-Mode-Toggle auf sovereign.de — ausschließlich Dark

---

## 7 · ROUTEN-MATRIX (vollständig)

| Route                       | Schema      | Cluster  | Priorität |
|-----------------------------|-------------|----------|-----------|
| /twin                       | Product     | A        | P0        |
| /buch                       | Book        | A        | P0        |
| /use-cases                  | WebPage     | A        | P0        |
| /features/agentmemory       | TechArticle | B        | P1        |
| /features/privacy-guardian  | TechArticle | B        | P1        |
| /features/execution-center  | TechArticle | B        | P1        |
| /features/audit-trail       | TechArticle | B        | P1        |
| /use-cases/kuendigung       | HowTo       | C        | P2        |
| /use-cases/preiserhoehung   | HowTo       | C        | P2        |
| /use-cases/datenschutz      | HowTo       | C        | P2        |
| /use-cases/finanzen         | HowTo       | C        | P2        |
| / (Landing NEXUS Update)    | WebSite     | C-Final  | P0        |
| Navigation.tsx (Mega-Menü)  | —           | C-Final  | P0        |

---

## 8 · VERIFIKATIONS-CHECKLISTE (je Cluster, vor Freigabe)
□ npm run build → 0 Errors, 0 Warnings
□ Alle internen Links erreichbar (Link-Parity)
□ generateMetadata() auf jeder Route vorhanden
□ JsonLd Script-Tag im <head> (nicht im <body>)
□ EU AI Act Disclaimer auf allen Demo-Sektionen sichtbar
□ Gemma 4 Modell-Bezeichnung konsistent
□ Stripe Price IDs als Env-Var-Konstanten (keine Hardcodes)
□ Sovereign Design Tokens in Verwendung (kein #ffffff Hintergrund)
□ Mobile-Check: 375px — kein horizontales Scrollen, Touch-Targets ≥44px
□ Dark-Only verifiziert — kein Light-Mode-Toggle vorhanden

---

*SOVEREIGN-NEXUS-SEED.md · 2026-04-04 · Masterplan v4.1*
*Single Source of Truth. Jede Abweichung im Code ist ein Bug.*
