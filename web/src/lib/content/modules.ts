// src/lib/content/modules.ts
// ═══════════════════════════════════════════════════════════════
// SOVEREIGN 2030 — Module Registry Data
// APEX → PILLAR → CLUSTER Content Architecture
// ═══════════════════════════════════════════════════════════════

export interface ModuleData {
  slug:             string;
  emoji:            string;
  layer:            string;
  layerCode:        string;
  name:             string;
  subtitle:         string;
  agentCode:        string;
  description:      string;
  outputFormat:     string;
  primaryDirectives: string[];
  useCases:         string[];
  architecture:     { label: string; value: string }[];
  faq:              { q: string; a: string }[];
  businessValue:    string;
  score:            number;
}

export const MODULES: ModuleData[] = [
  {
    slug:        "sovereign-twin",
    emoji:       "🧬",
    layer:       "CORE",
    layerCode:   "ST-01",
    name:        "Sovereign Twin",
    subtitle:    "Persistenter digitaler Zwilling — On-Device Intelligence mit Gemma 4",
    agentCode:   "ST-01",
    description: "Der Sovereign Twin ist mehr als ein KI-Assistent. Er ist eine lokale Instanz deiner digitalen Identität — persistent, adaptiv und ausschließlich auf deinem Gerät. Durch die Integration von Gemma 4 verarbeitet das System sensible Daten ohne Cloud-Verbindung. Keine Latenz, kein Tracking, absolute Souveränität über dein Wissen, deine Präferenzen und deine Entscheidungshistorie.",
    outputFormat: "Persönliche AI-Instanz / On-Device Memory / Encrypted Vault",
    primaryDirectives: [
      "01 — Alle Reasoning-Prozesse finden ausschließlich auf dem Endgerät statt (Gemma 4 E2B/E4B)",
      "02 — Keine PII verlässt den geschützten Bereich des Geräts — auch nicht pseudonymisiert",
      "03 — Kontinuierliches Lernen aus Interaktionen ohne Cloud-Synchronisation",
    ],
    useCases: ["Persönlicher Kontext & Präferenzen", "Offline-First Verarbeitung", "Adaptive Entscheidungsunterstützung"],
    architecture: [
      { label: "AI Engine",      value: "Gemma 4 · On-Device (E2B/E4B)" },
      { label: "Data Residency", value: "Gerät lokal · Kein Cloud-Upload" },
      { label: "Sync Protocol",  value: "E2EE · Local-First (ADR-009)" },
      { label: "Auth Layer",     value: "Zero-Trust v2.0" },
    ],
    faq: [
      { q: "Wo werden meine Daten gespeichert?", a: "Ausschließlich auf deinem Endgerät. Gemma 4 läuft lokal — kein Byte verlässt das Gerät ohne deine explizite Freigabe." },
      { q: "Was passiert bei Gerätewechsel?", a: "Dein verschlüsselter Vault kann via E2EE-Mesh auf ein neues Gerät migriert werden. Schlüssel bleiben bei dir." },
      { q: "Welche Datentypen verarbeitet der Twin?", a: "Präferenzen, Entscheidungshistorie, Kommunikationsstil, persönliche Dokumente — alles, was du einbringst." },
    ],
    businessValue: "Vollständige Datensouveränität bei gleichzeitiger KI-Nutzung — kein Trade-off mehr zwischen Intelligenz und Privatsphäre.",
    score: 100,
  },
  {
    slug:        "privacy-guardian",
    emoji:       "🛡️",
    layer:       "GOVERNANCE",
    layerCode:   "PG-01",
    name:        "Privacy Guardian",
    subtitle:    "Echtzeit-PII-Erkennung und automatische Datenschutz-Durchsetzung",
    agentCode:   "PG-01",
    description: "Der Privacy Guardian überwacht jede Interaktion in Echtzeit und verhindert automatisch, dass personenbezogene Daten (PII) den geschützten Bereich deines Systems verlassen. DSGVO-Rechte (Art. 15, 17, 20) werden als technische Endpunkte implementiert — nicht als Formulare, sondern als direkte API-Calls mit sofortiger Wirkung.",
    outputFormat: "PII-Scan-Report / DSGVO-Compliance-Zertifikat / Data-Access-Log",
    primaryDirectives: [
      "01 — Automatische PII-Erkennung in allen eingehenden und ausgehenden Datenströmen",
      "02 — Sofortige Blockierung bei Verstößen gegen die konfigurierten Datenschutzregeln",
      "03 — Lückenloses Audit-Log aller Datenzugriffe mit kryptographischer Signatur",
    ],
    useCases: ["DSGVO-Auskunft (Art. 15)", "Löschungsanfragen (Art. 17)", "Datenportabilität (Art. 20)"],
    architecture: [
      { label: "AI Engine",      value: "Gemma 4 · On-Device" },
      { label: "Data Residency", value: "EU-Region (europe-west4)" },
      { label: "Scan Protocol",  value: "Real-time PII Detection" },
      { label: "Auth Layer",     value: "Zero-Trust v2.0" },
    ],
    faq: [
      { q: "Was gilt als PII?", a: "Namen, E-Mail-Adressen, Telefonnummern, IP-Adressen, Standortdaten, Gesundheitsdaten und alle anderen Informationen, die eine Person direkt oder indirekt identifizieren können." },
      { q: "Wie schnell reagiert der Guardian?", a: "Echtzeit — typische Reaktionszeit unter 50ms. Alle Aktionen werden im Audit Trail mit Timestamp erfasst." },
      { q: "Kann ich Regeln anpassen?", a: "Ja. Über das Einstellungsmenü kannst du Datenschutz-Profile erstellen und spezifische PII-Klassen konfigurieren." },
    ],
    businessValue: "DSGVO-Compliance wird von einer rechtlichen Pflicht zu einem technischen Wettbewerbsvorteil — nachweisbar, automatisiert, vertrauensbildend.",
    score: 98,
  },
  {
    slug:        "execution-center",
    emoji:       "⚡",
    layer:       "CORE",
    layerCode:   "EC-01",
    name:        "Execution Center",
    subtitle:    "Autonome Aufgabenausführung in isolierter E2B-Sandbox",
    agentCode:   "EC-01",
    description: "Das Execution Center ist die operative Kommandozentrale von SOVEREIGN. Alle Agent-Tasks werden in einer isolierten E2B-Sandbox ausgeführt — vollständig air-gapped von deinen persönlichen Daten. Das System orchestriert parallele Workflows, verwaltet Abhängigkeiten und liefert nachvollziehbare Ergebnisse mit vollständigem Execution-Trail.",
    outputFormat: "Task-Ergebnis / Execution-Report / Sandbox-Log",
    primaryDirectives: [
      "01 — Jede Task-Ausführung in isolierter E2B-Sandbox (ADR-009 konform)",
      "02 — Human-in-the-Loop für alle Aktionen mit externen Auswirkungen (EU AI Act Art.14)",
      "03 — Parallele Workflow-Orchestrierung mit Dependency-Resolution",
    ],
    useCases: ["Vertrag kündigen automatisch", "Preiserhöhung widersprechen", "DSGVO-Anfragen versenden"],
    architecture: [
      { label: "AI Engine",       value: "Gemini 2.5 Flash · EU-Cloud" },
      { label: "Sandbox",         value: "E2B Isolated Runtime" },
      { label: "Data Residency",  value: "EU-Region (europe-west4)" },
      { label: "Auth Layer",      value: "Zero-Trust v2.0" },
    ],
    faq: [
      { q: "Was ist eine E2B-Sandbox?", a: "Eine vollständig isolierte Laufzeitumgebung, in der Agent-Tasks ausgeführt werden, ohne Zugriff auf andere Systemkomponenten oder externe Netzwerke zu haben." },
      { q: "Wer genehmigt Aktionen?", a: "Du. Alle Aktionen mit externen Auswirkungen (E-Mails senden, Formulare ausfüllen) erfordern deine explizite Bestätigung — Human-in-the-Loop ist nicht optional." },
      { q: "Wie werden Fehler behandelt?", a: "Das System nutzt automatisches Rollback und Retry-Logic. Alle Fehler werden im Audit Trail dokumentiert." },
    ],
    businessValue: "Autonome Aufgabenausführung mit voller Nachvollziehbarkeit — du behältst die Kontrolle, das System erledigt die Arbeit.",
    score: 97,
  },
  {
    slug:        "audit-trail",
    emoji:       "🔍",
    layer:       "GOVERNANCE",
    layerCode:   "AT-01",
    name:        "Audit Trail",
    subtitle:    "Kryptographisch signierte Transparenz für jede KI-Entscheidung",
    agentCode:   "AT-01",
    description: "Der Audit Trail macht SOVEREIGN zu einem nicht-vertrauensbasierten System. Jede KI-Entscheidung, jeder Datenzugriff und jede Agent-Aktion wird kryptographisch signiert und in einem unveränderlichen Log erfasst. Dies entspricht den Anforderungen des EU AI Act Art. 13 (Transparenz) und bildet die Grundlage für das Senate Gate-Verfahren.",
    outputFormat: "Immutable Audit Log / Compliance-Report / Cryptographic Proof",
    primaryDirectives: [
      "01 — Lückenlose Erfassung aller KI-Entscheidungen mit Reasoning-Trace",
      "02 — Kryptographische Signierung jedes Log-Eintrags (Ed25519)",
      "03 — Unveränderliches Storage in Firestore EU-Region — auch Admin-Zugriff protokolliert",
    ],
    useCases: ["EU AI Act Compliance", "Interne Revision", "Rechtliche Nachweispflichten"],
    architecture: [
      { label: "AI Engine",      value: "Gemini 2.5 Flash · Sanitized" },
      { label: "Data Residency", value: "EU-Region Firestore (europe-west4)" },
      { label: "Signing",        value: "Ed25519 · Immutable Log" },
      { label: "Auth Layer",     value: "Zero-Trust v2.0" },
    ],
    faq: [
      { q: "Kann der Audit Trail manipuliert werden?", a: "Nein. Jeder Eintrag wird vor dem Schreiben signiert. Nachträgliche Änderungen erzeugen eine Signaturinvalidierung, die sofort erkannt wird." },
      { q: "Wie lange werden Logs aufbewahrt?", a: "Gemäß DSGVO mindestens 3 Jahre, konfigurierbar bis zu 10 Jahren. Export als JSON oder PDF jederzeit möglich." },
      { q: "Wer kann den Audit Trail einsehen?", a: "Ausschließlich du — und die Behörden, die du explizit authorisierst. Kein SOVEREIGN-Mitarbeiter hat Zugriff auf deine Logs." },
    ],
    businessValue: "Vertrauen durch Nachweisbarkeit — nicht durch Versprechen. Der Audit Trail ist der Unterschied zwischen Compliance-Behauptung und Compliance-Beweis.",
    score: 100,
  },
  {
    slug:        "sicherheit",
    emoji:       "🔒",
    layer:       "GOVERNANCE",
    layerCode:   "SK-01",
    name:        "Security Senate",
    subtitle:    "EU AI Act & DSGVO 2026: Zero-Trust-Architektur durch Design",
    agentCode:   "SK-01",
    description: "Das Security Senate ist das Compliance-Fundament von SOVEREIGN. Es implementiert die Anforderungen des EU AI Act (Risikoklassifizierung, Transparenzpflichten) und der DSGVO als technische Architektur — nicht als nachträgliche Checkliste. Das Senate Gate-Verfahren signiert und verifiziert jeden Output vor der Auslieferung.",
    outputFormat: "Compliance-Zertifikat / Risk-Assessment / Senate-Gate-Report",
    primaryDirectives: [
      "01 — Automatische Risikoklassifizierung aller KI-Outputs nach EU AI Act Annex III",
      "02 — Senate Gate: Kryptographische Verifikation vor jedem Output (Score 0-100)",
      "03 — DSGVO-Rechte als API-Endpunkte: Art.15 (Auskunft), Art.17 (Löschung), Art.20 (Portabilität)",
    ],
    useCases: ["EU AI Act Compliance-Nachweis", "DSGVO-Audit", "Zero-Trust-Implementierung"],
    architecture: [
      { label: "AI Engine",      value: "Gemini 2.5 Flash · Sanitized" },
      { label: "Data Residency", value: "EU-Region (europe-west4)" },
      { label: "Sync Protocol",  value: "E2EE · Zero-Knowledge" },
      { label: "Auth Layer",     value: "Zero-Trust v2.0" },
    ],
    faq: [
      { q: "Was ist das Senate Gate?", a: "Ein automatisiertes Verfahren, das jeden KI-Output auf EU AI Act- und DSGVO-Konformität prüft, bewertet (0-100) und kryptographisch signiert." },
      { q: "Welche Risikoklasse ist SOVEREIGN?", a: "SOVEREIGN fällt unter 'Limited Risk' (Art. 50 EU AI Act) — mit vollständiger Transparenzimplementierung, die weit über die gesetzlichen Mindestanforderungen hinausgeht." },
      { q: "Ist SOVEREIGN für den EU AI Act 2026 ready?", a: "Ja. Das System wurde ab der Entwicklung auf Full Enforcement 2026 ausgerichtet. Alle Anforderungen sind als technische Architektur implementiert." },
    ],
    businessValue: "EU AI Act Compliance ist kein Kostenfaktor, sondern ein Differenzierungsmerkmal — SOVEREIGN macht es zum Wettbewerbsvorteil.",
    score: 100,
  },
  {
    slug:        "souveraenitaet",
    emoji:       "🏛️",
    layer:       "CORE",
    layerCode:   "SV-01",
    name:        "Datensouveränität",
    subtitle:    "Vollständige Kontrolle über deine digitale Identität und deine Daten",
    agentCode:   "SV-01",
    description: "Datensouveränität ist kein Feature — es ist das Fundament von SOVEREIGN. Das Modul implementiert alle technischen Voraussetzungen, damit du die alleinige Kontrolle über deine digitale Identität, deine Daten und deren Verwendung behältst. Data Portability, Selective Disclosure und Zero-Knowledge-Proofs sind keine Extras, sondern Standard.",
    outputFormat: "Sovereignty-Report / Data-Map / Control-Dashboard",
    primaryDirectives: [
      "01 — Du bist der einzige Dateneigentümer — kein Platform-Lock-in, keine Datenverkauf",
      "02 — Selective Disclosure: Teile nur, was du explizit freigibst — granular auf Attribut-Ebene",
      "03 — Data Portability: Export deiner gesamten digitalen Identität als standardisiertes Paket jederzeit",
    ],
    useCases: ["Digitale Identität verwalten", "Daten-Export & Migration", "Selective Disclosure gegenüber Dritten"],
    architecture: [
      { label: "AI Engine",      value: "Gemma 4 · On-Device" },
      { label: "Data Residency", value: "Gerät lokal · Optional EU-Cloud" },
      { label: "Identity Layer", value: "Self-Sovereign Identity (SSI)" },
      { label: "Auth Layer",     value: "Zero-Trust v2.0" },
    ],
    faq: [
      { q: "Was bedeutet 'Datensouveränität' konkret?", a: "Du entscheidest, welche Daten wo gespeichert werden, wer sie lesen darf und wann sie gelöscht werden. Das System erzwingt diese Entscheidungen technisch." },
      { q: "Kann ich meine Daten komplett exportieren?", a: "Ja. Ein vollständiger Export deiner digitalen Identität als verschlüsseltes, portables Paket ist jederzeit in unter 30 Sekunden möglich." },
      { q: "Was passiert wenn ich SOVEREIGN verlasse?", a: "Du nimmst alles mit. Kein Daten-Hostage, keine Vendor-Lock-in. Vollständiger Export + Löschbestätigung mit kryptographischem Nachweis." },
    ],
    businessValue: "Datenhoheit als Grundrecht — technisch garantiert, nicht nur versprochen.",
    score: 99,
  },
  {
    slug:        "finanzautonomie",
    emoji:       "💎",
    layer:       "INTELLIGENCE",
    layerCode:   "FA-01",
    name:        "Finanzautonomie",
    subtitle:    "KI-gestützte Finanzkontrolle: Preiserhöhungen, Abofallen, Wealth Management",
    agentCode:   "FA-01",
    description: "Das Finanzautonomie-Modul gibt dir die Kontrolle über deine finanzielle Situation zurück. Von der automatischen Erkennung ungerechtfertigter Preiserhöhungen über die Verwaltung deiner Abonnements bis hin zu strategischem Wealth Management — alles in einem System, das ausschließlich in deinem Interesse arbeitet.",
    outputFormat: "Finanz-Report / Widerspruchs-Dokument / Wealth-Dashboard",
    primaryDirectives: [
      "01 — Automatische Erkennung von Preiserhöhungen und Vertragsverstößen in Echtzeit",
      "02 — Generierung rechtssicherer Widerspruchsschreiben (BGB §§ 315, 241, 242)",
      "03 — Proaktives Wealth-Monitoring: Chancen und Risiken in deinem Portfolio",
    ],
    useCases: ["Preiserhöhung widersprechen", "Abofallen erkennen & kündigen", "Investment-Monitoring"],
    architecture: [
      { label: "AI Engine",      value: "Gemini 2.5 Flash · EU-Cloud" },
      { label: "Data Residency", value: "EU-Region (europe-west4)" },
      { label: "Legal Layer",    value: "BGB 2026 · EU-Verbraucherrecht" },
      { label: "Auth Layer",     value: "Zero-Trust v2.0" },
    ],
    faq: [
      { q: "Wie erkennt das System Preiserhöhungen?", a: "Durch automatisches Monitoring deiner Verträge und Kontoauszüge. Abweichungen vom vereinbarten Preis werden sofort erkannt und analysiert." },
      { q: "Sind die generierten Dokumente rechtssicher?", a: "Alle Dokumente basieren auf aktuellem deutschen und EU-Recht (BGB 2026, EU-Verbraucherrecht). Sie werden von Juristen regelmäßig geprüft." },
      { q: "Welche Finanzprodukte werden überwacht?", a: "Bankkonten, Kreditkarten, Investments, Abonnements, Versicherungen — alle Konten, die du im System verbindest." },
    ],
    businessValue: "Finanzielle Souveränität durch Information — du weißt immer mehr als die Anbieter über deine eigenen Finanzen.",
    score: 96,
  },
  {
    slug:        "ki-recht",
    emoji:       "⚖️",
    layer:       "INTELLIGENCE",
    layerCode:   "KR-01",
    name:        "KI & Recht",
    subtitle:    "Rechtliche KI-Nutzung: Vertragsrecht, DSGVO, EU AI Act in der Praxis",
    agentCode:   "KR-01",
    description: "Das KI & Recht Modul macht komplexe Rechtsfragen für jeden verständlich und handlungsfähig. Von der rechtssicheren Kündigung von Verträgen über DSGVO-Auskunftsanfragen bis zur praktischen Anwendung des EU AI Act — das System generiert juridisch präzise Dokumente und erklärt die rechtliche Lage in verständlicher Sprache.",
    outputFormat: "Rechts-Dokument / Juristische Analyse / Handlungsempfehlung",
    primaryDirectives: [
      "01 — Generierung rechtssicherer Dokumente nach aktuellem deutschen und EU-Recht",
      "02 — Klare Erklärung der Rechtslage ohne Juristenjargon",
      "03 — Proaktive Hinweise auf Fristen und Handlungspflichten",
    ],
    useCases: ["Vertragsrecht & Kündigung", "DSGVO-Anfragen stellen", "EU AI Act Rechte wahrnehmen"],
    architecture: [
      { label: "AI Engine",      value: "Gemini 2.5 Flash · EU-Cloud" },
      { label: "Data Residency", value: "EU-Region (europe-west4)" },
      { label: "Legal Layer",    value: "BGB, DSGVO, EU AI Act 2026" },
      { label: "Auth Layer",     value: "Zero-Trust v2.0" },
    ],
    faq: [
      { q: "Ersetzt SOVEREIGN einen Anwalt?", a: "Nein. SOVEREIGN ist ein Informations- und Unterstützungssystem. Für komplexe Rechtsfälle ist anwaltliche Beratung unersetzlich. Das System kennzeichnet solche Fälle proaktiv." },
      { q: "Wie aktuell ist die Rechtsdatenbank?", a: "Die Rechtsdatenbank wird monatlich aktualisiert. Änderungen durch aktuelle Urteile oder Gesetzgebung werden innerhalb von 7 Werktagen integriert." },
      { q: "In welchen Ländern ist das System nutzbar?", a: "Primär für Deutschland und die EU. Das System kennt länderspezifische Besonderheiten für alle 27 EU-Mitgliedsstaaten." },
    ],
    businessValue: "Rechtsanwalt-Niveau-Wissen für jeden — demokratisiert, automatisiert, in deiner Sprache.",
    score: 95,
  },
];

export const MODULE_LAYERS = [
  { code: "ALL",          label: "All Modules" },
  { code: "CORE",         label: "Core" },
  { code: "INTELLIGENCE", label: "Intelligence" },
  { code: "GOVERNANCE",   label: "Governance" },
];
