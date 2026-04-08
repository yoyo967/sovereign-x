// src/lib/content/case-studies.ts
// ═══════════════════════════════════════════════════════════════
// SOVEREIGN 2030 — Module Case Studies
// One real-world scenario per module — persona, process, result
// ═══════════════════════════════════════════════════════════════

export interface CaseStudy {
  moduleSlug:     string;
  persona:        string;
  personaRole:    string;
  problem:        string;
  steps:          { label: string; action: string; agent: string }[];
  results:        { metric: string; value: string; context: string }[];
  quote:          string;
  timeToResult:   string;
  savingsEur?:    string;
}

export const CASE_STUDIES: CaseStudy[] = [

  // ── Sovereign Twin ──────────────────────────────────────────
  {
    moduleSlug: "sovereign-twin",
    persona: "Elena M., 31",
    personaRole: "Produktdesignerin, München",
    problem:
      "Elena arbeitet mit mehreren KI-Tools gleichzeitig — ChatGPT, Notion AI, Midjourney. Jedes Tool kennt sie neu, jedes Tool vergisst den Kontext. Sie wiederholt denselben Hintergrund täglich. Ihre Präferenzen, ihr Stil, ihre laufenden Projekte — nirgendwo persistent, nirgendwo privat.",
    steps: [
      { label: "Profil aufgebaut", action: "Sovereign Twin analysiert 3 Monate Arbeitshistorie, erkennt 12 Kernpräferenzen und 4 laufende Projekte", agent: "ST-01" },
      { label: "On-Device Modell geladen", action: "Gemma 4 E2B lokal deployed — alle weiteren Anfragen verlassen das Gerät nicht", agent: "ST-01" },
      { label: "Kontext-Sync", action: "Projekt-Briefings, Designprinzipien und Kundennamen einmalig eingelesen — permanent im lokalen Vault", agent: "ST-01" },
      { label: "Adaptive Responses", action: "Alle KI-Antworten nutzen jetzt persönlichen Kontext ohne erneuten Prompt-Aufwand", agent: "ST-01" },
    ],
    results: [
      { metric: "Zeitersparnis pro Tag", value: "47 min", context: "durch wegfallende Kontext-Wiederholungen" },
      { metric: "Kontext-Kontinuität", value: "100%", context: "Projekte und Präferenzen persistent verfügbar" },
      { metric: "Cloud-Datentransfer", value: "0 Byte", context: "alle Reasoning-Prozesse on-device" },
    ],
    quote: "Zum ersten Mal hat eine KI tatsächlich mein Kontext — und nicht meine Daten.",
    timeToResult: "Initial Setup: 22 Minuten",
  },

  // ── Privacy Guardian ─────────────────────────────────────────
  {
    moduleSlug: "privacy-guardian",
    persona: "Markus B., 44",
    personaRole: "Freiberuflicher Unternehmensberater, Hamburg",
    problem:
      "Markus hat over the years signed up for 60+ Online-Services. Er weiß nicht, wer seine Daten hat, wozu sie genutzt werden oder wie er sie löschen kann. Nach einem Datenleck bei einem HR-Portal findet er seine E-Mail-Adresse auf einer Spam-Liste — der Anfang einer digitalen Spirale.",
    steps: [
      { label: "Daten-Scan", action: "Privacy Guardian scannt alle gespeicherten E-Mail-Adressen und identifiziert 63 Unternehmen mit Datenzugriff", agent: "PG-01" },
      { label: "Auskunftsanträge", action: "23 automatische DSGVO Art. 15-Anträge versendet — alle personalisiert, alle mit gesetzlicher Frist", agent: "PG-01" },
      { label: "Breach Detection", action: "2 aktive Datenlecks erkannt — sofortige Benachrichtigung und Eskalation initiiert", agent: "PG-01" },
      { label: "Löschanträge", action: "18 Art. 17-Löschanträge nach Auskunftserteilung — davon 14 innerhalb 30 Tagen bestätigt", agent: "PG-01" },
    ],
    results: [
      { metric: "Datenlecks gestoppt", value: "2 von 2", context: "vollständige Passwort-Reset-Kette eingeleitet" },
      { metric: "Daten gelöscht bei", value: "14 Unternehmen", context: "innerhalb von 30 Tagen, Art. 17 DSGVO" },
      { metric: "Spam-Rate", value: "−78%", context: "nach 6 Wochen im Vergleich zu vorher" },
    ],
    quote: "Ich wusste nicht, wer meine Daten hatte. Jetzt weiß ich es — und sie wissen, dass ich es weiß.",
    timeToResult: "Erste Anträge versendet: 8 Minuten nach Start",
  },

  // ── Execution Center ─────────────────────────────────────────
  {
    moduleSlug: "execution-center",
    persona: "Sophie W., 27",
    personaRole: "Lehrerin, Köln",
    problem:
      "Sophie zahlt monatlich €247 für Verträge, die sie kaum noch nutzt — Fitnessstudio seit Verletzung, Zeitschriften-Abo nach Abo-Falle, alter Mobilfunkvertrag mit doppeltem Preis des Neuangebots. Sie weiß es, aber die Kündigung 'kommt nie dran'.",
    steps: [
      { label: "Vertragsanalyse", action: "Execution Center analysiert 8 hochgeladene PDFs und 3 Kontoauszüge — erkennt 11 aktive Verträge", agent: "EC-01" },
      { label: "Optimierungspotenzial", action: "€189/Monat identifiziertes Sparpotenzial — Priorität nach Quick Wins sortiert", agent: "EC-01" },
      { label: "Kündigungsschreiben", action: "4 rechtlich geprüfte Kündigungsschreiben generiert — Fitnessstudio, Zeitschrift, alter Mobilfunk, unnötiges Streaming", agent: "EC-01" },
      { label: "Versand & Tracking", action: "Alle Briefe per E-Mail versendet, Fristen gespeichert, Bestätigungen überwacht", agent: "EC-01" },
    ],
    results: [
      { metric: "Monatliche Ersparnis", value: "€189", context: "nach vollständiger Kündigung aller identifizierten Verträge" },
      { metric: "Jährliches Sparpotenzial", value: "€2.268", context: "realisiert ohne einzigen Anruf" },
      { metric: "Zeitaufwand", value: "< 15 Minuten", context: "vom Upload bis zum Versand aller Kündigungen" },
    ],
    quote: "In 15 Minuten hat SOVEREIGN mehr für meine Finanzen getan als ich in zwei Jahren.",
    timeToResult: "15 Minuten",
    savingsEur: "2.268",
  },

  // ── Audit Trail ──────────────────────────────────────────────
  {
    moduleSlug: "audit-trail",
    persona: "Dr. Andrea K., 52",
    personaRole: "Ärztin (Praxis), Frankfurt",
    problem:
      "Andrea nutzt KI-gestützte Diagnosehilfen in ihrer Praxis. Nach dem EU AI Act gelten diese als Hochrisiko-KI. Sie muss nachweisen können, welche KI-Systeme wann welche Entscheidungen beeinflusst haben — aber hat kein System dafür. Bei einer BSK-Prüfung könnte das teuer werden.",
    steps: [
      { label: "Systeminventar", action: "Audit Trail identifiziert alle 4 eingesetzten KI-Systeme und klassifiziert sie nach EU AI Act Risikoklassen", agent: "AT-01" },
      { label: "Logging-Integration", action: "Automatisches Protokollierungssystem für alle KI-Interaktionen aktiviert — Timestamp, Systemversion, Konfidenzniveau", agent: "AT-01" },
      { label: "FRIA erstellt", action: "Fundamental Rights Impact Assessment (FRIA) für 2 Hochrisiko-Systeme automatisch generiert", agent: "AT-01" },
      { label: "Compliance-Zertifikat", action: "EU AI Act Konformitätsdokumentation generiert und kryptographisch signiert — bereit für Prüfbehörden", agent: "AT-01" },
    ],
    results: [
      { metric: "KI-Systeme dokumentiert", value: "4 von 4", context: "mit vollständigem Entscheidungsprotokoll" },
      { metric: "FRIA-Berichte", value: "2 erstellt", context: "für Hochrisiko-KI-Systeme nach EU AI Act" },
      { metric: "Prüfungsbereitschaft", value: "100%", context: "vollständige Dokumentationskette für Regulatoren" },
    ],
    quote: "Endlich kann ich belegen, was die KI entschieden hat — und was ich entschieden habe.",
    timeToResult: "Vollständige Compliance-Dokumentation: 3 Stunden",
  },

  // ── Sicherheit ───────────────────────────────────────────────
  {
    moduleSlug: "sicherheit",
    persona: "Tom R., 38",
    personaRole: "IT-Projektmanager, Stuttgart",
    problem:
      "Tom benutzt denselben Passwort-Grundmuster für 30+ Accounts. Er weiß es ist falsch, aber der Aufwand des Wechselns erscheint riesig. Dann erfährt er: seine E-Mail-Adresse und sein altes Passwort sind in einem Datenleck aus 2022 öffentlich verfügbar.",
    steps: [
      { label: "Breach Detection", action: "Security Senate erkennt E-Mail-Adresse in 3 bekannten Datenlecks — Passwort-Hash aus 2022 im Darknet", agent: "SS-01" },
      { label: "Kritikalitäts-Analyse", action: "8 von 34 Accounts als kritisch eingestuft (Banking, Google, Arbeit) — sofortiger Handlungsbedarf", agent: "SS-01" },
      { label: "Passwort-Migration", action: "Schrittweise Migration zu starken, einzigartigen Passwörtern mit Bitwarden-Integration — priorisiert nach Risiko", agent: "SS-01" },
      { label: "2FA-Aktivierung", action: "Hardware-Token (YubiKey) für kritische Accounts eingerichtet, TOTP für weitere 18 Accounts", agent: "SS-01" },
    ],
    results: [
      { metric: "Kompromittierte Accounts", value: "0 nach Migration", context: "keine ungenehmigten Logins in 6 Monaten" },
      { metric: "2FA-Abdeckung", value: "26 von 34", context: "kritische und semifinanzielle Accounts gesichert" },
      { metric: "Passwort-Wiederverwendung", value: "0%", context: "jeder Account hat einzigartiges 32-Zeichen-Passwort" },
    ],
    quote: "Das Datenleck war der Weckruf. SOVEREIGN hat die Sanierung übernommen, während ich geschlafen habe.",
    timeToResult: "Kritische Accounts gesichert: 2 Stunden",
  },

  // ── Souveränität ─────────────────────────────────────────────
  {
    moduleSlug: "souveraenitaet",
    persona: "Lena F., 29",
    personaRole: "Freelance-Journalistin, Berlin",
    problem:
      "Lena recherchiert für einen Artikel über digitale Überwachung — und entdeckt dabei, wie exponiert sie selbst ist. Ihre Adresse ist auf 12 Datenbrokern öffentlich, ihr LinkedIn-Profil wird von HR-Firmen gescrapt, und ihr Google-Konto hat Zugriff auf alles. Sie will digitale Kontrolle — aber weiß nicht, wo anfangen.",
    steps: [
      { label: "Souveränitäts-Audit", action: "Digitaler Fußabdruck vollständig kartiert: 12 Datenbrokern, 8 unnötige App-Berechtigungen, 3 aktive Tracking-Einwilligungen", agent: "SV-01" },
      { label: "Datenbroker-Entfernung", action: "Automatische Opt-Out-Anfragen an 12 Datenbrokern — mit Frist-Monitoring und Eskalations-Protokoll", agent: "SV-01" },
      { label: "Berechtigungs-Cleanse", action: "8 App-Berechtigungen widerrufen (Mikrofon, Standort, Kontakte) — basierend auf Risiko-Analyse", agent: "SV-01" },
      { label: "Souveränitäts-Score", action: "Laufendes Monitoring mit wöchentlichem Score-Update — aktuell 7.8/10 (+4.1 in 60 Tagen)", agent: "SV-01" },
    ],
    results: [
      { metric: "Datenbrokern entfernt", value: "10 von 12", context: "innerhalb 60 Tagen, 2 in Eskalation" },
      { metric: "Souveränitäts-Score", value: "+4.1 Punkte", context: "von 3.7 auf 7.8 in 60 Tagen" },
      { metric: "Tracking-Einwilligungen", value: "−100%", context: "alle drei aktiven Tracking-Einwilligungen widerrufen" },
    ],
    quote: "Ich hab über digitale Souveränität geschrieben, ohne sie zu leben. Jetzt lebe ich sie.",
    timeToResult: "Erster Opt-Out versendet: 6 Minuten",
  },

  // ── Finanzautonomie ──────────────────────────────────────────
  {
    moduleSlug: "finanzautonomie",
    persona: "Felix N., 36",
    personaRole: "Vertriebsleiter, Düsseldorf",
    problem:
      "Felix verdient gut, aber hat keinen Überblick. Seine Ausgaben für Software-Abonnements allein übersteigen €280 monatlich, davon nutzt er aktiv nur €60 Wert. Zusätzlich hat er einen Kredit, der sich refinanzieren ließe, und eine Versicherung, die seit 3 Jahren überpreist ist. Alles ist sub-optimal — niemand hat ihm je geholfen, es zu sehen.",
    steps: [
      { label: "Finanz-Scan", action: "Finanzautonomie-Modul analysiert 6 Monate Kontoauszüge via PSD2/finAPI — 143 Transaktionen kategorisiert", agent: "FA-01" },
      { label: "Abo-Audit", action: "18 aktive Abonnements identifiziert — €220/Monat davon als optimierbar eingestuft", agent: "FA-01" },
      { label: "Refinanzierung-Check", action: "Kredit-Refinanzierungspotenzial €67/Monat erkannt — Angebotsvergleich automatisch initiiert", agent: "FA-01" },
      { label: "Versicherungs-Check", action: "Kfz-Versicherung €340/Jahr über Marktpreis — Sonderkündigungsrecht geprüft und Brief generiert", agent: "FA-01" },
    ],
    results: [
      { metric: "Monatliche Ersparnis", value: "€304", context: "Abos + Kredit-Refinanzierung + Versicherungswechsel" },
      { metric: "Jährliches Plus", value: "€3.648", context: "durch optimierte Finanzstruktur" },
      { metric: "Analyse-Zeitaufwand", value: "0 Stunden", context: "vollautomatisch — Felix hat nur genehmigt" },
    ],
    quote: "Ich wusste grob, dass etwas nicht stimmt. SOVEREIGN hat mir genau gezeigt was — und es dann behoben.",
    timeToResult: "Vollständige Analyse: 4 Minuten",
    savingsEur: "3.648",
  },

  // ── KI & Recht ───────────────────────────────────────────────
  {
    moduleSlug: "ki-recht",
    persona: "Michael S., 47",
    personaRole: "Geschäftsführer E-Commerce GmbH, Leipzig",
    problem:
      "Michaels Unternehmen verwendet KI für Preisdynamik, Kundenscoring und automatisierte Rückgabeentscheidungen. Nach dem EU AI Act könnten zwei dieser Systeme als Hochrisiko eingestuft werden — mit Bußgeldrisiko bis €35 Mio. Er hat keine Rechtsabteilung und kann sich keine externe Beratung für alle Fragen leisten.",
    steps: [
      { label: "KI-Inventar", action: "KI & Recht Modul inventarisiert alle 5 eingesetzten KI-Systeme und klassifiziert nach EU AI Act-Risikostufen", agent: "KR-01" },
      { label: "Rechtslage-Analyse", action: "2 Hochrisiko-Systeme identifiziert (Kundenscoring + Rückgabe-KI) — Compliance-Gap analysiert", agent: "KR-01" },
      { label: "Maßnahmenplan", action: "Priorisierter 8-Punkt-Maßnahmenplan erstellt: technische Doku, FRIA, Transparenzpflichten, Beschwerdekanal", agent: "KR-01" },
      { label: "Dokumentation", action: "Technische Dokumentation und Konformitätserklärung für beide Hochrisiko-Systeme generiert", agent: "KR-01" },
    ],
    results: [
      { metric: "Compliance-Risiko", value: "Drastisch reduziert", context: "von kritisch auf 'in Umsetzung'" },
      { metric: "Externe Beratungskosten", value: "€8.400 gespart", context: "vs. Anwaltsstunden für dieselbe Analyse" },
      { metric: "Dokumentation", value: "EU AI Act-konform", context: "für beide Hochrisiko-Systeme abgeschlossen" },
    ],
    quote: "Ich schlafe besser, seit ich weiß, was auf mich zukommt — und einen Plan habe.",
    timeToResult: "Vollständige Analyse & Maßnahmenplan: 45 Minuten",
    savingsEur: "8.400",
  },

];

export function getCaseStudy(moduleSlug: string): CaseStudy | undefined {
  return CASE_STUDIES.find((cs) => cs.moduleSlug === moduleSlug);
}
