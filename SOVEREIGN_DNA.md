# SOVEREIGN 2030 — Ultimate Developer Handbook

> **Autonomous Life-OS Platform** | Standard: Google Executive Excellence | Build: 2030.AI
> **Version:** 3.0.0 | **Datum:** 2026-03-30 | **Repo:** `yoyo967/SOVEREIGN-Android`
> **Plattform:** Mobile App (Android) + Web App + Landing Page + Unified Backend (GCP)
> **Status:** Living Document — Single Source of Truth

---

## INHALTSVERZEICHNIS

| Teil | Kapitel | Titel |
|------|---------|-------|
| | | **KERN (bestehend, erweitert)** |
| **I** | 0 | [Ethik, Mission & Kernprinzipien](#kapitel-0--ethik-mission--kernprinzipien) |
| **I** | 1 | [Produkt-Vision & Marktpositionierung](#kapitel-1--produkt-vision--marktpositionierung) |
| **II** | 2 | [System-Architektur](#kapitel-2--system-architektur) |
| **III** | 3 | [Kritische Bugs & Sofort-Fixes](#kapitel-3--kritische-bugs--sofort-fixes) |
| **IV** | 4 | [Domänenmodell — Alle Entitäten](#kapitel-4--domänenmodell) |
| **IV** | 5 | [Business-Logik & UseCases](#kapitel-5--business-logik--usecases) |
| **V** | 6 | [Intelligenz-Schicht — Gemini & Engines](#kapitel-6--intelligenz-schicht) |
| **VI** | 7 | [UX/UI — Sovereign Design System](#kapitel-7--sovereign-design-system) |
| **VII** | 8 | [Feature-Module — Atomar (mit Tier-Matrix)](#kapitel-8--feature-module) |
| **VIII** | 9 | [Unified Backend & Datenpersistenz](#kapitel-9--backend--datenpersistenz) |
| **IX** | 10 | [Security & Compliance](#kapitel-10--security--compliance) |
| **X** | 11 | [Testing & Qualität](#kapitel-11--testing--qualität) |
| **X** | 12 | [CI/CD & DevOps](#kapitel-12--cicd--devops) |
| **XI** | 13 | [Roadmap & Sprint-Planung](#kapitel-13--roadmap) |
| | | **NEU in v3.0** |
| **XII** | 14 | [Monetarisierung & Pricing](#kapitel-14--monetarisierung--pricing) |
| **XIII** | 15 | [Plattform-Architektur — Unified GCP Backend](#kapitel-15--plattform-architektur) |
| **XIV** | 16 | [Web-App (app.sovereign.de)](#kapitel-16--web-app) |
| **XV** | 17 | [Landing Page & Marketing-Website](#kapitel-17--landing-page) |
| **XVI** | 18 | [SEO, GEO, AEO & SEA — Content-Marketing-Strategie](#kapitel-18--seo-geo-aeo-sea) |
| **XVII** | 19 | [Bank-Anbindung & Open Banking (PSD2)](#kapitel-19--bank-anbindung) |
| **XVIII** | 20 | [Multi-User & Family Vault](#kapitel-20--multi-user) |
| | | **ANHANG** |
| **XIX** | 21 | [Feature-Tier-Matrix — Vollständig](#kapitel-21--feature-tier-matrix) |
| **XIX** | 22 | [Kostenstruktur & Unit Economics](#kapitel-22--kostenstruktur) |
| **XIX** | 23 | [libs.versions.toml](#kapitel-23--dependencies) |
| **XIX** | 24 | [Glossar](#kapitel-24--glossar) |
| **XIX** | 25 | [API-Referenz](#kapitel-25--api-referenz) |
| **XIX** | 26 | [Architecture Decision Records](#kapitel-26--adrs) |
| **XIX** | 27 | [Contributor Guide & Code Standards](#kapitel-27--contributor-guide) |

---

# TEIL I — STRATEGIE & VISION

---

## Kapitel 0 — Ethik, Mission & Kernprinzipien

### 0.1 Mission: Warum „SOVEREIGN"?

Der Name SOVEREIGN ist ein ethisches Versprechen. In der heutigen digitalen Ökonomie herrscht eine fundamentale **Informations-Asymmetrie**: Konzerne, Versicherer und Vermieter operieren mit spezialisierten Algorithmen und ganzen Rechtsabteilungen. Der einzelne Bürger oder Kleingewerbetreibende steht dieser technologischen Übermacht schutzlos gegenüber.

SOVEREIGN wurde erschaffen, um dieses Gleichgewicht wiederherzustellen. Die Mission ist die **Demokratisierung von Verhandlungsmacht**. Wir geben dem Individuum dieselben technologischen Waffen an die Hand, die bisher nur Institutionen vorbehalten waren.

**Marktkategorie:** `Autonomous Life-OS` — keine Konkurrenz zu bestehenden Banking- oder Vertrags-Apps, sondern die intelligente Schicht *darüber*.

> *"We act with integrity, precision, and a relentless focus on the user's autonomy."*

### 0.2 Die drei unverhandelbaren Kernprinzipien

| # | Prinzip | Definition | Technische Konsequenz |
|---|---------|------------|----------------------|
| 1 | **Souveränität vor Convenience** | Sicherheit und Kontrolle sind nicht optional | Biometrie ist erzwungen; Human-in-the-Loop bei *allen* High-Stakes-Aktionen |
| 2 | **Atomare Konsistenz** | Brand, Code und Copy teilen dieselben Tokens | `SovereignTheme` ist die alleinige Quelle aller Design-Werte |
| 3 | **Human-in-the-Loop by Design** | Die KI bereitet vor — der Mensch entscheidet | `ApprovalRequest` ist der Pflichtpfad für jede exekutive Aktion |

### 0.3 Der North Star Metric

```
Percentage of user decisions automated or optimized for financial freedom.
```

Jede Feature-Entscheidung wird an dieser Metrik gemessen: Erhöht dieses Feature den Anteil der Entscheidungen, die SOVEREIGN für den Nutzer automatisiert oder optimiert?

### 0.4 Ethische Leitplanken

1. **Kein Makler-Modell**: SOVEREIGN verkauft keine Verträge und erhält keine Provisionen. Wir sind reiner Interessenvertreter des Nutzers.
2. **Transparenz**: Jede KI-Entscheidung wird auditierbar protokolliert (EU AI Act-konform).
3. **Datensouveränität**: Local-First-Architektur. Persönliche Daten verlassen das Gerät nur verschlüsselt und nur für die KI-Analyse.
4. **Löschbarkeit**: Ein einziger Befehl löscht alle Daten atomar — lokal und in der Cloud.

---

## Kapitel 1 — Produkt-Vision & Marktpositionierung

### 1.1 Der Paradigmenwechsel

```
GESTERN (passiver Nutzer):
  Preiserhöhung per E-Mail → Nutzer übersieht es → Kein Widerspruch → Geld verloren

SOVEREIGN (autonomer Stratege):
  Bankabbuchung anomal hoch → Finance Guardian erkennt in <60s →
  Gemini analysiert Rechtslage → Widerspruchs-Entwurf in Gmail-Drafts →
  Nutzer: ein Tap → "Senden" → Geld gespart
```

Der Nutzer trifft nur noch High-Level-Entscheidungen. Er ist der CEO seines eigenen Lebens; SOVEREIGN ist seine exekutive Speerspitze.

### 1.2 Die fünf Säulen der Produkt-Intelligenz

```text
┌────────────────────────────────────────────────────────────────────────────────────┐
│                           SOVEREIGN INTELLIGENCE STACK                             │
├───────────────────┬──────────────────┬─────────────────┬───────────────┬───────────┤
│   BRAINSTORMER    │  SOVEREIGN TWIN  │ FINANCE GUARDIAN│ CLAUSE ENGINE │ EXECUTION │
│  (Meta / Senate)  │  (Gemini Core)   │   (Sub-Agent)   │  (Sub-Agent)  │ ENGINE    │
├───────────────────┼──────────────────┼─────────────────┼───────────────┼───────────┤
│ Proactive Briefer │ Portfolio-Kontext│ Bank-Streams    │ OCR / Parse   │ Gmail API │
│ 2. Meinung / Veto │ AgentMemory      │ Preiserhöhungen │ Klausel-Extr. │ Calendar  │
│ Document Manager  │ Live Terminal    │ Anomalie-Detect │ Risk-Scoring  │ Tasks     │
│ UX / UI Hub       │ Life-Cases       │ Savings Playbook│ Benchmark     │ Approvals │
└───────────────────┴──────────────────┴─────────────────┴───────────────┴───────────┘
                    ↑  HUMAN-IN-THE-LOOP GATE  ↑
           Biometrie + ApprovalRequest bei ALLEN High-Stakes-Aktionen
```

**Brainstormer Agent (Meta-Agent / Senat):** Proaktiver Knoten, der als Bindeglied zwischen User und Plattform fungiert (auf Landingpage & App). Managt Dokumente, konfiguriert Sub-Agenten iterativ aus Gesprächen und dient als algorithmischer Senat zur Compliance-Sicherung ("2. Meinung").

**Sovereign Twin (Gemini Core):** Persistenter, kontextbewusster digitaler Zwilling mit Portfolio-Kontext, Life-Cases und BoundaryConditions. Arbeitet permanent im Hintergrund.

**Finance Guardian:** Spezialisiertes Sub-Agent-System für Banktransaktionen, Preiserhöhungen, Cashflow und Liquiditätsrisiken. Verhält sich in der UX wie ein Premium-Neobank-Brain.

**Clause Intelligence Engine:** Nicht nur Kleingedrucktes markieren, sondern Klauseln klassifizieren (Kosten, Laufzeit, Haftung, Kündigung, Sonderrechte, Risiko), jede Klausel an Portfolio-Kontext und Marktstandard spiegeln.

**Execution Engine:** Orchestriert Function Calls (Gmail, Backend-APIs, Calendar, Tasks) mit Approval-Stufen und Biometrie.

### 1.3 Zielgruppen

**A. Sovereign Individual (Privatnutzer)**
- **Profil:** Personen mit komplexem Lebensstil, vielen Verträgen (Haus, KFZ, Versicherungen, Abos), wenig Zeit
- **Pain:** Mentale Last durch bürokratischen „Zirkus", versteckte Kosten, Machtlosigkeit gegenüber Konzernen
- **Gain:** Befreiung von administrativen Aufgaben. SOVEREIGN = privater KI-Stabschef

**B. Professional Shield (Gewerbetreibende, KMU, Freelancer)**
- **Profil:** Kleinunternehmer, Handwerker, Freelancer ohne Rechtsabteilung
- **Pain:** Unbezahlte Rechnungen, komplexe Lieferantenverträge, Liquiditätsrisiken
- **Gain:** Virtuelle Rechts- und Finanzabteilung. Mahnwesen, B2B-Prüfung, Zahlungsziele

### 1.4 Wettbewerbsanalyse & Differenzierung

| Dimension | Clark / Check24 | Finanzguru | Revolut | **SOVEREIGN** |
|-----------|-----------------|------------|---------|---------------|
| Geschäftsmodell | Maklerprovision | Abo + Werbung | Banking-Gebühren | **Reine Nutzer-Vertretung** |
| Intelligenz | Regelbasiert | Kategorisierung | Budgets/Insights | **Gemini Twin — proaktive Strategie** |
| Aktionsfähigkeit | Vermittlung | Nur Anzeige | Banking-Ops | **Autonome Exekution (Gmail, Legal)** |
| Vertragsanalyse | Oberflächlich | Keine | Keine | **Deep Clause Engine mit Risiko-Scoring** |
| Life-Cases | Keine | Keine | Keine | **End-to-End-Management (Schaden, Recht, B2B)** |

> *"We don't compete within the system. We change the power dynamics of the system."*

### 1.5 End-to-End Flows (Meso-Ebene)

Jeder Flow in SOVEREIGN folgt demselben Muster:

```
Trigger → Wahrnehmung → Analyse → Strategie → Execution → Learning
```

**Flow 1: Preiserhöhungsschild**
1. **Trigger:** Bankabbuchung > erwarteter Betrag
2. **Wahrnehmung:** Finance Guardian erkennt Anomalie via Bank-Stream
3. **Analyse:** Gemini klassifiziert (Preiserhöhung / Gebühr / Fehlbuchung), benchmarkt gegen Markt
4. **Strategie:** Widerspruch, Neuverhandlung oder Anbieterwechsel — Playbook wird gewählt
5. **Execution:** Gmail-Entwurf wird erstellt, Nutzer gibt frei via SwipeToApprove
6. **Learning:** AgentMemory wird aktualisiert (Anbieter-Risiko-Score, Nutzerpräferenz)

**Flow 2: Contract Lifecycle Intelligence**
1. **Capture:** Scan / PDF / E-Mail-Attachment → Vault → OCR → Clause Engine
2. **Understanding:** Contract Knowledge Graph (Parteien, Leistungen, Kosten, Fristen, Risiken)
3. **Monitoring:** Deadlines, automatische Verlängerungen, Kündigungsfenster, Preisgleitklauseln
4. **Action:** Kündigungs-/Anpassungsvorschläge, Nachverhandlungsmails, Claims
5. **Integration:** Verknüpfung mit Finance Guardian und Life-Cases

**Flow 3: Life-Case Management**
1. **Auslöser:** Wasserschaden, Mietminderung, Zahlungsverzug (B2B), Abofalle
2. **Strukturierung:** Rollen (Parteien), Pflichtdokumente, Beweismittel, Fristen
3. **Playbook:** Diagnose → Dokumentation → Fristsetzung → Verhandlung → Eskalation
4. **Eskalation:** Automatisiert bis zur Empfehlung eines Anwalts / Ombudsstelle

---

# TEIL II — SYSTEM-ARCHITEKTUR

---

## Kapitel 2 — System-Architektur

### 2.1 Technologie-Stack (Ist-Stand)

| Bereich | Technologie | Version | Status |
|---------|-------------|---------|--------|
| Sprache | Kotlin | 2.0.20 | ✅ Aktuell |
| UI | Jetpack Compose + Material 3 | BOM 2024.10.01 | ✅ |
| DI | Hilt / Dagger | 2.52 | ✅ |
| AI-SDK | Firebase Vertex AI | BOM 33.5.1 | ✅ |
| AI-Modell | `gemini-1.5-pro-preview-0409` | — | 🔴 **VERALTET** |
| Generative AI | `generativeai` | 0.9.0 | 🟡 Veraltet |
| Netzwerk | Ktor (OkHttp-Engine) | 2.3.12 | ✅ |
| Serialisierung | kotlinx.serialization | 1.7.3 | ✅ |
| Biometrie | `androidx.biometric` | 1.2.0-alpha05 | ✅ |
| Navigation | Navigation Compose | 2.8.3 | ✅ |
| Kamera | CameraX | 1.4.0 | ✅ |
| Gmail | google-api-services-gmail | v1-rev20230612 | 🟡 |
| Backend | FastAPI + Python | Cloud Run | ⚠️ Kein Auth |
| Target SDK | Android 35 | — | ✅ |
| Min SDK | Android 26 (Oreo) | — | ✅ |
| JVM | Toolchain 17 | — | ✅ |

### 2.2 Vollständige Repository-Struktur

```
SOVEREIGN-Android/
│
├── app/                                    ← Entry Point + Navigation Root
│   └── src/main/java/com.sovereign.app/
│       ├── MainActivity.kt                 ← NavHost + Theme-Wrapper
│       ├── SovereignNavGraph.kt            ← Alle Routes + Deep Links
│       └── di/
│           └── AppModule.kt                ← Root-DI-Bindings (Hilt)
│
├── core/
│   ├── common/                             ← Pure Kotlin Utilities
│   │   ├── Resource.kt                     ← Sealed: Success / Error / Loading
│   │   └── SecurityManager.kt             ← BiometricPrompt-Wrapper (Hilt @Singleton)
│   │
│   ├── data/                               ← Alle Implementierungen
│   │   ├── ai/
│   │   │   ├── GeminiContractAnalyzer.kt   ← 🔴 BUG: Gibt Mockdaten zurück
│   │   │   ├── GeminiEmailAnalyzerImpl.kt  ← ✅ Prompt korrekt, aber simuliert
│   │   │   └── GeminiLiveAgentImpl.kt      ← ⚠️ Simuliert — kein echter Stream
│   │   ├── di/
│   │   │   ├── AiModule.kt                 ← 🔴 Modell veraltet (P0-Fix)
│   │   │   └── DataModule.kt               ← Repo + DataStore Bindings
│   │   ├── local/                          ← DataStore (Proto) + Room
│   │   ├── remote/                         ← Ktor-Client, API-Services
│   │   └── repository/                     ← Concrete Repo Implementations
│   │
│   ├── domain/                             ← Pure Kotlin — KEINE Android-Deps
│   │   ├── model/                          ← 14 Domain-Modelle
│   │   │   ├── AgentAction.kt              ← ActionStatus, MonetizationFlow
│   │   │   ├── AgentMemory.kt              ← AgentContext, UserProfile, Memories
│   │   │   ├── AgentType.kt                ← NEGOTIATION, SWITCHING, CLAIM
│   │   │   ├── ApprovalRequest.kt          ← ApprovalStatus, RiskLevel
│   │   │   ├── BankTransaction.kt          ← amount, counterpartName, bookingDate
│   │   │   ├── BoundaryConditions.kt       ← 16 Parameter + NegotiationStrategy
│   │   │   ├── Claim.kt                    ← ClaimStatus (7 Stufen)
│   │   │   ├── Contract.kt                 ← ContractCategory, ContractStatus
│   │   │   ├── EmailSource.kt              ← EmailMessage, EmailAttachment
│   │   │   ├── FinancialInsight.kt         ← InsightType (4 Typen)
│   │   │   ├── LifeCase.kt                 ← CaseCategory, CaseStatus, Timeline
│   │   │   ├── OptimizationAction.kt       ← ActionType, ActionLog (Audit)
│   │   │   ├── Saving.kt                   ← SavingType, BillingStatus
│   │   │   └── SovereignDocument.kt        ← DocumentStatus (6 Stufen)
│   │   ├── repository/                     ← Repository-Interfaces
│   │   ├── service/                        ← ContractAnalyzer, EmailAnalyzer,
│   │   │                                      LiveAgentService, TwinConfig
│   │   └── usecase/                        ← Business-Logik-Kapselung
│   │
│   └── ui/                                 ← Shared Compose + Theme
│       ├── theme/
│       │   ├── SovereignTheme.kt           ← Material3 Theme-Wrapper
│       │   ├── Color.kt                    ← Alle Design-Token-Farben
│       │   └── Shape.kt                    ← Rundungen
│       └── component/                      ← Shared UI Atoms
│
├── feature/
│   ├── dashboard/                          ← Haupt-Hub (16 Dateien, größtes Modul)
│   │   ├── DashboardScreen.kt              ← 16 KB — Haupt-UI mit Aura-Effekten
│   │   ├── GeminiLiveTerminalScreen.kt     ← 13.8 KB — Live AI-Chat + Kamera
│   │   ├── DocumentVaultScreen.kt          ← 11 KB — Dokumenten-Tresor + Deep Analysis
│   │   ├── ExecutionCenterScreen.kt        ← 10 KB — Autonome Aktionen + EU AI Act
│   │   ├── VaultScreen.kt
│   │   ├── AuditReportScreen.kt
│   │   ├── LifeCaseDetailScreen.kt
│   │   └── components/
│   │       ├── ActiveAgentsCard.kt
│   │       ├── EmailInsightCard.kt
│   │       ├── FinancialAlertCard.kt
│   │       ├── LifeCaseCard.kt
│   │       └── SavingsSummaryCard.kt
│   │
│   ├── contracts/                          ← Vertragsmanagement
│   │   ├── ContractsScreen.kt              ← LazyColumn + FAB
│   │   ├── AddContractScreen.kt
│   │   ├── ContractDetailScreen.kt
│   │   └── ContractsViewModel.kt           ← GetContractsUseCase, StateFlow
│   │
│   ├── approvals/                          ← Human-in-the-Loop
│   │   ├── ApprovalsScreen.kt              ← Approval Queue + Savings
│   │   ├── ApprovalDetailScreen.kt
│   │   └── ApprovalsViewModel.kt
│   │
│   ├── claims/                             ← Schadensfälle
│   │
│   ├── settings/                           ← Konfiguration
│   │   ├── BoundaryConditionsScreen.kt     ← Agenten-Leitplanken (Sliders, Chips)
│   │   ├── ConnectedAccountsScreen.kt
│   │   ├── AgentConfigScreen.kt
│   │   ├── PaymentSettingsScreen.kt
│   │   └── SecuritySettingsScreen.kt
│   │
│   └── onboarding/                         ← Ersteinrichtung + Biometrie
│
├── backend/                                ← FastAPI + Python (Cloud Run)
│   ├── main.py                             ← ⚠️ KEIN AUTH-LAYER
│   ├── requirements.txt
│   └── Dockerfile
│
└── gradle/
    └── libs.versions.toml                  ← Zentrale Versions-Verwaltung
```

### 2.3 Clean Architecture — Dependency-Regel

```
feature/*  ───→  core/domain  ←───  core/data
                 (Interfaces)       (Implementations)
                      ↑
               core/common
               core/ui
```

**Goldene Regel:** `core/domain` hat **ZERO** Android-Abhängigkeiten. Alles in `domain/` ist reines Kotlin. Unit-Tests laufen auf der JVM, ohne Emulator.

**Dependency-Flow:**
- `feature/*` darf `core/domain` und `core/ui` importieren
- `core/data` darf `core/domain` und `core/common` importieren
- `core/domain` darf **NUR** `core/common` importieren (und auch nur für `Resource.kt`)
- `core/ui` darf `core/domain` importieren (für Modell-Typen in Compose)
- **Kein Feature-Modul importiert ein anderes Feature-Modul**

### 2.4 End-to-End Datenfluss

```
[Nutzer-Input / Background-Trigger]
           │
           ▼
[Feature ViewModel]  ←──── collectAsStateWithLifecycle()
           │
           ▼
[UseCase]  ←──── Dependency Injection via Hilt @Inject
           │
           ▼
[Repository Interface]  ──→  Wählt Datenquelle:
           │                    ├── Remote: Ktor → FastAPI → Firestore
           │                    ├── Local:  DataStore (verschlüsselt)
           │                    └── AI:     GenerativeModel → Vertex AI
           ▼
[Result<T> / Flow<T>]
           │
           ▼
[ViewModel UiState]  ──→  Compose Recomposition  ──→  UI-Update
```

### 2.5 MVI-Pattern (Model-View-Intent)

Jedes Feature-Modul folgt diesem Pattern:

```kotlin
// 1. State — Immutable Data Class
data class ContractsUiState(
    val isLoading: Boolean = false,
    val error: String? = null,
    val contracts: List<Contract> = emptyList()
)

// 2. Intent — Sealed Interface für User-Actions
sealed interface ContractsIntent {
    data object LoadContracts : ContractsIntent
    data class DeleteContract(val id: String) : ContractsIntent
    data class AnalyzeContract(val contract: Contract) : ContractsIntent
}

// 3. ViewModel — Verarbeitet Intents, emittiert State
@HiltViewModel
class ContractsViewModel @Inject constructor(
    private val getContracts: GetContractsUseCase,
    private val addContract: AddContractUseCase
) : ViewModel() {
    private val _state = MutableStateFlow(ContractsUiState())
    val state: StateFlow<ContractsUiState> = _state.asStateFlow()

    fun onIntent(intent: ContractsIntent) { /* ... */ }
}
```

---

# TEIL III — KRITISCHE BUGS & SOFORT-FIXES

---

## Kapitel 3 — Kritische Bugs & Sofort-Fixes

> **P0** = Sofort — blockiert Kernfunktionalität
> **P1** = Diese Woche — wichtig für Stabilität
> **P2** = Nächster Sprint — wichtig für Produktion

### 3.1 🔴 P0 — Gemini-Modell veraltet (`AiModule.kt`)

**Problem:** `gemini-1.5-pro-preview-0409` ist ein End-of-Life Preview-Modell. Firebase hat bereits im UI darauf hingewiesen. Das Modell wird zum 1. Juni 2026 eingestellt.

**Datei:** `core/data/src/main/java/com/sovereign/core/data/di/AiModule.kt`

**Vorher (löschen):**
```kotlin
return Firebase.vertexAI.generativeModel(
    modelName = "gemini-1.5-pro-preview-0409"
)
```

**Nachher (einfügen):**
```kotlin
return Firebase.vertexAI.generativeModel(
    modelName = "gemini-2.5-flash",
    generationConfig = generationConfig {
        temperature = 0.2f               // Präzision > Kreativität für Vertragsanalyse
        topK = 40
        topP = 0.95f
        maxOutputTokens = 8192
        responseMimeType = "application/json"  // Strukturierte JSON-Ausgabe erzwingen
    },
    safetySettings = listOf(
        SafetySetting(HarmCategory.HARASSMENT, BlockThreshold.MEDIUM_AND_ABOVE),
        SafetySetting(HarmCategory.HATE_SPEECH, BlockThreshold.MEDIUM_AND_ABOVE),
        SafetySetting(HarmCategory.DANGEROUS_CONTENT, BlockThreshold.MEDIUM_AND_ABOVE)
    )
)
```

**Warum `gemini-2.5-flash`?**
- GA-Modell (General Availability), kein Preview — stabil und langfristig unterstützt
- 1 Million Token Kontextfenster — ganze Vertragsdokumente passen rein
- Nativer JSON-Mode für zuverlässiges, parsefähiges Output
- Bestes Preis-/Leistungs-Verhältnis für strukturierte Analyse-Tasks
- Für das Live-Terminal: separates Modell `gemini-live-2.5-flash-native-audio`

---

### 3.2 🔴 P0 — GeminiContractAnalyzer gibt Mockdaten zurück

**Problem:** Die `analyzeDocument()`-Methode ruft Gemini korrekt auf, empfängt `responseText`, **ignoriert die Antwort dann aber komplett** und gibt stattdessen hardkodierte Fake-Daten zurück: „Telekom Magenta Zuhause L" mit festen Werten. Der Vertragsscanner ist damit funktional kaputt.

**Datei:** `core/data/src/main/java/com/sovereign/core/data/ai/GeminiContractAnalyzer.kt`

**Fix-Strategie:** Die echte Gemini-Antwort muss geparsed werden. Da wir in `AiModule.kt` jetzt `responseMimeType = "application/json"` setzen, kommt die Antwort als valides JSON.

**Vollständige Neu-Implementierung der `analyzeDocument()` Methode:**

```kotlin
override suspend fun analyzeDocument(
    text: String,
    context: AgentContext
): Result<ContractAnalysis> {
    return try {
        // 1. Portfolio-Kontext aufbauen
        val memoryContext = context.relevantMemories
            .sortedByDescending { it.importance }
            .take(10)
            .joinToString("\n") { "- ${it.key}: ${it.value}" }

        val activeContracts = context.activeContracts
            .joinToString("\n") {
                "  - ${it.provider} (${it.category.name}): ${it.monthlyPriceEur}€/Monat"
            }

        // 2. Prompt konstruieren
        val prompt = """
            Du bist Sovereign AI, ein hochspezialisierter Vertragsanalyst.
            Standard: Google Premium Quality — präzise, analytisch, strukturiert.

            PORTFOLIO-KONTEXT DES NUTZERS:
            Präferenzen & Fakten:
            $memoryContext

            Aktive Verträge (zum Kostenvergleich):
            $activeContracts

            AUFGABE:
            Analysiere den folgenden Vertragstext vollständig.
            Prüfe: Kosten, Laufzeit, Kündigungsfristen, Auto-Verlängerung,
            Preisanpassungsklauseln, versteckte Gebühren, Risiko-Klauseln.
            Vergleiche mit dem Portfolio-Kontext.

            VERTRAGSTEXT:
            $text

            AUSGABE (strikt JSON, kein Markdown):
            {
              "provider": "string",
              "productName": "string",
              "category": "TELECOM|INSURANCE|ENERGY|HOUSING|STREAMING|FITNESS|OTHER",
              "monthlyPriceEur": 0.00,
              "contractNumber": "string|null",
              "startDate": "YYYY-MM-DD|null",
              "endDate": "YYYY-MM-DD|null",
              "cancellationNoticeDays": 30,
              "autoRenewal": true,
              "autoRenewalMonths": 12,
              "indexationClause": false,
              "riskLevel": "LOW|MEDIUM|HIGH",
              "insights": [
                {
                  "title": "string",
                  "description": "string",
                  "type": "POTENTIAL_SAVING|RISK_DETECTED|MARKET_COMPARISON|ACTION_REQUIRED"
                }
              ],
              "confidence": 0.85
            }
        """.trimIndent()

        // 3. Gemini aufrufen und ECHTE Antwort verwenden
        val response = generativeModel.generateContent(prompt)
        val responseText = response.text
            ?: return Result.failure(Exception("Gemini: Leere Antwort erhalten"))

        // 4. JSON parsen
        val json = Json { ignoreUnknownKeys = true; isLenient = true }
        val parsed = json.decodeFromString<GeminiContractResponse>(responseText)

        // 5. In Domain-Modell konvertieren
        val analysis = ContractAnalysis(
            provider = parsed.provider,
            productName = parsed.productName,
            category = ContractCategory.valueOf(parsed.category),
            monthlyPriceEur = parsed.monthlyPriceEur,
            contractNumber = parsed.contractNumber,
            cancellationNoticeDays = parsed.cancellationNoticeDays,
            autoRenewal = parsed.autoRenewal,
            autoRenewalMonths = parsed.autoRenewalMonths,
            indexationClause = parsed.indexationClause,
            riskLevel = when (parsed.riskLevel) {
                "HIGH" -> RiskLevel.HIGH
                "MEDIUM" -> RiskLevel.MEDIUM
                else -> RiskLevel.LOW
            },
            insights = parsed.insights.map { insight ->
                AgentInsight(
                    title = insight.title,
                    description = insight.description,
                    type = InsightType.valueOf(insight.type)
                )
            },
            confidence = parsed.confidence
        )

        Result.success(analysis)
    } catch (e: Exception) {
        Result.failure(Exception("Vertragsanalyse fehlgeschlagen: ${e.message}", e))
    }
}

// Hilfs-Datenklasse für JSON-Deserialisierung
@Serializable
private data class GeminiContractResponse(
    val provider: String,
    val productName: String,
    val category: String = "OTHER",
    val monthlyPriceEur: Double,
    val contractNumber: String? = null,
    val cancellationNoticeDays: Int = 30,
    val autoRenewal: Boolean = false,
    val autoRenewalMonths: Int = 0,
    val indexationClause: Boolean = false,
    val riskLevel: String = "LOW",
    val insights: List<GeminiInsight> = emptyList(),
    val confidence: Double = 0.0
)

@Serializable
private data class GeminiInsight(
    val title: String,
    val description: String,
    val type: String = "POTENTIAL_SAVING"
)
```

---

### 3.3 🔴 P0 — GeminiLiveAgentImpl simuliert nur

**Problem:** `GeminiLiveAgentImpl.kt` verwendet Fake-Antworten statt echte Gemini-Streams. Die `sendInput()`-Methode gibt simulierte Texte zurück.

**Fix:** Durch das Update auf `gemini-2.5-flash` wird auch der Live-Agent echte Streaming-Antworten verwenden. Die `startSession()`-Methode muss eine echte Chat-Session öffnen:

```kotlin
private var chatSession: Chat? = null

override suspend fun startSession() {
    chatSession = generativeModel.startChat(
        history = buildPortfolioContext() // Kontext aus AgentMemory
    )
    _agentOutput.value = AgentOutput(status = AgentStatus.LISTENING)
}

override suspend fun sendInput(input: AgentInput): AgentOutput {
    val chat = chatSession ?: throw IllegalStateException("Keine aktive Session")

    _agentOutput.value = AgentOutput(status = AgentStatus.STRATEGIZING)

    return when (input) {
        is AgentInput.Text -> {
            val response = chat.sendMessage(input.text)
            AgentOutput(
                status = AgentStatus.LISTENING,
                text = response.text ?: "Keine Antwort erhalten"
            )
        }
        is AgentInput.Voice -> { /* Audio-Stream verarbeiten */ }
        is AgentInput.AppContext -> { /* Kontext-Update */ }
    }
}
```

---

### 3.4 🟡 P1 — Backend ohne Authentifizierung

**Problem:** `backend/main.py` hat keine Authentifizierung. Alle Endpoints sind öffentlich zugänglich.

**Datei:** `backend/main.py`

**Aktueller Zustand:**
```python
from fastapi import FastAPI
from google.cloud import firestore

app = FastAPI()
db = firestore.Client()

@app.get("/contracts")
async def get_contracts():
    docs = db.collection("contracts").stream()
    return [doc.to_dict() for doc in docs]
```

**Fix — Firebase Auth Middleware hinzufügen:**
```python
from fastapi import FastAPI, Depends, HTTPException, Header
from google.cloud import firestore
import firebase_admin
from firebase_admin import auth as firebase_auth

firebase_admin.initialize_app()
app = FastAPI(title="SOVEREIGN Backend", version="2.0.0")
db = firestore.Client()

async def verify_firebase_token(authorization: str = Header(...)) -> dict:
    """Verifiziert das Firebase ID-Token aus dem Authorization-Header."""
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")
    token = authorization.split("Bearer ")[1]
    try:
        decoded = firebase_auth.verify_id_token(token)
        return decoded
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

@app.get("/contracts")
async def get_contracts(user: dict = Depends(verify_firebase_token)):
    uid = user["uid"]
    docs = db.collection("users").document(uid).collection("contracts").stream()
    return [{"id": doc.id, **doc.to_dict()} for doc in docs]

@app.post("/contracts")
async def add_contract(contract: dict, user: dict = Depends(verify_firebase_token)):
    uid = user["uid"]
    ref = db.collection("users").document(uid).collection("contracts").add(contract)
    return {"id": ref[1].id, "status": "created"}
```

---

### 3.5 🟡 P1 — Doppelter Package-Name

**Problem:** In `app/src/main/java/` existiert sowohl `com.sovereign.app` (korrekt) als auch `com.yildirim.soverein` (altes Scaffold). Das verursacht potenzielle Build-Konflikte.

**Fix:** Den Ordner `com/yildirim/soverein/` komplett löschen. Er enthält nur ein altes `MainActivity.kt`-Scaffold.

---

### 3.6 🟡 P1 — Release-Build ohne Minification

**Problem:** `isMinifyEnabled = false` im Release-Build. APK ist unnötig groß und Code ist nicht obfuskiert.

**Fix in `app/build.gradle.kts`:**
```kotlin
buildTypes {
    release {
        isMinifyEnabled = true  // War: false
        isShrinkResources = true
        proguardFiles(
            getDefaultProguardFile("proguard-android-optimize.txt"),
            "proguard-rules.pro"
        )
    }
}
```

---

### 3.7 🟢 P2 — Veraltete Dependency-Versionen

**Problem:** Mehrere Libraries in `libs.versions.toml` sind veraltet.

| Library | Aktuell | Empfohlen |
|---------|---------|-----------|
| `generativeai` | 0.9.0 | 0.9.0+ (oder komplett via Firebase SDK) |
| `gmail-api` | v1-rev20230612 | Neueste verfügbare Version |
| `biometric` | 1.2.0-alpha05 | Stabil wenn verfügbar |

---

# TEIL IV — DOMÄNENMODELL

---

## Kapitel 4 — Domänenmodell — Alle Entitäten

> Alle Modelle liegen in `core/domain/src/main/java/com/sovereign/core/domain/model/`.
> Sie sind **reines Kotlin** mit `@Serializable` (kotlinx.serialization).
> Keine Android-Abhängigkeiten.

### 4.1 Contract — Vertrag

```kotlin
@Serializable
data class Contract(
    val id: String,
    val userId: String,
    val provider: String,
    val productName: String,
    val category: ContractCategory,
    val status: ContractStatus,
    val monthlyPriceEur: Double,
    val startDate: Long,
    val endDate: Long?,
    val cancellationNoticeDays: Int,
    val autoRenewal: Boolean,
    val notes: String? = null
)

@Serializable
enum class ContractCategory {
    TELECOM, INSURANCE, ENERGY, HOUSING, STREAMING, FITNESS, MOBILITY, OTHER
}

@Serializable
enum class ContractStatus {
    ACTIVE, PENDING_CANCELLATION, CANCELLED, EXPIRED, DRAFT
}
```

**Verwendung:** Zentrale Entität für den Vertragsscanner, Finance Guardian, Clause Engine.

---

### 4.2 LifeCase — Lebensfall

```kotlin
@Serializable
data class LifeCase(
    val id: String = UUID.randomUUID().toString(),
    val title: String,
    val description: String,
    val category: CaseCategory,
    val status: CaseStatus,
    val createdAt: Long,
    val lastUpdate: Long,
    val participants: List<CaseParticipant>,
    val timeline: List<TimelineEvent>,
    val urgency: UrgencyLevel,
    val riskScore: Float  // 0.0 bis 1.0
)

@Serializable
enum class CaseCategory { HOUSING, INSURANCE, LEGAL, WORK, MOBILITY, OTHER }

@Serializable
enum class CaseStatus {
    IDENTIFIED, DOCUMENTING, CORRESPONDENCE_ACTIVE,
    EXPERT_INVOLVED, LEGAL_ACTION, RESOLVED
}

@Serializable
data class CaseParticipant(
    val id: String,
    val name: String,
    val role: String,       // z.B. "Vermieter", "Nachbar", "Gutachter"
    val contactInfo: String? = null
)

@Serializable
data class TimelineEvent(
    val id: String = UUID.randomUUID().toString(),
    val timestamp: Long,
    val title: String,
    val description: String,
    val type: EventType,
    val documentIds: List<String> = emptyList()
)

@Serializable
enum class EventType {
    INCIDENT, MESSAGE_SENT, MESSAGE_RECEIVED,
    APPOINTMENT, EVIDENCE_ADDED, DECISION_REQUIRED
}

@Serializable
enum class UrgencyLevel { LOW, MEDIUM, HIGH, CRITICAL }
```

**Verwendung:** Life-Case Management — Wasserschaden, Mietminderung, B2B-Zahlungsverzug. Jeder Case hat Beteiligte, eine lückenlose Timeline und Dringlichkeitsstufen.

---

### 4.3 BankTransaction — Bankbuchung

```kotlin
@Serializable
data class BankTransaction(
    val id: String,
    val amount: Double,
    val currency: String = "EUR",
    val counterpartName: String,
    val purpose: String,
    val bookingDate: Long
)
```

**Verwendung:** Finance Guardian — Anomalie-Erkennung, Preiserhöhungen, Cashflow-Analyse.

---

### 4.4 ApprovalRequest — Freigabe-Anfrage

```kotlin
@Serializable
data class ApprovalRequest(
    val id: String,
    val userId: String,
    val actionId: String,
    val agentType: AgentType,
    val createdAt: Long,
    val expiresAt: Long,
    val status: ApprovalStatus,
    val actionSummary: String,
    val actionDetail: String,
    val affectedProvider: String,
    val affectedContractId: String?,
    val estimatedSavingEur: Double,
    val estimatedCostEur: Double,
    val riskLevel: RiskLevel
)

@Serializable
enum class ApprovalStatus { PENDING, APPROVED, REJECTED, EXPIRED, AUTO_APPROVED }

@Serializable
enum class RiskLevel { LOW, MEDIUM, HIGH }
```

**Verwendung:** Human-in-the-Loop Gate. Jede exekutive Aktion des Agenten muss durch eine `ApprovalRequest` genehmigt werden (außer bei `AUTO_APPROVED` für Low-Risk-Aktionen innerhalb der `BoundaryConditions`).

---

### 4.5 BoundaryConditions — Agenten-Leitplanken

```kotlin
@Serializable
data class BoundaryConditions(
    val maxAutoAmountEur: Double = 50.0,
    val maxMonthlyFeeEur: Double = 100.0,
    val minSavingForSwitchEur: Double = 10.0,
    val allowAutonomousNegotiation: Boolean = false,
    val allowAutonomousSwitching: Boolean = false,
    val allowAutonomousCancellation: Boolean = false,
    val preferGreenEnergy: Boolean = false,
    val negotiationStrategy: NegotiationStrategy = NegotiationStrategy.MODERATE,
    val requireBiometricForAll: Boolean = true,
    val maxContractDurationMonths: Int = 24,
    val blacklistedProviders: List<String> = emptyList(),
    val whitelistedProviders: List<String> = emptyList(),
    val killSwitchActive: Boolean = false,
    val allowEmailSending: Boolean = true,
    val allowClaimFiling: Boolean = true,
    val maxRiskTolerance: RiskLevel = RiskLevel.MEDIUM
)

@Serializable
enum class NegotiationStrategy { CONSERVATIVE, MODERATE, AGGRESSIVE }
```

**Verwendung:** Settings → BoundaryConditionsScreen. Der Nutzer definiert die Grenzen, innerhalb derer der Agent autonom handeln darf. Der `killSwitchActive`-Parameter stoppt sofort alle autonomen Aktionen.

---

### 4.6 AgentMemory — Agenten-Gedächtnis

```kotlin
@Serializable
data class AgentMemory(
    val id: String = UUID.randomUUID().toString(),
    val category: MemoryCategory,
    val key: String,
    val value: String,
    val importance: Float,      // 0.0 bis 1.0
    val createdAt: Long,
    val lastAccessedAt: Long,
    val source: String          // z.B. "contract_scan", "email_analysis", "user_input"
)

@Serializable
enum class MemoryCategory {
    USER_PREFERENCE, PROVIDER_FACT, FINANCIAL_PATTERN,
    LEGAL_INSIGHT, LIFE_EVENT, BEHAVIORAL
}

@Serializable
data class AgentContext(
    val relevantMemories: List<AgentMemory>,
    val activeContracts: List<Contract>,
    val recentTransactions: List<BankTransaction>,
    val activeCases: List<LifeCase>,
    val boundaryConditions: BoundaryConditions,
    val userProfile: UserProfile? = null
)

@Serializable
data class UserProfile(
    val riskTolerance: RiskLevel = RiskLevel.MEDIUM,
    val goals: List<String> = emptyList(),
    val preferredLanguage: String = "de"
)
```

**Verwendung:** Der Portfolio-Kontext. Wird bei jedem AI-Call als Kontext mitgegeben, damit Gemini personalisierte, relevante Analysen liefert. `AgentContext` aggregiert alle relevanten Daten für einen einzelnen AI-Call.

---

### 4.7 AgentAction — Agenten-Aktion

```kotlin
@Serializable
data class AgentAction(
    val id: String,
    val userId: String,
    val agentType: AgentType,
    val contractId: String? = null,
    val type: ActionType,
    val status: ActionStatus,
    val description: String,
    val estimatedSavingEur: Double,
    val actualSavingEur: Double? = null,
    val createdAt: Long,
    val completedAt: Long? = null,
    val monetizationFlow: MonetizationFlow
)

@Serializable
enum class ActionStatus {
    PENDING, APPROVED, IN_PROGRESS, COMPLETED, FAILED, CANCELLED
}

@Serializable
enum class MonetizationFlow {
    FREE, COMMISSION_ON_SAVING, PREMIUM_FEATURE
}
```

---

### 4.8 AgentType — Agenten-Typen

```kotlin
@Serializable
enum class AgentType {
    NEGOTIATION,   // Verhandelt mit Anbietern
    SWITCHING,     // Wechselt Anbieter
    CLAIM          // Reicht Schadensfälle ein (z.B. Flugverspätung)
}
```

**Erweiterung empfohlen (siehe Roadmap):**
```kotlin
enum class AgentType {
    NEGOTIATION, SWITCHING, CLAIM,
    FINANCE_GUARDIAN,   // Finanz-Überwachung
    CLAUSE_ANALYST,     // Vertragsklausel-Analyse
    LIFE_CASE_MANAGER   // Lebensfall-Koordination
}
```

---

### 4.9 Claim — Schadensfall

```kotlin
@Serializable
data class Claim(
    val id: String,
    val userId: String,
    val type: ClaimType,
    val status: ClaimStatus,
    val flightNumber: String? = null,
    val provider: String,
    val description: String,
    val compensationEur: Double,
    val userPayoutEur: Double,
    val sovereignFeeEur: Double,
    val filedAt: Long,
    val resolvedAt: Long? = null
)

@Serializable
enum class ClaimStatus {
    DETECTED, APPROVED, SUBMITTED, ACCEPTED,
    PAID_TO_ESCROW, PAID_OUT, REJECTED
}
```

---

### 4.10 FinancialInsight — Finanz-Erkenntnis

```kotlin
@Serializable
data class FinancialInsight(
    val id: String = UUID.randomUUID().toString(),
    val type: InsightType,
    val merchantName: String,
    val amount: Double,
    val previousAmount: Double? = null,
    val description: String,
    val timestamp: Long,
    val isActionable: Boolean
)

@Serializable
enum class InsightType {
    PRICE_INCREASE,       // Preiserhöhung erkannt
    NEW_SUBSCRIPTION,     // Neues Abo erkannt
    UNUSUAL_ACTIVITY,     // Ungewöhnliche Buchung
    POTENTIAL_SAVING      // Sparpotenzial identifiziert
}
```

---

### 4.11 Saving — Realisierte Ersparnis

```kotlin
@Serializable
data class Saving(
    val id: String,
    val userId: String,
    val actionId: String,
    val agentType: AgentType,
    val savingAmountEur: Double,
    val savingType: SavingType,
    val provider: String,
    val description: String,
    val achievedAt: Long,
    val billingStatus: BillingStatus
)

@Serializable
enum class SavingType { MONTHLY, ONE_TIME, ANNUAL }

@Serializable
enum class BillingStatus { BILLED, PENDING, WAIVED }
```

---

### 4.12 SovereignDocument — Dokument im Vault

```kotlin
@Serializable
data class SovereignDocument(
    val id: String,
    val fileName: String,
    val fileSize: Long,
    val uploadDate: Long,
    val status: DocumentStatus,
    val category: ContractCategory,
    val detectedProvider: String? = null,
    val analysisConfidence: Float = 0f
)

@Serializable
enum class DocumentStatus {
    UPLOADING, SCANNED, ANALYZING, IDENTIFIED,
    OPTIMIZATION_FOUND, FAILED
}
```

---

### 4.13 OptimizationAction — Optimierungs-Aktion

```kotlin
@Serializable
data class OptimizationAction(
    val id: String,
    val contractId: String,
    val type: ActionType,
    val status: ActionStatus,
    val provider: String,
    val description: String,
    val estimatedSavingEur: Double,
    val createdAt: Long,
    val executedAt: Long? = null,
    val documentUrl: String? = null,
    val logs: List<ActionLog> = emptyList()
)

@Serializable
data class ActionLog(
    val timestamp: Long,
    val action: String,
    val result: String
)

@Serializable
enum class ActionType { CANCELLATION, SWITCH, NEGOTIATION }
```

---

### 4.14 EmailSource — E-Mail-Daten

```kotlin
@Serializable
data class EmailMessage(
    val id: String,
    val sender: String,
    val subject: String,
    val bodySnippet: String,
    val timestamp: Long,
    val attachments: List<EmailAttachment> = emptyList()
)

@Serializable
data class EmailAttachment(
    val id: String,
    val fileName: String,
    val mimeType: String,
    val size: Long,
    val contentUri: String? = null
)

@Serializable
enum class EmailProvider { GMAIL, OUTLOOK, OTHER }
```

---

### 4.15 Resource — Generisches Result-Wrapper

```kotlin
sealed class Resource<T>(val data: T? = null, val message: String? = null) {
    class Success<T>(data: T) : Resource<T>(data)
    class Error<T>(message: String, data: T? = null) : Resource<T>(data, message)
    class Loading<T>(data: T? = null) : Resource<T>(data)
}
```

**Verwendung:** Jeder Repository-Call und jeder UseCase gibt `Resource<T>` zurück. ViewModels mappen dies auf `UiState`.

---

## Kapitel 5 — Business-Logik & UseCases

### 5.1 UseCase-Architektur

Jeder UseCase ist eine einzelne Klasse mit einem `operator fun invoke()`, injiziert via Hilt:

```kotlin
class GetContractsUseCase @Inject constructor(
    private val repository: ContractRepository
) {
    operator fun invoke(): Flow<Resource<List<Contract>>> {
        return repository.getContracts()
    }
}
```

### 5.2 UseCase-Katalog

| UseCase | Modul | Input | Output |
|---------|-------|-------|--------|
| `GetContractsUseCase` | contracts | — | `Flow<Resource<List<Contract>>>` |
| `AddContractUseCase` | contracts | `Contract` | `Resource<Contract>` |
| `AnalyzeContractUseCase` | contracts | `String` (Text), `AgentContext` | `Resource<ContractAnalysis>` |
| `GetApprovalsUseCase` | approvals | — | `Flow<Resource<List<ApprovalRequest>>>` |
| `ApproveActionUseCase` | approvals | `approvalId: String` | `Resource<Unit>` |
| `RejectActionUseCase` | approvals | `approvalId: String`, `reason: String` | `Resource<Unit>` |
| `GetLifeCasesUseCase` | dashboard | — | `Flow<Resource<List<LifeCase>>>` |
| `GetFinancialInsightsUseCase` | dashboard | — | `Flow<Resource<List<FinancialInsight>>>` |
| `GetSavingsUseCase` | dashboard | — | `Flow<Resource<List<Saving>>>` |
| `AnalyzeEmailsUseCase` | dashboard | `List<EmailMessage>` | `Resource<List<FinancialInsight>>` |
| `ScanDocumentUseCase` | dashboard | `documentUri: Uri` | `Resource<SovereignDocument>` |
| `GetBoundaryConditionsUseCase` | settings | — | `Flow<BoundaryConditions>` |
| `UpdateBoundaryConditionsUseCase` | settings | `BoundaryConditions` | `Resource<Unit>` |
| `ExecuteOptimizationUseCase` | dashboard | `OptimizationAction` | `Resource<AgentAction>` |
| `FileClaimUseCase` | claims | `Claim` | `Resource<Claim>` |

### 5.3 Repository-Interfaces

```kotlin
// core/domain/repository/ContractRepository.kt
interface ContractRepository {
    fun getContracts(): Flow<Resource<List<Contract>>>
    suspend fun addContract(contract: Contract): Resource<Contract>
    suspend fun deleteContract(id: String): Resource<Unit>
    suspend fun getContractById(id: String): Resource<Contract>
}

// core/domain/repository/ApprovalRepository.kt
interface ApprovalRepository {
    fun getApprovals(): Flow<Resource<List<ApprovalRequest>>>
    suspend fun approve(id: String): Resource<Unit>
    suspend fun reject(id: String, reason: String): Resource<Unit>
}

// core/domain/repository/FinanceRepository.kt
interface FinanceRepository {
    fun getTransactions(): Flow<Resource<List<BankTransaction>>>
    fun getInsights(): Flow<Resource<List<FinancialInsight>>>
    fun getSavings(): Flow<Resource<List<Saving>>>
}
```

### 5.4 Service-Interfaces (AI-Schicht)

```kotlin
// core/domain/service/ContractAnalyzer.kt
interface ContractAnalyzer {
    suspend fun analyzeDocument(text: String, context: AgentContext): Result<ContractAnalysis>
    fun findSavings(contract: Contract, context: AgentContext): Flow<OptimizationProposal>
    suspend fun updateMemory(analysis: ContractAnalysis): List<AgentMemory>
}

// core/domain/service/EmailAnalyzer.kt
interface EmailAnalyzer {
    suspend fun analyzeEmails(emails: List<EmailMessage>): Result<List<FinancialInsight>>
}

// core/domain/service/LiveAgentService.kt
interface LiveAgentService {
    val agentOutput: StateFlow<AgentOutput>
    suspend fun startSession()
    suspend fun sendInput(input: AgentInput): AgentOutput
    suspend fun stopSession()
}
```

---

# TEIL V — INTELLIGENZ-SCHICHT

---

## Kapitel 6 — Intelligenz-Schicht — Gemini & Engines

### 6.1 Modell-Strategie

| Anwendungsfall | Modell | Warum |
|----------------|--------|-------|
| Vertragsanalyse | `gemini-2.5-flash` | Schnell, günstig, JSON-Mode, 1M Kontext |
| E-Mail-Analyse | `gemini-2.5-flash` | Batch-fähig, hoher Durchsatz |
| Live Terminal | `gemini-2.5-flash` (Chat) | Streaming, Konversation |
| Live Terminal + Kamera | `gemini-live-2.5-flash-native-audio` | Multimodal, Echtzeit-Video |
| Komplexe Rechtsanalyse | `gemini-2.5-pro` | Höchste Qualität für Eskalationen |

### 6.2 DI-Konfiguration (`AiModule.kt`)

```kotlin
@Module
@InstallIn(SingletonComponent::class)
object AiModule {

    @Provides
    @Singleton
    @Named("GeminiAnalysis")
    fun provideAnalysisModel(): GenerativeModel {
        return Firebase.vertexAI.generativeModel(
            modelName = "gemini-2.5-flash",
            generationConfig = generationConfig {
                temperature = 0.2f
                maxOutputTokens = 8192
                responseMimeType = "application/json"
            }
        )
    }

    @Provides
    @Singleton
    @Named("GeminiChat")
    fun provideChatModel(): GenerativeModel {
        return Firebase.vertexAI.generativeModel(
            modelName = "gemini-2.5-flash",
            generationConfig = generationConfig {
                temperature = 0.7f  // Etwas kreativer für Chat
                maxOutputTokens = 4096
            }
        )
    }

    @Provides
    @Singleton
    fun provideContractAnalyzer(
        @Named("GeminiAnalysis") model: GenerativeModel
    ): ContractAnalyzer {
        return GeminiContractAnalyzer(model)
    }

    @Provides
    @Singleton
    fun provideEmailAnalyzer(
        @Named("GeminiAnalysis") model: GenerativeModel
    ): EmailAnalyzer {
        return GeminiEmailAnalyzerImpl(model)
    }

    @Provides
    @Singleton
    fun provideLiveAgent(
        @Named("GeminiChat") model: GenerativeModel
    ): LiveAgentService {
        return GeminiLiveAgentImpl(model)
    }
}
```

### 6.3 Prompt-Architektur

Jeder Prompt folgt einer strengen Struktur:

```
┌──────────────────────────────────────┐
│ SYSTEM-ROLLE                          │
│ "Du bist Sovereign AI, ein ..."       │
├──────────────────────────────────────┤
│ PORTFOLIO-KONTEXT                     │
│ - AgentMemory (Top 10 nach Relevanz)  │
│ - Aktive Verträge                     │
│ - Letzte Transaktionen                │
│ - BoundaryConditions (Leitplanken)    │
├──────────────────────────────────────┤
│ AUFGABE                               │
│ Klare, spezifische Instruktion        │
├──────────────────────────────────────┤
│ INPUT-DATEN                           │
│ Vertragstext / E-Mail / Dokument      │
├──────────────────────────────────────┤
│ OUTPUT-FORMAT                         │
│ Strikt JSON-Schema (kein Markdown)    │
├──────────────────────────────────────┤
│ GUARDRAILS                            │
│ - Keine Rechtsberatung im Sinne des   │
│   Rechtsdienstleistungsgesetzes        │
│ - Immer "Empfehlung", nie "Anweisung" │
│ - Bei Unsicherheit: confidence < 0.5  │
└──────────────────────────────────────┘
```

### 6.4 Prompt-Beispiele

**Vertragsanalyse-Prompt** (siehe Kapitel 3.2 für vollständige Implementierung)

**E-Mail-Analyse-Prompt:**
```
Du bist Sovereign AI, spezialisiert auf die Erkennung von finanziellen
Ereignissen in E-Mails.

PORTFOLIO-KONTEXT:
[Aktive Verträge, Anbieter-Liste, Preishistorie]

AUFGABE:
Analysiere die folgenden E-Mails auf:
1. Preiserhöhungen (auch versteckte: "Anpassung", "neue Konditionen")
2. Neue Abonnements (unbekannte Abbuchungsankündigungen)
3. Kündigungsfristen (Erinnerungen, Ablaufwarnungen)
4. Vertragsänderungen (AGB-Updates, Leistungsänderungen)

E-MAILS:
[Formatierte E-Mail-Liste]

AUSGABE: JSON-Array von FinancialInsight-Objekten
```

**Life-Case-Strategie-Prompt:**
```
Du bist Sovereign AI, ein Strategie-Berater für Lebensfälle.

FALL: [LifeCase mit Timeline, Beteiligten, Beweismitteln]

AUFGABE:
Erstelle einen Schlachtplan für diesen Fall:
1. Rechtliche Einordnung (BGB-Paragraphen, relevante Urteile)
2. Empfohlene Schritte (priorisiert nach Dringlichkeit)
3. Muster-Korrespondenz (Fristsetzung, Mängelanzeige)
4. Eskalationspfad (wann Anwalt / Ombudsstelle)

WARNUNG: Dies ist eine Empfehlung, keine Rechtsberatung.
```

### 6.5 Memory-Management-Strategie

```
Neues Faktum erkannt (z.B. "Nutzer hat Telekom-Vertrag seit 2019")
         │
         ▼
  Existiert bereits ähnliches Memory?
         │
    ┌────┴────┐
    Ja        Nein
    │          │
    ▼          ▼
  Update:    Create:
  importance  importance basierend auf
  + 0.1       Quelle und Kontext
  lastAccessed = now()
         │
         ▼
  Memory-Pruning:
  - Memories mit importance < 0.1 → löschen
  - Memories mit lastAccessed > 90 Tage → importance * 0.5
  - Maximum: 200 Memories pro User
```

### 6.6 Guardrails & Safety

1. **Keine Rechtsberatung**: Gemini gibt immer „Empfehlungen", nie „Anweisungen". Jeder Output enthält einen Disclaimer.
2. **Confidence-Threshold**: Analysen mit `confidence < 0.5` werden als „unsicher" markiert und lösen keine automatischen Aktionen aus.
3. **BoundaryConditions-Check**: Vor jeder exekutiven Aktion wird geprüft, ob sie innerhalb der Nutzer-Leitplanken liegt.
4. **Kill-Switch**: `BoundaryConditions.killSwitchActive = true` stoppt sofort alle autonomen Aktionen.
5. **Toxicity-Filter**: SafetySettings in der Modell-Konfiguration blockieren schädliche Inhalte.

---

# TEIL VI — UX/UI DESIGN SYSTEM

---

## Kapitel 7 — Sovereign Design System

### 7.1 Design-Philosophie: Cyber-Glassmorphism 2030

SOVEREIGN folgt nicht dem Standard-Material-You-Look. Unser Design vermittelt:
- **Tiefe** (Deep Navy/Space Black als Fundament)
- **Intelligenz** (Neon-Cyan/Purple als aktiver Energiefluss)
- **Transparenz** (Glassmorphism — semi-transparente Oberflächen)
- **Präsenz** (Pulsierende Auren zeigen, dass der Agent arbeitet)

**Inspiration aus Top-Banking-Apps:**

| App | Was wir übernehmen |
|-----|--------------------|
| **Revolut** | Feature-Dichte in klarem Layout, Transaction-Detail-Drill-Down, Insights-Cards |
| **N26** | Minimalismus, Spaces/Töpfe-Konzept, klare Bottom-Navigation |
| **Monzo** | Menschliche Sprache, Spending-Insights, Budgeting-Visualisierungen |
| **Mercury** | Business-Premium-Ästhetik, Typografie-Hierarchie, Dark-Mode-Exzellenz |
| **Nubank** | Einprägsame Markenfarbe (bei uns: Cyan), extreme Vereinfachung |
| **Chime** | Coaching-Nudges, Savings-Automation, Empathische Microcopy |

### 7.2 Farbpalette — Design-Tokens

```kotlin
// core/ui/src/main/java/com/sovereign/core/ui/theme/Color.kt

// ═══════════════════════════════════════════════════
// SOVEREIGN DESIGN TOKENS — Einzige Wahrheitsquelle
// ═══════════════════════════════════════════════════

// Fundament
val SovereignNavy        = Color(0xFF0A1628)   // Primärer Hintergrund
val SovereignSpaceBlack  = Color(0xFF050D18)   // Tiefster Hintergrund
val SovereignSurface     = Color(0xFF0F2035)   // Karten-Hintergrund

// Intelligenz-Farben
val SovereignCyan        = Color(0xFF00E5FF)   // Primärakzent: Analytik, Klarheit
val SovereignPurple      = Color(0xFFBB86FC)   // Sekundärakzent: Strategie, Vision
val SovereignTeal        = Color(0xFF00BFA5)   // Erfolg, Positive Ergebnisse

// Status-Farben
val SovereignGold        = Color(0xFFFFD600)   // Aufmerksamkeit, Savings
val SovereignPink        = Color(0xFFFF4081)   // Warnung, Risiko, Alerts
val SovereignRiskRed     = Color(0xFFFF1744)   // Kritisches Risiko
val SovereignSuccessGreen= Color(0xFF00E676)   // Erfolgreiche Aktion

// Glassmorphism
val GlassOverlay10       = Color(0x1AFFFFFF)   // 10% Weiß
val GlassOverlay20       = Color(0x33FFFFFF)   // 20% Weiß
val GlassBorder          = Color(0x40FFFFFF)   // 25% Weiß (Kanten)

// Text
val SovereignTextPrimary = Color(0xFFE0E0E0)   // Haupttext
val SovereignTextSecondary = Color(0xFF9E9E9E) // Sekundärtext
val SovereignTextOnAccent = Color(0xFF000000)  // Text auf Akzentfarben
```

### 7.3 Typografie

```kotlin
// Empfohlen: Inter (Open Source, geometric sans-serif)
// Alternativ: Space Grotesk (für Headlines — technischer Look)

val SovereignTypography = Typography(
    displayLarge = TextStyle(
        fontFamily = FontFamily.Default,   // → Inter, wenn eingebunden
        fontWeight = FontWeight.Bold,
        fontSize = 34.sp,
        letterSpacing = (-0.5).sp
    ),
    headlineMedium = TextStyle(
        fontWeight = FontWeight.SemiBold,
        fontSize = 24.sp,
        letterSpacing = 0.sp
    ),
    titleLarge = TextStyle(
        fontWeight = FontWeight.SemiBold,
        fontSize = 20.sp,
        letterSpacing = 0.15.sp
    ),
    bodyLarge = TextStyle(
        fontWeight = FontWeight.Normal,
        fontSize = 16.sp,
        letterSpacing = 0.5.sp,
        lineHeight = 24.sp
    ),
    bodyMedium = TextStyle(
        fontWeight = FontWeight.Normal,
        fontSize = 14.sp,
        letterSpacing = 0.25.sp
    ),
    labelLarge = TextStyle(
        fontWeight = FontWeight.Bold,
        fontSize = 14.sp,
        letterSpacing = 1.5.sp   // Weites Spacing für Labels
    )
)
```

### 7.4 Shape-System

```kotlin
val SovereignShapes = Shapes(
    small = RoundedCornerShape(8.dp),     // Chips, Badges
    medium = RoundedCornerShape(16.dp),   // Cards, Buttons
    large = RoundedCornerShape(24.dp),    // Bottom Sheets, Dialogs
    extraLarge = RoundedCornerShape(32.dp) // Full-Width Containers
)

// Spezial-Shapes
val PillShape = RoundedCornerShape(999.dp)  // Für StatusPills, TagPills
```

### 7.5 Navigation — Bottom Navigation (5 Tabs)

```
┌──────────────────────────────────────────────────┐
│                  SOVEREIGN                         │
│                 [Screen Content]                    │
│                                                    │
├──────────┬──────────┬──────────┬────────┬─────────┤
│ Dashboard│ Verträge │   Twin   │ Cases  │  Mehr   │
│   🏠     │   📄    │   🤖    │   📋  │   ⚙️   │
└──────────┴──────────┴──────────┴────────┴─────────┘
```

| Tab | Route | Screen | Beschreibung |
|-----|-------|--------|-------------|
| Dashboard | `/dashboard` | DashboardScreen | State-of-You, Alerts, Savings |
| Verträge | `/contracts` | ContractsScreen | Alle Verträge, Scan-FAB |
| Twin | `/terminal` | GeminiLiveTerminalScreen | Live-Chat mit KI + Kamera |
| Cases | `/cases` | LifeCasesScreen | Aktive Lebensfälle |
| Mehr | `/settings` | SettingsScreen | Config, Accounts, Security |

### 7.6 Dashboard-Layout: „State-of-You"

Inspiriert von Revolut (Feature-Dichte) + Monzo (menschliche Sprache):

```
┌──────────────────────────────────────────┐
│  SOVEREIGN        [Avatar] [Notification]│
├──────────────────────────────────────────┤
│                                          │
│  ╔══════════════════════════════════════╗ │
│  ║  Souveränitäts-Score: 87/100        ║ │
│  ║  ████████████████████░░░░  +3 ↑     ║ │
│  ║  3 offene Alerts · €47/Monat gespart║ │
│  ╚══════════════════════════════════════╝ │
│                                          │
│  ⚠️ FINANZ-ALERT                         │
│  ┌────────────────────────────────────┐  │
│  │ Netflix: €15.99 statt €12.99      │  │
│  │ +€3.00/Monat · Seit: 01.03.2026   │  │
│  │ [Widerspruch vorbereitet]  →       │  │
│  └────────────────────────────────────┘  │
│                                          │
│  🔄 AKTIVE CASES                         │
│  ┌────────────────────────────────────┐  │
│  │ Wasserschaden Bad · KRITISCH      │  │
│  │ Nächster Schritt: Gutachter-Termin │  │
│  │ Frist: 15.04.2026                  │  │
│  └────────────────────────────────────┘  │
│                                          │
│  💰 ERSPARNISSE                          │
│  ┌────────────────────────────────────┐  │
│  │ Diesen Monat: €127.50 gespart     │  │
│  │ Gesamt (YTD): €1,847.20           │  │
│  │ [Optimierungen ansehen] →          │  │
│  └────────────────────────────────────┘  │
│                                          │
│  🤖 AGENTEN-STATUS                       │
│  ┌────────────────────────────────────┐  │
│  │ Verhandlungs-Agent: Aktiv ●       │  │
│  │ Wechsel-Agent: Bereit ○           │  │
│  │ Claim-Agent: 1 Fall in Bearbeitung│  │
│  └────────────────────────────────────┘  │
│                                          │
└──────────────────────────────────────────┘
```

### 7.7 UI-Atome — Compose-Komponenten

**SovereignCard (Basis-Karte):**
```kotlin
@Composable
fun SovereignCard(
    modifier: Modifier = Modifier,
    glowColor: Color = SovereignCyan,
    showAura: Boolean = false,
    content: @Composable ColumnScope.() -> Unit
) {
    val auraAlpha by animateFloatAsState(
        targetValue = if (showAura) 0.15f else 0f,
        animationSpec = infiniteRepeatable(
            animation = tween(2000),
            repeatMode = RepeatMode.Reverse
        )
    )

    Card(
        modifier = modifier
            .then(if (showAura) Modifier.drawBehind {
                drawRoundRect(
                    color = glowColor.copy(alpha = auraAlpha),
                    cornerRadius = CornerRadius(24.dp.toPx()),
                    style = Stroke(width = 2.dp.toPx())
                )
            } else Modifier),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(
            containerColor = GlassOverlay10
        ),
        border = BorderStroke(1.dp, GlassBorder)
    ) {
        Column(modifier = Modifier.padding(16.dp), content = content)
    }
}
```

**RiskBadge:**
```kotlin
@Composable
fun RiskBadge(level: RiskLevel) {
    val (color, text) = when (level) {
        RiskLevel.LOW -> SovereignSuccessGreen to "Niedrig"
        RiskLevel.MEDIUM -> SovereignGold to "Mittel"
        RiskLevel.HIGH -> SovereignRiskRed to "Hoch"
    }
    Surface(
        shape = PillShape,
        color = color.copy(alpha = 0.15f),
        border = BorderStroke(1.dp, color.copy(alpha = 0.4f))
    ) {
        Text(
            text = text,
            color = color,
            style = MaterialTheme.typography.labelSmall,
            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
        )
    }
}
```

**SwipeToApprove:**
```kotlin
@Composable
fun SwipeToApprove(
    onApproved: () -> Unit,
    modifier: Modifier = Modifier
) {
    var offsetX by remember { mutableFloatStateOf(0f) }
    val maxOffset = 250.dp
    val threshold = 200.dp

    Box(
        modifier = modifier
            .fillMaxWidth()
            .height(56.dp)
            .background(SovereignSurface, RoundedCornerShape(28.dp))
            .pointerInput(Unit) {
                detectHorizontalDragGestures(
                    onDragEnd = {
                        if (offsetX > threshold.toPx()) onApproved()
                        offsetX = 0f
                    },
                    onHorizontalDrag = { _, dragAmount ->
                        offsetX = (offsetX + dragAmount).coerceIn(0f, maxOffset.toPx())
                    }
                )
            }
    ) {
        // Track
        Text(
            "Wischen zum Freigeben →",
            modifier = Modifier.align(Alignment.Center),
            color = SovereignTextSecondary
        )
        // Thumb
        Box(
            modifier = Modifier
                .offset { IntOffset(offsetX.roundToInt(), 0) }
                .size(48.dp)
                .align(Alignment.CenterStart)
                .padding(4.dp)
                .background(SovereignCyan, CircleShape),
            contentAlignment = Alignment.Center
        ) {
            Icon(Icons.Default.ChevronRight, null, tint = Color.Black)
        }
    }
}
```

**DeadlineChip:**
```kotlin
@Composable
fun DeadlineChip(deadline: Long) {
    val daysLeft = ((deadline - System.currentTimeMillis()) / 86_400_000).toInt()
    val color = when {
        daysLeft <= 3 -> SovereignRiskRed
        daysLeft <= 14 -> SovereignGold
        else -> SovereignTeal
    }
    Surface(
        shape = PillShape,
        color = color.copy(alpha = 0.1f)
    ) {
        Text(
            text = "Noch $daysLeft Tage",
            color = color,
            style = MaterialTheme.typography.labelSmall,
            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
        )
    }
}
```

### 7.8 Aura-Effekte & Motion

Der Agent zeigt Aktivität durch subtile Glow-Effekte:

```kotlin
@Composable
fun AgentAuraGlow(
    isActive: Boolean,
    color: Color = SovereignCyan,
    modifier: Modifier = Modifier
) {
    val alpha by animateFloatAsState(
        targetValue = if (isActive) 0.3f else 0f,
        animationSpec = infiniteRepeatable(
            tween(2000, easing = FastOutSlowInEasing),
            RepeatMode.Reverse
        )
    )
    Box(
        modifier = modifier
            .drawBehind {
                drawCircle(
                    brush = Brush.radialGradient(
                        colors = listOf(
                            color.copy(alpha = alpha),
                            Color.Transparent
                        )
                    ),
                    radius = size.maxDimension * 0.6f
                )
            }
    )
}
```

**Wann pulsiert die Aura?**
- `AgentStatus.ANALYZING_PORTFOLIO` → Cyan-Puls
- `AgentStatus.STRATEGIZING` → Purple-Puls
- `AgentStatus.NEGOTIATING` → Gold-Puls
- `AgentStatus.ALERT` → Pink-Puls (Risiko erkannt)

### 7.9 Microcopy-Richtlinien

| Situation | Schlecht | Gut (Sovereign-Stil) |
|-----------|---------|----------------------|
| Preiserhöhung | "Transaktionsabweichung" | "Netflix hat erhöht — sollen wir widersprechen?" |
| Analyse läuft | "Wird verarbeitet..." | "Dein Twin analysiert den Vertrag..." |
| Saving gefunden | "Optimierungspotenzial" | "€47 pro Monat sparen — ein Wechsel zu Anbieter X" |
| Freigabe nötig | "Aktion ausstehend" | "Deine Entscheidung: Kündigung absenden?" |
| Erfolg | "Aktion abgeschlossen" | "Erledigt. Du sparst jetzt €127/Jahr." |

Tonalität: **Senior-Advisor** — klar, sachlich, lösungsorientiert. Keine KI-Floskeln, keine übertriebene Freundlichkeit.

---

# TEIL VII — FEATURE-MODULE

---

## Kapitel 8 — Feature-Module — Atomar

### 8.1 Dashboard (`feature/dashboard/`)

Das größte Modul (16 Dateien). Dient als Haupt-Hub der App.

**DashboardScreen.kt (16 KB)**
- Animierte AI-Aura-Effekte mit pulsierendem Glow
- Negotiation-Status-Banner mit Skalierungs-Animation
- Abschnitte: Financial Alerts, Active Cases, Email Insights, Contract Analysis, Savings Summary
- Extended FAB für Vertrags-Scan
- Quick Approve/Reject-Buttons direkt im Dashboard
- Custom Theme-Farben (SovereignCyan, SovereignPurple, SovereignNavy, SovereignGold)

**GeminiLiveTerminalScreen.kt (13.8 KB)**
- Echtzeit-Chat-Interface mit Gemini AI
- Kamera-Vision-Toggle mit Permission-Handling
- Animierte Scan-Linien und Waveforms
- Kamera-Vorschau für Schadensdokumentation
- Chat-History mit differenziertem Styling (User vs. AI)
- Dark-Navy-Theme mit Cyan-Akzenten

**DocumentVaultScreen.kt (11 KB)**
- Dokumenten-Upload via File-Picker
- `DeepAnalysisView`-Composable für Gemini-Vertragsanalyse
- Klauselanalyse (Kündigungsbedingungen, Preisanpassungen)
- Marktvergleich-Button
- Dokumenten-Cards mit Status (OPTIMIZATION_FOUND, FAILED, SCANNED)
- Deutsche Sprache: "DOKUMENTEN-TRESOR", "HOCHLADEN"

**ExecutionCenterScreen.kt (10 KB)**
- EU AI Act Transparenz-Banner (Compliance by Design)
- Aktions-Status-Filterung (PENDING vs COMPLETED)
- `ActionExecutionCard` mit Typ-Icons (CANCELLATION, SWITCH, NEGOTIATION)
- Linearer Progress-Indicator während Ausführung
- Geschätzte Ersparnisse pro Aktion
- Biometrische Freigabe-Messaging

**Komponenten:**
| Komponente | Funktion |
|------------|----------|
| `ActiveAgentsCard` | Zeigt Status aller aktiven Agenten (Negotiation, Switching, Claim) |
| `EmailInsightCard` | E-Mail-basierte Erkenntnisse (Preiserhöhungen aus Inbox) |
| `FinancialAlertCard` | Pulsierend Neon-Pink bei unerwarteten Abbuchungen |
| `LifeCaseCard` | Kompakte Darstellung eines aktiven Lebensfalls |
| `SavingsSummaryCard` | Gesamt-Ersparnisse (Monat / YTD / Gesamt) |

### 8.2 Contracts (`feature/contracts/`)

**ContractsScreen.kt**
- LazyColumn mit Vertrags-Cards
- Loading-, Error- und Empty-States
- FloatingActionButton: "Vertrag hinzufügen"
- Error-Handling mit Retry-Button

**ContractsViewModel.kt**
```kotlin
@HiltViewModel
class ContractsViewModel @Inject constructor(
    private val getContractsUseCase: GetContractsUseCase,
    private val addContractUseCase: AddContractUseCase
) : ViewModel() {

    data class ContractsUiState(
        val isLoading: Boolean = false,
        val error: String? = null,
        val contracts: List<Contract> = emptyList()
    )

    private val _state = MutableStateFlow(ContractsUiState())
    val state: StateFlow<ContractsUiState> = _state.asStateFlow()

    init { loadContracts() }

    private fun loadContracts() {
        viewModelScope.launch {
            getContractsUseCase().collect { resource ->
                _state.value = when (resource) {
                    is Resource.Loading -> _state.value.copy(isLoading = true)
                    is Resource.Success -> _state.value.copy(
                        isLoading = false,
                        contracts = resource.data ?: emptyList()
                    )
                    is Resource.Error -> _state.value.copy(
                        isLoading = false,
                        error = resource.message
                    )
                }
            }
        }
    }
}
```

**AddContractScreen.kt** — Formular für manuelles Hinzufügen
**ContractDetailScreen.kt** — Detailansicht mit Clause Engine Ergebnissen

### 8.3 Approvals (`feature/approvals/`)

**ApprovalsScreen.kt**
- Approval-Queue mit Karten pro Request
- Anbieter-Info + geschätzte Ersparnis ("€X.XX Ersparnis")
- Approve/Reject-Buttons
- Grünes Farbschema für Savings-Indikatoren (#00C853)

**ApprovalDetailScreen.kt**
- Vollständige Aktions-Vorschau
- AI-generierte Erklärung warum die Aktion empfohlen wird
- Risikobewertung mit RiskBadge
- SwipeToApprove für finale Freigabe

### 8.4 Settings (`feature/settings/`)

**BoundaryConditionsScreen.kt — "Agenten-Leitplanken"**
- Finanzielle Grenzwert-Sliders (`maxAutoAmountEur`, `minSavingForSwitchEur`)
- NegotiationStrategy-Auswahl via FilterChips (CONSERVATIVE / MODERATE / AGGRESSIVE)
- Permission-Toggles: autonome Verhandlung, grüne Energie, biometrische Freigabe
- InfoCard mit Anleitungen
- Speichern-Button

**ConnectedAccountsScreen.kt** — Bank- und E-Mail-Anbindungen
**AgentConfigScreen.kt** — Agenten-spezifische Einstellungen
**PaymentSettingsScreen.kt** — Zahlungseinstellungen
**SecuritySettingsScreen.kt** — Biometrie, PIN, Datenlöschung

### 8.5 Claims (`feature/claims/`)

- Schadensfälle anzeigen und verwalten
- Schwerpunkt: Flugverspätungs-Claims (EU-Verordnung 261/2004)
- ClaimStatus-Tracking über 7 Stufen

### 8.6 Onboarding (`feature/onboarding/`)

- Ersteinrichtung mit Biometrie-Setup
- Permission-Anfragen (Kamera, Dateien)
- Kurzeinführung in die App-Konzepte
- Erster Vertragsscan als Wow-Moment

---

# TEIL VIII — BACKEND & DATENPERSISTENZ

---

## Kapitel 9 — Backend & Datenpersistenz

### 9.1 Backend-Architektur (FastAPI + Cloud Run)

**Aktueller Zustand:**
```python
# backend/main.py
from fastapi import FastAPI
from google.cloud import firestore

app = FastAPI()
db = firestore.Client()

@app.get("/contracts")
async def get_contracts():
    docs = db.collection("contracts").stream()
    return [doc.to_dict() for doc in docs]

@app.post("/contracts")
async def add_contract(contract: dict):
    db.collection("contracts").add(contract)
    return {"status": "created"}

@app.get("/approvals")
async def get_approvals():
    docs = db.collection("approvals").stream()
    return [doc.to_dict() for doc in docs]

@app.get("/claims")
async def get_claims():
    docs = db.collection("claims").stream()
    return [doc.to_dict() for doc in docs]
```

**Zielzustand (API v2.0):**

| Endpoint | Methode | Auth | Beschreibung |
|----------|---------|------|-------------|
| `/v2/contracts` | GET | Firebase Token | Alle Verträge des Users |
| `/v2/contracts` | POST | Firebase Token | Vertrag hinzufügen |
| `/v2/contracts/{id}` | GET | Firebase Token | Einzelner Vertrag |
| `/v2/contracts/{id}` | DELETE | Firebase Token | Vertrag löschen |
| `/v2/approvals` | GET | Firebase Token | Offene Freigaben |
| `/v2/approvals/{id}/approve` | POST | Firebase Token | Freigabe erteilen |
| `/v2/approvals/{id}/reject` | POST | Firebase Token | Freigabe ablehnen |
| `/v2/claims` | GET | Firebase Token | Alle Claims |
| `/v2/claims` | POST | Firebase Token | Claim einreichen |
| `/v2/insights` | GET | Firebase Token | Finanz-Erkenntnisse |
| `/v2/health` | GET | Keine | Healthcheck |

### 9.2 Firestore-Datenstruktur

```
firestore/
├── users/
│   └── {uid}/
│       ├── contracts/
│       │   └── {contractId}/
│       │       ├── provider: "Telekom"
│       │       ├── productName: "Magenta Zuhause L"
│       │       ├── monthlyPriceEur: 39.95
│       │       ├── category: "TELECOM"
│       │       ├── status: "ACTIVE"
│       │       ├── cancellationNoticeDays: 30
│       │       ├── autoRenewal: true
│       │       └── createdAt: Timestamp
│       │
│       ├── approvals/
│       │   └── {approvalId}/ ...
│       │
│       ├── claims/
│       │   └── {claimId}/ ...
│       │
│       ├── savings/
│       │   └── {savingId}/ ...
│       │
│       ├── documents/
│       │   └── {docId}/ ...
│       │
│       ├── lifeCases/
│       │   └── {caseId}/ ...
│       │
│       ├── agentMemories/
│       │   └── {memoryId}/ ...
│       │
│       ├── transactions/
│       │   └── {txId}/ ...
│       │
│       └── settings/
│           └── boundaryConditions: { ... }
│           └── profile: { ... }
```

### 9.3 Firestore Security Rules (Ziel)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Nur authentifizierte User
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null
                         && request.auth.uid == userId;
    }

    // Healthcheck
    match /health {
      allow read: if true;
    }
  }
}
```

### 9.4 Lokale Persistenz (Android)

| Speicher | Technologie | Zweck |
|----------|-------------|-------|
| Verträge (Cache) | Room Database | Offline-First, schnelle Abfragen |
| BoundaryConditions | DataStore (Proto) | Verschlüsselt, reaktiv (Flow) |
| AgentMemory | DataStore (Proto) | Verschlüsselt, schneller Zugriff |
| Dokumente | Interner Speicher | Scans, PDFs, verschlüsselt |
| Auth-Tokens | EncryptedSharedPreferences | Sicher im TEE |

### 9.5 Netzwerk-Layer (Ktor)

```kotlin
// core/data/remote/SovereignApiClient.kt
@Singleton
class SovereignApiClient @Inject constructor(
    private val auth: FirebaseAuth
) {
    private val client = HttpClient(OkHttp) {
        install(ContentNegotiation) { json(Json { ignoreUnknownKeys = true }) }
        install(Auth) {
            bearer {
                loadTokens {
                    val token = auth.currentUser?.getIdToken(false)?.await()?.token
                    BearerTokens(token ?: "", "")
                }
            }
        }
        defaultRequest {
            url("https://sovereign-backend-xxxxx.run.app/v2/")
            contentType(ContentType.Application.Json)
        }
    }
}
```

---

# TEIL IX — SECURITY & COMPLIANCE

---

## Kapitel 10 — Security & Compliance

### 10.1 Biometrischer Hochschutz

Die `SecurityManager`-Klasse (`core/common/SecurityManager.kt`) ist ein Hilt-Singleton, das den Android `BiometricPrompt` wrappet:

```kotlin
@Singleton
class SecurityManager @Inject constructor(
    @ApplicationContext private val context: Context
) {
    fun canAuthenticate(): Boolean {
        val biometricManager = BiometricManager.from(context)
        return biometricManager.canAuthenticate(
            BiometricManager.Authenticators.BIOMETRIC_STRONG
                or BiometricManager.Authenticators.DEVICE_CREDENTIAL
        ) == BiometricManager.BIOMETRIC_SUCCESS
    }

    fun authenticate(
        activity: FragmentActivity,
        title: String = "Identität bestätigen",
        subtitle: String = "Sovereign benötigt deine Freigabe",
        onSuccess: () -> Unit,
        onError: (String) -> Unit
    ) {
        val executor = ContextCompat.getMainExecutor(activity)
        val prompt = BiometricPrompt(activity, executor,
            object : BiometricPrompt.AuthenticationCallback() {
                override fun onAuthenticationSucceeded(result: BiometricPrompt.AuthenticationResult) {
                    onSuccess()
                }
                override fun onAuthenticationError(errorCode: Int, errString: CharSequence) {
                    onError(errString.toString())
                }
                override fun onAuthenticationFailed() {
                    onError("Authentifizierung fehlgeschlagen")
                }
            })

        val info = BiometricPrompt.PromptInfo.Builder()
            .setTitle(title)
            .setSubtitle(subtitle)
            .setAllowedAuthenticators(
                BiometricManager.Authenticators.BIOMETRIC_STRONG
                    or BiometricManager.Authenticators.DEVICE_CREDENTIAL
            )
            .build()

        prompt.authenticate(info)
    }
}
```

### 10.2 Biometrie-Gates — Wann wird Biometrie erzwungen?

| Aktion | Gate-Stufe | Erklärung |
|--------|-----------|-----------|
| App öffnen | Immer | Zero-Knowledge-Zugang |
| Vertrag einsehen | Nie | Bereits authentifiziert |
| Kündigung absenden | Immer | High-Stakes, irreversibel |
| E-Mail-Entwurf senden | Immer | Externe Kommunikation |
| Einstellungen ändern | Bei `requireBiometricForAll` | Konfigurierbar |
| Claim einreichen | Immer | Rechtliche Konsequenz |
| Kill-Switch aktivieren | Nie | Sofortige Sicherheitsmaßnahme |
| Daten löschen | Doppelt (2x Biometrie) | Irreversibel |

### 10.3 Datenschutz — Local-First-Strategie

1. **Verschlüsselter Portfolio-Kontext:** Alle persönlichen Daten werden lokal gespeichert und durch Jetpack DataStore mit `EncryptedFile` gesichert.
2. **Sicheres Kontext-Streaming:** Wenn Daten an Gemini gesendet werden, geschieht dies über verschlüsselte End-to-End-Verbindung via Vertex AI. Keine dauerhafte Speicherung auf Servern.
3. **Data Minimization:** Nur die für den aktuellen AI-Call relevanten Daten werden gesendet (Top-10 Memories, relevante Verträge).
4. **Löschbarkeit:** "Sovereign, lösche alle meine Daten" → atomare Bereinigung (lokal + Cloud).

### 10.4 EU AI Act Compliance

| Anforderung | Implementierung |
|-------------|----------------|
| Transparenz | ExecutionCenterScreen zeigt EU AI Act-Banner |
| Erklärbarkeit | Jede AI-Empfehlung enthält `insights[]` mit Begründung |
| Audit-Trail | `ActionLog` in `OptimizationAction` + `AuditReportScreen` |
| Menschliche Aufsicht | Human-in-the-Loop via `ApprovalRequest` für alle High-Risk-Aktionen |
| Datenschutz | Local-First, Data Minimization, Löschkonzept |

---

# TEIL X — QUALITÄT & TESTING

---

## Kapitel 11 — Testing & Qualität

### 11.1 Test-Pyramide

```
              ┌─────────────┐
              │   E2E/UI    │  10% — Espresso + Compose Testing
              │   Tests     │
              ├─────────────┤
              │ Integration │  30% — Hilt + FakeRepositories
              │   Tests     │
              ├─────────────┤
              │  Unit Tests │  60% — JVM-only, schnell
              │             │
              └─────────────┘
```

### 11.2 Unit-Test-Beispiele

**ContractAnalyzer-Test:**
```kotlin
class GeminiContractAnalyzerTest {

    private val fakeModel = FakeGenerativeModel(
        response = """
            {
                "provider": "Telekom",
                "productName": "Magenta Zuhause L",
                "category": "TELECOM",
                "monthlyPriceEur": 39.95,
                "cancellationNoticeDays": 30,
                "autoRenewal": true,
                "autoRenewalMonths": 12,
                "indexationClause": false,
                "riskLevel": "MEDIUM",
                "insights": [
                    {
                        "title": "Auto-Verlängerung erkannt",
                        "description": "Vertrag verlängert sich automatisch um 12 Monate",
                        "type": "RISK_DETECTED"
                    }
                ],
                "confidence": 0.87
            }
        """.trimIndent()
    )

    private val analyzer = GeminiContractAnalyzer(fakeModel)

    @Test
    fun `analyzeDocument returns parsed contract data from Gemini`() = runTest {
        val context = AgentContext(
            relevantMemories = emptyList(),
            activeContracts = emptyList(),
            recentTransactions = emptyList(),
            activeCases = emptyList(),
            boundaryConditions = BoundaryConditions()
        )

        val result = analyzer.analyzeDocument("Telekom Vertrag...", context)

        assertTrue(result.isSuccess)
        val analysis = result.getOrThrow()
        assertEquals("Telekom", analysis.provider)
        assertEquals(39.95, analysis.monthlyPriceEur, 0.01)
        assertEquals(RiskLevel.MEDIUM, analysis.riskLevel)
        assertEquals(1, analysis.insights.size)
        assertTrue(analysis.confidence > 0.8)
    }

    @Test
    fun `analyzeDocument handles empty response`() = runTest {
        val emptyModel = FakeGenerativeModel(response = null)
        val analyzer = GeminiContractAnalyzer(emptyModel)

        val result = analyzer.analyzeDocument("...", context)

        assertTrue(result.isFailure)
        assertTrue(result.exceptionOrNull()?.message?.contains("Leere Antwort") == true)
    }
}
```

**ViewModel-Test:**
```kotlin
@OptIn(ExperimentalCoroutinesApi::class)
class ContractsViewModelTest {

    @get:Rule
    val mainDispatcherRule = MainDispatcherRule()

    private val fakeRepo = FakeContractRepository()
    private val getContractsUseCase = GetContractsUseCase(fakeRepo)
    private val addContractUseCase = AddContractUseCase(fakeRepo)

    @Test
    fun `initial state loads contracts`() = runTest {
        fakeRepo.setContracts(listOf(testContract))

        val viewModel = ContractsViewModel(getContractsUseCase, addContractUseCase)

        advanceUntilIdle()

        val state = viewModel.state.value
        assertFalse(state.isLoading)
        assertNull(state.error)
        assertEquals(1, state.contracts.size)
        assertEquals("Telekom", state.contracts[0].provider)
    }
}
```

### 11.3 Integration-Test-Beispiel

```kotlin
@HiltAndroidTest
class ContractAnalysisIntegrationTest {

    @get:Rule
    val hiltRule = HiltAndroidRule(this)

    @Inject
    lateinit var analyzer: ContractAnalyzer

    @Before
    fun setup() { hiltRule.inject() }

    @Test
    fun contractScanToInsightFlow() = runTest {
        val vertragText = """
            Vertrag: Magenta Zuhause L
            Anbieter: Telekom
            Monatlicher Preis: 39,95 EUR
            Kündigungsfrist: 1 Monat zum Vertragsende
            Automatische Verlängerung: 12 Monate
        """.trimIndent()

        val result = analyzer.analyzeDocument(vertragText, testContext)

        assertTrue(result.isSuccess)
        val analysis = result.getOrThrow()
        assertEquals("Telekom", analysis.provider)
        assertTrue(analysis.insights.any { it.type == InsightType.RISK_DETECTED })
    }
}
```

### 11.4 UI-Test-Beispiel (Compose)

```kotlin
class DashboardScreenTest {

    @get:Rule
    val composeRule = createComposeRule()

    @Test
    fun financialAlertCardIsDisplayedWhenAlertExists() {
        composeRule.setContent {
            SovereignTheme {
                FinancialAlertCard(
                    insight = FinancialInsight(
                        type = InsightType.PRICE_INCREASE,
                        merchantName = "Netflix",
                        amount = 15.99,
                        previousAmount = 12.99,
                        description = "Preiserhöhung erkannt",
                        timestamp = System.currentTimeMillis(),
                        isActionable = true
                    )
                )
            }
        }

        composeRule.onNodeWithText("Netflix").assertIsDisplayed()
        composeRule.onNodeWithText("15.99").assertIsDisplayed()
    }
}
```

### 11.5 Performance-Targets

| Metrik | Ziel | Messung |
|--------|------|---------|
| Cold Start | < 2.0s | Firebase Performance |
| Screen Transition | < 300ms | Compose Benchmark |
| AI-Response (Vertragsanalyse) | < 5s | Custom Timer |
| Biometric Auth | < 1s | System-Callback |
| APK-Größe (minified) | < 30 MB | Gradle Build |
| Compose Recomposition | 0 unnötige | Layout Inspector |

---

## Kapitel 12 — CI/CD & DevOps

### 12.1 Pipeline-Übersicht

```
┌─────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  Push /  │───→│   Lint   │───→│  Build   │───→│  Test    │
│  PR      │    │ ktlint   │    │  Debug   │    │ Unit +   │
│          │    │ detekt   │    │          │    │ Integ.   │
└─────────┘    └──────────┘    └──────────┘    └──────────┘
                                                     │
                                                     ▼
                                               ┌──────────┐
                                               │ Release   │
                                               │ Build +   │
                                               │ Sign      │
                                               └──────────┘
                                                     │
                                                     ▼
                                               ┌──────────┐
                                               │ Firebase  │
                                               │ App Dist  │
                                               │ (Beta)    │
                                               └──────────┘
```

### 12.2 GitHub Actions Workflow

```yaml
# .github/workflows/ci.yml
name: SOVEREIGN CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          java-version: '17'
          distribution: 'temurin'
      - run: ./gradlew ktlintCheck detekt

  build:
    needs: lint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          java-version: '17'
          distribution: 'temurin'
      - run: ./gradlew assembleDebug

  test:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          java-version: '17'
          distribution: 'temurin'
      - run: ./gradlew testDebugUnitTest
      - uses: actions/upload-artifact@v4
        with:
          name: test-results
          path: '**/build/reports/tests/'
```

### 12.3 Backend-Deployment (Cloud Run)

```yaml
# .github/workflows/deploy-backend.yml
name: Deploy Backend

on:
  push:
    branches: [main]
    paths: ['backend/**']

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: google-github-actions/auth@v2
        with:
          credentials_json: ${{ secrets.GCP_SA_KEY }}
      - uses: google-github-actions/deploy-cloudrun@v2
        with:
          service: sovereign-backend
          source: backend/
          region: europe-west1
```

---

# TEIL XI — ROADMAP & MONETARISIERUNG

---

## Kapitel 13 — Roadmap

### Phase 0: Foundation Fix (Aktueller Sprint)

| Task | Priorität | Status |
|------|-----------|--------|
| Gemini-Modell updaten (`gemini-2.5-flash`) | P0 | ⬜ |
| GeminiContractAnalyzer: Echtes JSON-Parsing | P0 | ⬜ |
| GeminiLiveAgentImpl: Echte Chat-Session | P0 | ⬜ |
| Backend: Firebase Auth Middleware | P1 | ⬜ |
| Altes Package `com.yildirim.soverein` löschen | P1 | ⬜ |
| Release-Build: `isMinifyEnabled = true` | P1 | ⬜ |
| Dependency-Versionen aktualisieren | P2 | ⬜ |

### Phase 1: Core Intelligence (Sprint 2-3)

| Task | Beschreibung |
|------|-------------|
| Finance Guardian Engine | Bank-Stream-Anbindung, Anomalie-Erkennung, Preiserhöhungs-Alarm |
| Clause Intelligence Engine | Vollständige Klausel-Extraktion aus PDFs mit Gemini |
| Memory Management | Implementierung der Memory-Strategie (Create, Update, Prune) |
| Portfolio-Kontext V2 | Dynamischer Kontext-Builder für alle AI-Calls |

### Phase 2: Execution & Automation (Sprint 4-5)

| Task | Beschreibung |
|------|-------------|
| Gmail API Bridge | Echte E-Mail-Entwürfe erstellen und in Drafts legen |
| Approval Workflow V2 | Biometrische Gates, Rollback, Audit-Logging |
| Life-Case Playbooks | Templates für: Wasserschaden, Mietminderung, B2B-Mahnung |
| Professional Shield Mode | B2B-Modus mit Mahnwesen und Liquiditätsplanung |

### Phase 3: Polish & Launch (Sprint 6-8)

| Task | Beschreibung |
|------|-------------|
| Design System V2 | Vollständige Glassmorphism-Implementierung |
| Onboarding 2.0 | Geführter Erststart mit Wow-Moment (erster Scan) |
| Accessibility | Screen Reader, Textskalierung, Kontrastmodus |
| Internationalisierung | DE + EN vollständig |
| Performance-Optimierung | Cold Start < 2s, alle Targets einhalten |
| Beta-Launch | Firebase App Distribution → 100 Beta-Tester |

---

## Kapitel 14 — Monetarisierung & Pricing

### 14.1 Revenue-Modell: Hybrid (Freemium + Success-Fee + Micro-Transactions)

**Ethische Grundregel:** SOVEREIGN verdient NIE an Vertragsabschlüssen oder Vermittlungen. Null Provisionen. Wir verkaufen Service, nicht Verträge. Das Vertrauen ist die Währung.

```
┌──────────────────────────────────────────────────────────────────┐
│                     SOVEREIGN PRICING                             │
├──────────────────┬─────────────────────┬─────────────────────────┤
│  FREE            │  SOVEREIGN PRO      │  SOVEREIGN SHIELD       │
│  €0/Monat        │  €6.99/Monat        │  €14.99/Monat           │
├──────────────────┼─────────────────────┼─────────────────────────┤
│ 3 Verträge       │ Unbegrenzt          │ Unbegrenzt              │
│ Basis-Scan       │ Deep Clause Engine  │ Deep Clause Engine      │
│ 1 Life-Case      │ 5 Life-Cases        │ Unbegrenzte Life-Cases  │
│ Dashboard        │ Finance Guardian    │ Finance Guardian        │
│ 5 AI-Chats/Tag   │ 50 AI-Chats/Tag    │ Unbegrenzte AI-Chats    │
│ —                │ E-Mail-Analyse      │ E-Mail-Analyse          │
│ —                │ Vertrags-Radar      │ Vertrags-Radar          │
│ —                │ Kalender-Sync       │ Kalender-Sync           │
│ —                │ Widget (Glance)     │ Widget (Glance)         │
│ —                │ —                   │ Execution Engine (Gmail) │
│ —                │ —                   │ Bank-Anbindung (PSD2)   │
│ —                │ —                   │ Professional Shield (B2B)│
│ —                │ —                   │ Multi-User / Familie     │
│ —                │ —                   │ Gemini Live (Voice+Cam)  │
│ —                │ —                   │ Priority Support         │
├──────────────────┴─────────────────────┴─────────────────────────┤
│  ZUSÄTZLICH: Success-Fee bei Claims                               │
│  25% der erzielten Kompensation — NUR bei Erfolg                  │
│  Kein Risiko für den Nutzer                                       │
│                                                                    │
│  ZUSÄTZLICH: Einmal-Services (Micro-Transactions)                 │
│  Premium-Kündigung per Einschreiben: €4.99                        │
│  Rechtssichere Vorlage (Mängelanzeige etc.): €2.99               │
└──────────────────────────────────────────────────────────────────┘
```

**Warum diese Tiers?**
- **Free** holt User rein. 3 Verträge + Dashboard = Wow-Moment in 60 Sekunden
- **PRO (€6.99)** ist der Sweet-Spot: günstiger als N26 Smart (€4.90 hat weniger Features), Revolut Premium (€7.99)
- **SHIELD (€14.99)** für Power-User und Gewerbe: vergleichbar mit N26 Metal (€16.90), aber mit echtem AI-Mehrwert
- **Success-Fee (25%)** ist risikofrei für den User und potentiell hochprofitabel (Flugverspätungen: €250-600/Fall)

### 14.2 Zahlungsarten & Billing

| Methode | Implementierung | Zweck |
|---------|----------------|-------|
| **Google Play Billing** | Play Billing Library 7.x | Subscriptions (PRO, SHIELD) — 10% Gebühr ab Juni 2026 |
| **Stripe** | Web-Checkout + API | Einmal-Services, Web-App Subscriptions |
| **SEPA-Lastschrift** | Via Stripe | B2B / Professional Shield |
| **PayPal** | Via Stripe | Vertrauensfaktor im deutschen Markt |

### 14.3 Umsatz-Prognose (konservativ)

| Phase | User | PRO (12%) | SHIELD (3%) | MRR | Claims-Fee | Gesamt MRR |
|-------|------|-----------|-------------|-----|------------|------------|
| MVP (6 Mo) | 1.000 | 120 | 20 | €1.140 | €300 | **€1.440** |
| Wachstum (12 Mo) | 10.000 | 1.200 | 300 | €12.890 | €3.000 | **€15.890** |
| Scale (24 Mo) | 50.000 | 7.500 | 2.500 | €89.900 | €15.000 | **€104.900** |

---

# TEIL XII — ANHANG

---

---

# TEIL XIII — PLATTFORM-ARCHITEKTUR

---

## Kapitel 15 — Plattform-Architektur — Unified GCP Backend

### 15.1 Die Plattform-Vision

SOVEREIGN ist nicht nur eine App — es ist eine **Plattform**. Ein einziges Backend auf Google Cloud Platform bedient drei Clients:

```
                    ┌──────────────────────────────┐
                    │     SOVEREIGN PLATFORM        │
                    │     (Google Cloud Platform)    │
                    │                                │
                    │  ┌──────────────────────────┐  │
                    │  │   Unified API (FastAPI)   │  │
                    │  │   Cloud Run (autoscale)   │  │
                    │  └────────┬─────────────────┘  │
                    │           │                     │
                    │  ┌────────┼─────────────────┐  │
                    │  │        │                  │  │
                    │  ▼        ▼                  ▼  │
                    │ Firestore  Firebase Auth  Vertex AI │
                    │ (Daten)   (Identity)    (Gemini)    │
                    │                                │
                    └────────────┬───────────────────┘
                                 │
                    ┌────────────┼────────────────┐
                    │            │                │
                    ▼            ▼                ▼
            ┌──────────┐ ┌──────────┐ ┌────────────────┐
            │ Mobile   │ │ Web App  │ │ Landing Page   │
            │ Android  │ │ Next.js  │ │ Next.js (SSR)  │
            │ Kotlin   │ │ React    │ │ + Blog/Content │
            │ Compose  │ │ Firebase │ │ Firebase       │
            │          │ │ Hosting  │ │ Hosting + CDN  │
            └──────────┘ └──────────┘ └────────────────┘
```

### 15.2 Technologie-Stack (Plattform-weit)

| Komponente | Technologie | Hosting | Zweck |
|------------|-------------|---------|-------|
| **Unified API** | FastAPI (Python) | Cloud Run | REST API für alle Clients |
| **Datenbank** | Firestore | GCP | Shared data layer |
| **Auth** | Firebase Authentication | GCP | Shared identity (Google, Apple, E-Mail) |
| **AI** | Vertex AI (Gemini) | GCP | Vertragsanalyse, Grounding, Live |
| **Mobile App** | Kotlin + Jetpack Compose | Play Store | Android-Client |
| **Web App** | Next.js 15 + React + TypeScript | Firebase Hosting | Browser-Client |
| **Landing Page** | Next.js 15 (SSR) + MDX | Firebase Hosting | Marketing + SEO + Blog |
| **CDN** | Cloud CDN | GCP | Statische Assets, globale Auslieferung |
| **Analytics** | Firebase Analytics + GA4 | GCP | Cross-Platform Tracking |
| **Monitoring** | Cloud Monitoring + Crashlytics | GCP | Uptime, Errors, Performance |
| **CI/CD** | GitHub Actions | GitHub | Build, Test, Deploy |
| **Domain** | `sovereign.de` / `sovereign.app` | Cloud DNS | Apex + Subdomains |

### 15.3 Domain-Struktur

```
sovereign.de                    → Landing Page (Marketing, SEO)
├── sovereign.de/blog/          → Pillar & Cluster Content (SSR, SEO)
├── sovereign.de/preise/        → Pricing Page
├── sovereign.de/sicherheit/    → Trust & Security Page
├── sovereign.de/business/      → Professional Shield Landing
│
app.sovereign.de                → Web App (SPA, hinter Login)
├── app.sovereign.de/dashboard  → Dashboard
├── app.sovereign.de/contracts  → Verträge
├── app.sovereign.de/terminal   → Gemini Twin Chat
│
api.sovereign.de                → Unified API (Cloud Run)
├── api.sovereign.de/v2/*       → REST Endpoints
│
status.sovereign.de             → Statuspage (Uptime)
```

### 15.4 Unified API — Ein Backend für alle Clients

```python
# backend/main.py — Erweitert für Plattform

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="SOVEREIGN Platform API", version="2.0.0")

# CORS für Web App + Landing Page
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://sovereign.de",
        "https://app.sovereign.de",
        "http://localhost:3000",  # Dev
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Shared Endpoints (Mobile + Web)
app.include_router(contracts_router, prefix="/v2/contracts")
app.include_router(approvals_router, prefix="/v2/approvals")
app.include_router(claims_router, prefix="/v2/claims")
app.include_router(finance_router, prefix="/v2/finance")
app.include_router(ai_router, prefix="/v2/ai")
app.include_router(user_router, prefix="/v2/user")

# Web-only Endpoints
app.include_router(billing_router, prefix="/v2/billing")  # Stripe
app.include_router(family_router, prefix="/v2/family")     # Multi-User

# Public Endpoints (Landing Page)
app.include_router(public_router, prefix="/v2/public")     # Pricing, Stats
```

### 15.5 Shared Authentication Flow

```
Mobile App:                        Web App:
Firebase Auth SDK (Android)        Firebase Auth SDK (JS)
         │                                  │
         ▼                                  ▼
    Firebase ID Token              Firebase ID Token
         │                                  │
         └──────────┬───────────────────────┘
                    │
                    ▼
            Authorization: Bearer <token>
                    │
                    ▼
           ┌─────────────────┐
           │  Unified API    │
           │  verify_token() │
           │  → uid, email   │
           └─────────────────┘
```

Identische User-Accounts über Mobile und Web. Ein User loggt sich auf dem Handy ein, öffnet die Web-App → gleiche Daten, gleicher Zustand.

### 15.6 Repository-Struktur (Plattform-weit)

```
SOVEREIGN/                              ← Mono-Repo oder Multi-Repo
├── android/                            ← Bestehendes SOVEREIGN-Android
│   ├── app/
│   ├── core/
│   ├── feature/
│   └── build.gradle.kts
│
├── web/                                ← NEU: Web App
│   ├── src/
│   │   ├── app/                        ← Next.js App Router
│   │   │   ├── (auth)/                 ← Login, Register
│   │   │   ├── dashboard/              ← Dashboard Page
│   │   │   ├── contracts/              ← Verträge
│   │   │   ├── terminal/               ← Gemini Chat
│   │   │   └── settings/               ← Einstellungen
│   │   ├── components/                 ← Shared UI Components
│   │   │   ├── SovereignCard.tsx
│   │   │   ├── RiskBadge.tsx
│   │   │   └── SwipeToApprove.tsx
│   │   ├── lib/                        ← API Client, Auth, Utils
│   │   └── styles/                     ← Tailwind + Design Tokens
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   └── package.json
│
├── landing/                            ← NEU: Marketing-Website
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx                ← Hero + Value Proposition
│   │   │   ├── preise/page.tsx         ← Pricing
│   │   │   ├── sicherheit/page.tsx     ← Trust & Security
│   │   │   ├── business/page.tsx       ← Professional Shield
│   │   │   └── blog/                   ← MDX Blog (Pillar & Cluster)
│   │   │       ├── [slug]/page.tsx     ← Blog-Post (SSR)
│   │   │       └── layout.tsx
│   │   ├── components/                 ← Marketing Components
│   │   └── content/                    ← MDX Blog-Posts
│   ├── next.config.ts
│   └── package.json
│
├── backend/                            ← Erweitert: Unified API
│   ├── app/
│   │   ├── main.py                     ← FastAPI App
│   │   ├── routers/                    ← contracts, approvals, ai, billing
│   │   ├── middleware/                 ← auth, cors, rate-limiting
│   │   ├── services/                   ← Gemini, finAPI, Stripe
│   │   └── models/                     ← Pydantic Models
│   ├── tests/
│   ├── requirements.txt
│   └── Dockerfile
│
├── shared/                             ← Geteilte Definitionen
│   ├── api-schema.yaml                 ← OpenAPI 3.1 Spec
│   └── design-tokens.json             ← Farben, Typo (Mobile + Web)
│
└── infra/                              ← Infrastructure as Code
    ├── terraform/                      ← GCP Resources
    └── firebase/
        ├── firestore.rules
        ├── hosting-web.json
        └── hosting-landing.json
```

---

# TEIL XIV — WEB-APP

---

## Kapitel 16 — Web-App (app.sovereign.de)

### 16.1 Zweck der Web-App

Die Web-App ist der **Desktop-Companion** zur Mobile App. Gleiche Features, optimiert für größere Bildschirme. Hauptnutzen:

1. **Vertragsmanagement am Desktop** — PDF-Upload, Deep Clause Explorer mit Side-by-Side-View
2. **Life-Case-Bearbeitung** — Timeline, Beweismittel, Korrespondenz-Entwürfe am großen Screen
3. **Finance Dashboard** — Cashflow-Charts, Transaktions-Übersicht
4. **Gemini Chat** — Text-Chat im Browser (kein Kamera/Voice — das bleibt Mobile-exklusiv)

### 16.2 Technologie-Entscheidung

| Option | Vorteile | Nachteile | Entscheidung |
|--------|---------|-----------|-------------|
| **Next.js 15 (App Router)** | SSR, SEO, React, TypeScript, Firebase-kompatibel | Learning Curve | **GEWÄHLT** |
| Flutter Web | Code-Sharing mit hypothetischem iOS | Performance, SEO schlecht | Nein |
| Kotlin Multiplatform (Compose Web) | Code-Sharing mit Android | Noch unreif für Production | Nein |

**Warum Next.js?**
- Server-Side Rendering für Login/Public-Pages → SEO
- Firebase Auth JS SDK → identisches Auth wie Mobile
- Tailwind CSS → schnell, consistent mit Design-Tokens
- Vercel-kompatibel ODER Firebase Hosting
- Größtes Ökosystem für Web-Development

### 16.3 Design: Glassmorphism im Browser

Die Web-App verwendet **identische Design-Tokens** wie die Mobile App:

```typescript
// web/src/styles/tokens.ts — generiert aus shared/design-tokens.json

export const colors = {
  navy:          '#0A1628',
  spaceBlack:    '#050D18',
  surface:       '#0F2035',
  cyan:          '#00E5FF',
  purple:        '#BB86FC',
  teal:          '#00BFA5',
  gold:          '#FFD600',
  pink:          '#FF4081',
  riskRed:       '#FF1744',
  successGreen:  '#00E676',
  glass10:       'rgba(255,255,255,0.10)',
  glass20:       'rgba(255,255,255,0.20)',
  glassBorder:   'rgba(255,255,255,0.25)',
  textPrimary:   '#E0E0E0',
  textSecondary: '#9E9E9E',
} as const;
```

```css
/* Tailwind-Erweiterung für Glassmorphism */
.glass-card {
  @apply bg-white/10 backdrop-blur-xl border border-white/25 rounded-2xl;
}
.aura-glow {
  box-shadow: 0 0 40px rgba(0, 229, 255, 0.15);
}
```

### 16.4 Feature-Parität Mobile vs. Web

| Feature | Mobile | Web | Grund |
|---------|--------|-----|-------|
| Dashboard | ✅ | ✅ | Kern |
| Verträge verwalten | ✅ | ✅ | Kern |
| Deep Clause Explorer | ✅ | ✅ (besser — Side-by-Side) | Desktop-Vorteil |
| PDF-Upload & Scan | ✅ (Kamera) | ✅ (File-Upload) | Kern |
| Gemini Text-Chat | ✅ | ✅ | Kern |
| Gemini Voice | ✅ | — | Mobile-exklusiv |
| Gemini Kamera (Video) | ✅ | — | Mobile-exklusiv |
| Life-Cases | ✅ | ✅ (besser — Timeline-View) | Desktop-Vorteil |
| Finance Dashboard | ✅ | ✅ (besser — Charts) | Desktop-Vorteil |
| Approvals | ✅ | ✅ | Kern |
| Settings | ✅ | ✅ | Kern |
| Multi-User Verwaltung | ✅ | ✅ (Admin-Panel) | Desktop-Vorteil |
| Push-Notifications | ✅ (FCM) | ✅ (Web Push) | Kern |
| Biometrie | ✅ (Face/Finger) | WebAuthn/Passkeys | Äquivalent |
| Widget | ✅ (Glance) | — | Mobile-exklusiv |
| Bank-Anbindung | ✅ | ✅ (finAPI Web-Form) | Kern |

---

# TEIL XV — LANDING PAGE & MARKETING-WEBSITE

---

## Kapitel 17 — Landing Page & Marketing-Website (sovereign.de)

### 17.1 Zweck

Die Landing Page hat drei Aufgaben:
1. **Conversion**: Besucher → App-Download oder Web-App-Registrierung
2. **Trust**: Professionelle Präsenz, Sicherheitsversprechen, Social Proof
3. **SEO/Content**: Organischer Traffic durch Pillar & Cluster Content

### 17.2 Sitemap (Seiten-Struktur)

```
sovereign.de/
├── /                           ← Hero + Value Proposition + CTA
├── /funktionen/                ← Feature-Übersicht (alle Module)
│   ├── /funktionen/vertragsscanner/    ← Deep-Dive: Clause Engine
│   ├── /funktionen/finanzwaechter/     ← Deep-Dive: Finance Guardian
│   ├── /funktionen/life-cases/         ← Deep-Dive: Life-Case Management
│   └── /funktionen/ki-assistent/       ← Deep-Dive: Gemini Twin
├── /preise/                    ← Pricing (Free / PRO / SHIELD)
├── /sicherheit/                ← Datenschutz, Biometrie, EU AI Act
├── /business/                  ← Professional Shield Landing (B2B)
├── /ueber-uns/                 ← Team, Mission, Story
├── /blog/                      ← Pillar & Cluster Content Hub
│   ├── /blog/vertrag-kuendigen/               ← Pillar Page
│   ├── /blog/preiserhoehung-widersprechen/    ← Pillar Page
│   ├── /blog/mietminderung-berechnen/         ← Pillar Page
│   ├── /blog/[slug]/                          ← Cluster-Artikel
│   └── ...
├── /presse/                    ← Pressemitteilungen, Media Kit
├── /impressum/                 ← Legal (Pflicht DE)
├── /datenschutz/               ← Datenschutzerklärung (Pflicht DE)
└── /agb/                       ← Allgemeine Geschäftsbedingungen
```

### 17.3 Hero-Section Design

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  [Sovereign Logo — Neon Cyan auf Deep Navy]                  │
│                                                              │
│                                                              │
│     Dein digitaler Zwilling für                              │
│     finanzielle Souveränität.                                │
│                                                              │
│     SOVEREIGN analysiert deine Verträge,                     │
│     erkennt versteckte Kosten und handelt                    │
│     autonom in deinem Interesse.                             │
│                                                              │
│     [Kostenlos starten →]  [App herunterladen →]             │
│                                                              │
│     ┌──────────────────────────────────┐                     │
│     │  [Animated Mockup: Phone + Web]  │                     │
│     │  Dashboard mit Aura-Glow-Effekt  │                     │
│     └──────────────────────────────────┘                     │
│                                                              │
│  Vertraut von X Nutzern · €Y Mio. gespart · Z Verträge      │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### 17.4 Trust-Signale (kritisch für Fintech)

| Signal | Position | Zweck |
|--------|---------|-------|
| **"Keine Provisionen. Nur dein Interesse."** | Hero-Subline | Differenzierung zu Check24 |
| **Logos: Google Cloud, Firebase, Gemini** | Below Hero | Technologie-Vertrauen |
| **EU AI Act-konform** | Sicherheitsseite + Footer | Regulierungs-Compliance |
| **Datenschutz: Local-First** | Sicherheitsseite | DSGVO-Bewusstsein |
| **Trustpilot / Play Store Rating** | Social Proof-Section | Nutzerbewertungen |
| **Impressum + Datenschutz** | Footer | Gesetzliche Pflicht (DE) |

### 17.5 Conversion-Funnel

```
Organischer Traffic (SEO/Blog)
         │
         ▼
Landing Page (sovereign.de)
         │
    ┌────┼────┐
    │         │
    ▼         ▼
App Store    Web-App
(Download)   (Registrierung)
    │         │
    ▼         ▼
Onboarding + Erster Scan (Wow-Moment)
         │
         ▼
Free Tier → Nutzung → Feature-Gate → Upgrade-Prompt
         │
         ▼
PRO (€6.99) oder SHIELD (€14.99)
```

---

# TEIL XVI — SEO, GEO, AEO & SEA

---

## Kapitel 18 — SEO, GEO, AEO & SEA — Content-Marketing-Strategie

### 18.1 Warum Content-Marketing für SOVEREIGN?

Mobile Apps werden nicht über Google gefunden. Aber die **Probleme**, die SOVEREIGN löst, werden täglich tausendfach gegoogelt:

| Suchbegriff | Monatl. Suchvolumen (DE) | Intent |
|-------------|-------------------------|--------|
| "vertrag kündigen vorlage" | 40.000+ | Transactional |
| "preiserhöhung widersprechen" | 12.000+ | Informational |
| "mietminderung berechnen" | 8.000+ | Informational |
| "netflix preiserhöhung 2026" | 15.000+ | Navigational |
| "abofalle was tun" | 6.000+ | Informational |
| "vertragsmanagement app" | 3.000+ | Transactional |
| "kündigungsfrist verpasst" | 5.000+ | Informational |

Jeder dieser Suchbegriffe ist ein potentieller SOVEREIGN-Nutzer.

### 18.2 Pillar & Cluster Content-Modell

```
                    ┌─────────────────────────┐
                    │   PILLAR PAGE            │
                    │   "Vertrag kündigen:     │
                    │    Der ultimative Guide" │
                    │   (3.000+ Wörter, SSR)   │
                    └────────────┬────────────┘
                                 │
            ┌────────────────────┼────────────────────┐
            │                    │                    │
            ▼                    ▼                    ▼
    ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
    │ CLUSTER:     │   │ CLUSTER:     │   │ CLUSTER:     │
    │ Fitnessstudio│   │ Handyvertrag │   │ Mietvertrag  │
    │ kündigen     │   │ kündigen     │   │ kündigen     │
    └──────────────┘   └──────────────┘   └──────────────┘
```

### 18.3 Pillar Pages (Primäre SEO-Ziele)

| Pillar Page | URL | Target Keywords | Wörter |
|-------------|-----|-----------------|--------|
| **Vertrag kündigen: Der ultimative Guide** | `/blog/vertrag-kuendigen/` | vertrag kündigen, kündigung vorlage, kündigungsfrist | 3.000+ |
| **Preiserhöhung widersprechen: Deine Rechte** | `/blog/preiserhoehung-widersprechen/` | preiserhöhung widersprechen, musterbrief, rechte | 2.500+ |
| **Mietminderung: Wann, wie viel, wie?** | `/blog/mietminderung-berechnen/` | mietminderung tabelle, berechnen, musterbrief | 3.000+ |
| **Abofalle erkennen und entkommen** | `/blog/abofalle-was-tun/` | abofalle, abo kündigen, versteckte kosten | 2.000+ |
| **Flugverspätung: Entschädigung einfordern** | `/blog/flugverspaetung-entschaedigung/` | flug verspätet, entschädigung, eu verordnung 261 | 2.500+ |
| **Vertragsmanagement mit KI** | `/blog/vertragsmanagement-ki/` | vertragsmanagement app, ki vertrag, digitaler assistent | 2.000+ |

### 18.4 Cluster-Artikel (pro Pillar 5-10 Stück)

**Beispiel: Pillar "Vertrag kündigen"**

| Cluster-Artikel | URL | Long-Tail Keyword |
|-----------------|-----|-------------------|
| Fitnessstudio kündigen: Sonderkündigungsrecht | `/blog/fitnessstudio-kuendigen/` | fitnessstudio vertrag kündigen umzug |
| Telekom Vertrag kündigen 2026 | `/blog/telekom-kuendigen/` | telekom kündigung vorlage |
| Vodafone kündigen: Fristen & Vorlage | `/blog/vodafone-kuendigen/` | vodafone kündigungsfrist |
| Netflix kündigen und Alternativen | `/blog/netflix-kuendigen/` | netflix abo kündigen |
| Stromvertrag kündigen & wechseln | `/blog/stromvertrag-kuendigen/` | strom kündigen wechsel |
| Versicherung kündigen: Was beachten? | `/blog/versicherung-kuendigen/` | versicherung kündigung frist |
| Mietvertrag kündigen: Vorlage & Fristen | `/blog/mietvertrag-kuendigen/` | mietvertrag kündigung vorlage |

**Jeder Artikel enthält:**
- Strukturierte Daten (FAQ-Schema, HowTo-Schema)
- CTA: "SOVEREIGN macht das automatisch für dich → [Kostenlos starten]"
- Interne Links zum Pillar und anderen Clustern
- Downloadbare Vorlage (Lead Magnet → E-Mail-Capture)

### 18.5 GEO (Generative Engine Optimization)

GEO optimiert Inhalte für KI-Suchmaschinen (Google AI Overviews, Perplexity, ChatGPT Search):

| GEO-Taktik | Implementierung |
|------------|----------------|
| **Klare Antwort in den ersten 50 Wörtern** | Jeder Artikel beginnt mit einer direkten Antwort auf die Suchfrage |
| **Strukturierte Daten** | FAQ-Schema, HowTo-Schema, Product-Schema auf jeder Seite |
| **Autoritative Quellenangaben** | BGB-Paragraphen, BGH-Urteile, EU-Verordnungen zitieren |
| **Conversational Tone** | Frage-Antwort-Format in Abschnitten (passt zu AI Overviews) |
| **Freshness** | Datums-Tags, "Stand: März 2026", regelmäßige Updates |

### 18.6 AEO (Answer Engine Optimization)

Ziel: SOVEREIGN-Content als **Featured Snippet** bei Google:

```
Suchfrage: "Wie widerspreche ich einer Preiserhöhung?"

Google Featured Snippet:
┌──────────────────────────────────────────────────┐
│ Um einer Preiserhöhung zu widersprechen:          │
│ 1. Prüfen Sie, ob eine Vorankündigung erfolgte    │
│ 2. Sonderkündigungsrecht prüfen (§314 BGB)        │
│ 3. Schriftlich widersprechen (Einschreiben)        │
│ 4. Frist: 6 Wochen nach Erhalt der Mitteilung     │
│                                                    │
│ Quelle: sovereign.de                               │
└──────────────────────────────────────────────────┘
```

**Implementierung:**
- Jeder Artikel hat eine `<section>` mit exakt der Frage als `<h2>` und einer nummerierten Antwort
- `FAQPage` JSON-LD auf jeder Seite
- "People Also Ask"-Fragen als H3-Unterüberschriften

### 18.7 SEA (Search Engine Advertising) — Google Ads

| Kampagne | Keywords | Budget/Monat | Ziel |
|----------|---------|-------------|------|
| **Brand** | "sovereign app", "sovereign vertragsmanager" | €200 | Brand-Schutz |
| **Competitor** | "aboalarm alternative", "volders alternative" | €500 | Competitor-Capture |
| **Problem-Based** | "preiserhöhung widersprechen app", "vertrag kündigen automatisch" | €800 | High-Intent Traffic |
| **B2B** | "b2b vertragsmanagement", "mahnwesen automatisieren" | €300 | Professional Shield |
| **Retargeting** | Website-Besucher, App-Installer die nicht converted haben | €400 | Conversion-Steigerung |
| **GESAMT** | | **€2.200/Monat** | |

**Target CPA (Cost per Acquisition):** €5-15 pro Free-Signup, €25-40 pro PRO-Conversion

### 18.8 Content-Produktions-Rhythmus

| Frequenz | Content-Typ | Verantwortlich |
|----------|-------------|----------------|
| Wöchentlich | 1 Cluster-Artikel (800-1.500 Wörter) | Content-Team / Gemini-assistiert |
| Monatlich | 1 Pillar Page (2.000-3.000 Wörter) | Content-Team + Legal Review |
| Quartalsweise | Feature-Update-Post | Product-Team |
| Bei Bedarf | News-Artikel (z.B. "Netflix erhöht Preise") | Reaktiv, schnell |

**Gemini als Content-Assistent:** Gemini kann Entwürfe für Blog-Artikel erstellen, die dann redaktionell überarbeitet werden. Aber: **Kein 100% AI-Content** — Google erkennt und bestraft das. Menschliche Expertise und rechtliche Prüfung sind Pflicht.

---

# TEIL XVII — BANK-ANBINDUNG & OPEN BANKING

---

## Kapitel 19 — Bank-Anbindung & Open Banking (PSD2)

### 19.1 Strategische Entscheidung: 2-Stufen-Modell

| Stufe | Phase | Methode | Kosten | Verfügbar für |
|-------|-------|---------|--------|---------------|
| **Stufe 1** | MVP | Manueller CSV/PDF-Import | €0 | Free + PRO + SHIELD |
| **Stufe 2** | Post-MVP | finAPI PSD2-Anbindung | €60-300/Monat | Nur SHIELD |

### 19.2 Stufe 1: CSV/PDF-Import (MVP)

Der Nutzer exportiert Kontoauszüge aus seiner Bank-App (CSV oder PDF) und lädt sie in SOVEREIGN hoch. Gemini parsed die Transaktionen.

```
User: Exportiert CSV aus Sparkassen-App
         │
         ▼
SOVEREIGN: Upload im Finance-Modul
         │
         ▼
Gemini: Parsed CSV → Erkennt Spalten automatisch
         │
         ▼
Strukturierte Transaktionen in Firestore
         │
         ▼
Finance Guardian: Analysiert auf Anomalien
```

**Vorteile:**
- Keine externe Abhängigkeit, keine Kosten
- Funktioniert mit jeder Bank weltweit
- Nutzer behält volle Kontrolle über seine Daten

**Nachteile:**
- Manueller Aufwand (Export + Upload)
- Keine Echtzeit-Erkennung

### 19.3 Stufe 2: finAPI PSD2-Integration (Post-MVP)

**Warum finAPI?**
- Sitzt in München, BaFin-lizensiert (AISP + PISP)
- "License as a Service" — wir brauchen KEINE eigene BaFin-Registrierung
- PSD2 Web Form: Bank-Login wird sicher über finAPIs UI abgewickelt
- 510+ deutsche Banken abgedeckt

**Technischer Flow:**

```
User: Tippt "Bank verbinden" in SOVEREIGN
         │
         ▼
SOVEREIGN: Öffnet finAPI Web Form (WebView / Browser)
         │
         ▼
User: Loggt sich bei seiner Bank ein (SCA)
         │
         ▼
finAPI: Authentifiziert via PSD2 XS2A
         │
         ▼
finAPI: Sendet Transaktionen an SOVEREIGN Backend
         │
         ▼
Backend: Speichert in Firestore (verschlüsselt)
         │
         ▼
Finance Guardian: Echtzeit-Analyse → Alerts → Dashboard
```

**IBAN allein reicht NICHT.** Unter PSD2 ist Strong Customer Authentication (SCA) Pflicht. Der User muss sich direkt bei seiner Bank authentifizieren. Eine IBAN ohne Banklogin gibt keinen Zugriff auf Transaktionsdaten.

### 19.4 finAPI Kosten

| Plan | Preis | Inkludiert |
|------|-------|-----------|
| Access B2C (bis 200 User) | €60/Monat | PSD2-Lizenz, Web Form, Transaktionsdaten |
| Access B2C (bis 1.000 User) | €300/Monat | Wie oben, mehr Kapazität |
| Access B2C (1.000+ User) | €0.15-0.30/User/Monat | Volumen-Staffelung |

### 19.5 Gemini Web-Grounding als Vergleichsengine

Statt Check24/Verivox-API (existiert nicht) nutzen wir **Gemini mit Google Search Grounding**:

```kotlin
// Gemini-Anfrage mit Web-Grounding für Tarifvergleich
val tool = Tool(googleSearch = GoogleSearch())
val config = GenerateContentConfig(tools = listOf(tool))

val prompt = """
    Der Nutzer hat einen Stromvertrag bei E.ON mit 32 ct/kWh.
    Verbrauch: ca. 3.500 kWh/Jahr. PLZ: 80331 (München).

    Suche aktuelle Stromanbieter in München und vergleiche:
    1. Die 5 günstigsten Tarife mit Preis/kWh und Grundgebühr
    2. Ökostrom-Optionen separat
    3. Empfehlung basierend auf Nutzer-Präferenz: "Nachhaltigkeit vor Preis"

    Nenne Quellen für alle Preise.
"""

val response = model.generateContent(prompt, config)
// → Gemini sucht live das Web, findet aktuelle Tarife, liefert mit Quellen
```

**Kosten:** 1.500 gegroundete Anfragen/Tag kostenlos (Gemini 2.5 Flash), danach $35/1.000.

---

# TEIL XVIII — MULTI-USER & FAMILY VAULT

---

## Kapitel 20 — Multi-User & Family Vault

### 20.1 Konzept

Ein Haushalt hat mehrere Personen, aber gemeinsame Verträge (Miete, Strom, Internet). SOVEREIGN ermöglicht geteiltes Vertragsmanagement innerhalb einer Familie oder WG.

```
┌──────────────────────────────────────────┐
│          FAMILY VAULT (SHIELD)            │
├──────────────────────────────────────────┤
│  Owner: Max Mustermann (Admin)            │
│  Members: Lisa (Partner), Tom (18+)       │
│  Viewer: Oma Helga (Read-Only)            │
│                                           │
│  GETEILTE VERTRÄGE:                       │
│  ├── Mietvertrag (alle)                   │
│  ├── Stromvertrag (alle)                  │
│  └── Internet (alle)                      │
│                                           │
│  PRIVATE VERTRÄGE:                        │
│  ├── Max: Handy, KFZ-Versicherung        │
│  ├── Lisa: Handy, Fitness                 │
│  └── Tom: Handy, Spotify                  │
│                                           │
│  ROLLEN:                                  │
│  Admin  → Alles, Mitglieder einladen      │
│  Member → Geteilte + Eigene, Approvals    │
│  Viewer → Nur geteilte (Read-Only)        │
└──────────────────────────────────────────┘
```

### 20.2 Datenmodell

```kotlin
@Serializable
data class FamilyVault(
    val id: String = UUID.randomUUID().toString(),
    val name: String,                          // z.B. "Familie Mustermann"
    val ownerId: String,                       // Firebase UID des Admins
    val members: List<VaultMember>,
    val sharedContractIds: List<String>,
    val createdAt: Long
)

@Serializable
data class VaultMember(
    val userId: String,
    val displayName: String,
    val email: String,
    val role: VaultRole,
    val joinedAt: Long
)

@Serializable
enum class VaultRole {
    ADMIN,      // Kann alles: Mitglieder verwalten, Verträge teilen, Einstellungen
    MEMBER,     // Kann geteilte + eigene Verträge sehen, Approvals erteilen
    VIEWER      // Nur Lesen (z.B. für ältere Familienmitglieder)
}
```

### 20.3 Firestore-Struktur für Multi-User

```
firestore/
├── users/{uid}/                    ← Private Daten
│   ├── contracts/                  ← Eigene Verträge
│   ├── settings/
│   └── ...
│
├── vaults/{vaultId}/               ← Geteilter Bereich
│   ├── members/                    ← Mitglieder mit Rollen
│   ├── sharedContracts/            ← Geteilte Verträge
│   ├── sharedCases/                ← Geteilte Life-Cases
│   └── auditLog/                   ← Wer hat was wann getan
```

### 20.4 Einladungs-Flow

```
Admin: Tippt E-Mail-Adresse ein → "Lisa einladen"
         │
         ▼
Backend: Erstellt Invite-Link (signiert, 7 Tage gültig)
         │
         ▼
E-Mail: Lisa erhält Link → Klickt → Registriert/Loggt ein
         │
         ▼
SOVEREIGN: Lisa wird als Member zum Vault hinzugefügt
         │
         ▼
Lisa sieht: Geteilte Verträge + eigene Verträge (getrennt)
```

### 20.5 Limits

| SHIELD-Tier | Limit |
|------------|-------|
| Vault-Mitglieder | Bis zu 5 Personen |
| Geteilte Verträge | Unbegrenzt |
| Geteilte Life-Cases | Unbegrenzt |
| Admin-Accounts | 1 pro Vault |

---

# TEIL XIX — ANHANG (erweitert)

---

## Kapitel 21 — Feature-Tier-Matrix — Vollständig

### Dashboard

| Funktion | Free | PRO €6.99 | SHIELD €14.99 |
|----------|------|-----------|---------------|
| Souveränitäts-Score | ✅ | ✅ | ✅ |
| Finanz-Alerts | Letzte 3 | Alle | Alle + Echtzeit |
| Savings-Summary | ✅ | ✅ | ✅ |
| Agenten-Status | ✅ | ✅ | ✅ |
| E-Mail-Insights | — | ✅ | ✅ |
| Life-Cases auf Dashboard | 1 | 3 | Alle |
| Vertrags-Radar (Predictive) | — | ✅ | ✅ |
| Home-Screen Widget | — | ✅ | ✅ |

### Contracts

| Funktion | Free | PRO | SHIELD |
|----------|------|-----|--------|
| Verträge manuell anlegen | Max 3 | Unbegrenzt | Unbegrenzt |
| PDF/Foto-Scan (OCR + Gemini) | 1/Tag | 10/Tag | Unbegrenzt |
| Basis-Analyse (Anbieter, Preis, Laufzeit) | ✅ | ✅ | ✅ |
| Deep Clause Explorer | — | ✅ | ✅ |
| Risiko-Scoring pro Klausel | — | ✅ | ✅ |
| Marktvergleich (Gemini Web-Grounding) | — | 5/Monat | Unbegrenzt |
| Kündigungs-Push-Erinnerungen | — | ✅ | ✅ |
| Auto-Verlängerungs-Warnung | 30 Tage | 90 Tage | 180 Tage |

### Finance

| Funktion | Free | PRO | SHIELD |
|----------|------|-----|--------|
| Transaktions-Übersicht (CSV-Import) | — | ✅ | ✅ |
| Bank-Anbindung (finAPI PSD2) | — | — | ✅ |
| Echtzeit-Anomalie-Erkennung | — | — | ✅ |
| Cashflow-Analyse | — | Monats-View | Jahres-View |
| Wiederkehrende Kosten tracken | — | ✅ | ✅ |
| Savings-Vorschläge | — | 3/Monat | Unbegrenzt |

### Life-Cases

| Funktion | Free | PRO | SHIELD |
|----------|------|-----|--------|
| Cases erstellen | 1 aktiv | 5 aktiv | Unbegrenzt |
| Timeline & Beweismittel | ✅ | ✅ | ✅ |
| Gemini-Strategie ("Schlachtplan") | — | ✅ | ✅ |
| Muster-Korrespondenz | — | Preview | Volltext |
| Eskalationsempfehlung (Anwalt) | — | — | ✅ |
| B2B-Mahnwesen | — | — | ✅ |

### Twin (Live Terminal)

| Funktion | Free | PRO | SHIELD |
|----------|------|-----|--------|
| Text-Chat mit Gemini | 5/Tag | 50/Tag | Unbegrenzt |
| Portfolio-Kontext im Chat | Basis | Erweitert | Vollständig |
| Kamera-Vision (Schadensdoku) | — | — | ✅ |
| Voice-Chat (Gemini Live Audio) | — | — | ✅ |

### Execution Engine

| Funktion | Free | PRO | SHIELD |
|----------|------|-----|--------|
| Gmail-Entwürfe erstellen | — | — | ✅ |
| Kündigungen/Widersprüche senden | — | — | ✅ |
| Premium-Kündigung (Einschreiben) | — | — | €4.99/Stück |
| Kalender-Integration (Fristen) | — | ✅ | ✅ |

### Approvals

| Funktion | Free | PRO | SHIELD |
|----------|------|-----|--------|
| Freigabe-Queue | ✅ | ✅ | ✅ |
| AI-Erklärung pro Aktion | — | ✅ | ✅ |
| SwipeToApprove + Biometrie | ✅ | ✅ | ✅ |
| Batch-Freigabe | — | — | ✅ |
| Audit-Log | — | ✅ | ✅ |

### Settings & Multi-User

| Funktion | Free | PRO | SHIELD |
|----------|------|-----|--------|
| BoundaryConditions | Basis | Erweitert | Vollständig |
| Connected Accounts | — | E-Mail | E-Mail + Bank |
| Multi-User / Family Vault | — | — | ✅ (bis 5) |
| Professional Shield (B2B-Modus) | — | — | ✅ |
| Daten-Export | — | ✅ | ✅ |
| Kill-Switch | ✅ | ✅ | ✅ |

### Claims

| Funktion | Free | PRO | SHIELD |
|----------|------|-----|--------|
| Claim-Erkennung | — | ✅ | ✅ |
| Automatische Einreichung | — | — | ✅ |
| Status-Tracking | — | ✅ | ✅ |
| **Kosten: 25% Success-Fee** | — | **25%** | **25%** |

---

## Kapitel 22 — Kostenstruktur & Unit Economics

### 22.1 Infrastrukturkosten pro Monat

| Posten | Bis 1K User | Bis 10K User | Bis 50K User |
|--------|-------------|-------------|-------------|
| Cloud Run (FastAPI) | €0-5 | €20-50 | €80-200 |
| Firestore (Reads/Writes) | €0 | €10-30 | €50-150 |
| Firebase Auth | €0 | €0 | €0 (unter 50K MAU) |
| Gemini API (Flash) | €0-10 | €50-100 | €200-500 |
| Gemini Grounding | €0 | €30-60 | €100-300 |
| finAPI (SHIELD-User only) | €60 | €300 | €1.500 |
| Firebase Hosting (Web+Landing) | €0 | €10-25 | €25-50 |
| Cloud CDN | €0 | €5-15 | €20-50 |
| Google Ads (SEA) | €500 | €1.500 | €2.200 |
| **GESAMT** | **€565-575** | **€1.925-2.080** | **€4.175-4.950** |

### 22.2 Unit Economics (bei 10.000 Usern)

```
Revenue:
  PRO (1.200 User × €6.99)          = €8.388
  SHIELD (300 User × €14.99)        = €4.497
  Claims Success-Fee (50 × €62.50)  = €3.125
  Micro-Transactions                 = €500
  BRUTTO                             = €16.510

  - Google Play (10%)                = -€1.289  (nur auf Subs)
  - Infra-Kosten                     = -€2.000
  - Google Ads                       = -€1.500
  NETTO                              = ~€11.720/Monat

  Customer Acquisition Cost (CAC):   ~€5-15 (organisch + Ads)
  Lifetime Value (LTV) PRO:          €6.99 × 12 Monate = €83.88
  LTV / CAC Ratio:                   5.6-16.8x ✅ (>3x ist gesund)
```

### 22.3 Gemini API Preise (Referenz)

| Modell | Input / 1M Token | Output / 1M Token | Free Tier |
|--------|------------------|-------------------|-----------|
| Gemini 2.5 Flash | $0.30 | $2.50 | 10 RPM, 250 RPD |
| Gemini 2.5 Flash-Lite | $0.10 | $0.40 | 15 RPM, 1.000 RPD |
| Gemini 2.5 Pro | $1.25 | $10.00 | 5 RPM, 100 RPD |
| Grounding (Flash) | — | — | 1.500/Tag, dann $35/1.000 |

### 22.4 Break-Even-Analyse

```
Fixkosten/Monat (inkl. Ads): ~€2.500
Break-Even bei:
  - 358 PRO-User (€2.500 / €6.99) — ODER
  - 167 SHIELD-User (€2.500 / €14.99) — ODER
  - Mix: 200 PRO + 50 SHIELD = €1.398 + €750 = €2.148 → fast Break-Even

  → Break-Even bei ca. 2.000-3.000 Gesamtnutzer (mit 10-15% Conversion)
```

---

## Kapitel 23 — libs.versions.toml

```toml
[versions]
# Kotlin & Android
agp = "8.7.2"
kotlin = "2.0.20"
ksp = "2.0.20-1.0.25"
jvmTarget = "17"

# Compose
composeBom = "2024.10.01"
composeCompiler = "2.0.20"
activityCompose = "1.9.3"
navigationCompose = "2.8.3"

# DI
hilt = "2.52"
hiltNavigationCompose = "1.2.0"

# Firebase
firebaseBom = "33.5.1"
firebaseVertexAi = "16.0.0-beta06"
generativeAi = "0.9.0"

# Network
ktor = "2.3.12"
kotlinxSerialization = "1.7.3"

# Local Storage
roomVersion = "2.6.1"
datastoreVersion = "1.1.1"

# Security
biometric = "1.2.0-alpha05"

# Camera
camerax = "1.4.0"

# Gmail
gmailApi = "v1-rev20230612-2.0.0"
googleApiClient = "2.7.0"

# Testing
junit = "4.13.2"
junitAndroid = "1.2.1"
espresso = "3.6.1"
mockk = "1.13.12"
turbine = "1.1.0"
coroutinesTest = "1.8.1"

[libraries]
# Compose
compose-bom = { group = "androidx.compose", name = "compose-bom", version.ref = "composeBom" }
compose-ui = { group = "androidx.compose.ui", name = "ui" }
compose-material3 = { group = "androidx.compose.material3", name = "material3" }
compose-icons = { group = "androidx.compose.material", name = "material-icons-extended" }
compose-tooling = { group = "androidx.compose.ui", name = "ui-tooling" }
activity-compose = { group = "androidx.activity", name = "activity-compose", version.ref = "activityCompose" }
navigation-compose = { group = "androidx.navigation", name = "navigation-compose", version.ref = "navigationCompose" }

# Hilt
hilt-android = { group = "com.google.dagger", name = "hilt-android", version.ref = "hilt" }
hilt-compiler = { group = "com.google.dagger", name = "hilt-android-compiler", version.ref = "hilt" }
hilt-navigation = { group = "androidx.hilt", name = "hilt-navigation-compose", version.ref = "hiltNavigationCompose" }

# Firebase
firebase-bom = { group = "com.google.firebase", name = "firebase-bom", version.ref = "firebaseBom" }
firebase-vertexai = { group = "com.google.firebase", name = "firebase-vertexai" }
generative-ai = { group = "com.google.ai.client.generativeai", name = "generativeai", version.ref = "generativeAi" }

# Ktor
ktor-client-core = { group = "io.ktor", name = "ktor-client-core", version.ref = "ktor" }
ktor-client-okhttp = { group = "io.ktor", name = "ktor-client-okhttp", version.ref = "ktor" }
ktor-client-content = { group = "io.ktor", name = "ktor-client-content-negotiation", version.ref = "ktor" }
ktor-serialization = { group = "io.ktor", name = "ktor-serialization-kotlinx-json", version.ref = "ktor" }

# Security
biometric = { group = "androidx.biometric", name = "biometric", version.ref = "biometric" }

# Camera
camerax-core = { group = "androidx.camera", name = "camera-core", version.ref = "camerax" }
camerax-camera2 = { group = "androidx.camera", name = "camera-camera2", version.ref = "camerax" }
camerax-lifecycle = { group = "androidx.camera", name = "camera-lifecycle", version.ref = "camerax" }
camerax-view = { group = "androidx.camera", name = "camera-view", version.ref = "camerax" }

# Testing
junit = { group = "junit", name = "junit", version.ref = "junit" }
junit-android = { group = "androidx.test.ext", name = "junit", version.ref = "junitAndroid" }
espresso = { group = "androidx.test.espresso", name = "espresso-core", version.ref = "espresso" }
mockk = { group = "io.mockk", name = "mockk", version.ref = "mockk" }
turbine = { group = "app.cash.turbine", name = "turbine", version.ref = "turbine" }
coroutines-test = { group = "org.jetbrains.kotlinx", name = "kotlinx-coroutines-test", version.ref = "coroutinesTest" }

[plugins]
android-application = { id = "com.android.application", version.ref = "agp" }
android-library = { id = "com.android.library", version.ref = "agp" }
kotlin-android = { id = "org.jetbrains.kotlin.android", version.ref = "kotlin" }
kotlin-serialization = { id = "org.jetbrains.kotlin.plugin.serialization", version.ref = "kotlin" }
kotlin-compose = { id = "org.jetbrains.kotlin.plugin.compose", version.ref = "kotlin" }
hilt = { id = "com.google.dagger.hilt.android", version.ref = "hilt" }
ksp = { id = "com.google.devtools.ksp", version.ref = "ksp" }
google-services = { id = "com.google.gms.google-services", version = "4.4.2" }
```

---

## Kapitel 24 — Glossar

| Begriff | Definition |
|---------|------------|
| **Sovereign Twin** | Gemini-basierter digitaler Zwilling des Nutzers — persistenter, kontextbewusster KI-Agent |
| **Finance Guardian** | Sub-Agent-Engine für Bank-Stream-Überwachung und Preiserhöhungs-Erkennung |
| **Clause Engine** | Sub-Agent-Engine für die Analyse von Vertragsklauseln via OCR + NLP |
| **Execution Engine** | System für autonomes Handeln (Gmail-Entwürfe, Kalender, Tasks) |
| **Portfolio-Kontext** | Aggregierte Daten über alle Verträge, Finanzen, Präferenzen des Nutzers |
| **AgentMemory** | Persistentes Wissen des Twins (Fakten, Präferenzen, Muster) |
| **BoundaryConditions** | Nutzer-definierte Grenzen für autonomes Agent-Handeln |
| **Human-in-the-Loop (HitL)** | Design-Prinzip: KI bereitet vor, Mensch entscheidet |
| **ApprovalRequest** | Datenobjekt für Freigabe-Anfragen des Agenten an den Nutzer |
| **Life-Case** | Strukturierter Container für komplexe Lebensereignisse (Schaden, Recht, etc.) |
| **SwipeToApprove** | UI-Pattern: Wisch-Geste zur biometrisch gesicherten Freigabe |
| **Kill-Switch** | Sofortige Deaktivierung aller autonomen Agent-Aktionen |
| **Glassmorphism** | UI-Design-Stil mit semi-transparenten, gläsernen Oberflächen und Blur-Effekten |
| **Aura-Effekt** | Pulsierender Glow-Effekt der signalisiert, dass der Agent aktiv arbeitet |
| **Deep Clause Explorer** | Feature zum „Röntgen" von Dokumenten auf versteckte Risiko-Klauseln |
| **Professional Shield** | B2B-Modus für Gewerbetreibende (Mahnwesen, Liquidität, Lieferantenverträge) |

---

## Kapitel 25 — API-Referenz

### 17.1 Android → Backend (Ktor → FastAPI)

```
Base URL: https://sovereign-backend-{PROJECT_ID}.run.app/v2/
Auth: Bearer Token (Firebase ID Token)
Content-Type: application/json
```

| Endpoint | Method | Request Body | Response |
|----------|--------|-------------|----------|
| `/contracts` | GET | — | `List<Contract>` |
| `/contracts` | POST | `Contract` (ohne id) | `{ id, status }` |
| `/contracts/{id}` | GET | — | `Contract` |
| `/contracts/{id}` | DELETE | — | `{ status }` |
| `/approvals` | GET | — | `List<ApprovalRequest>` |
| `/approvals/{id}/approve` | POST | — | `{ status }` |
| `/approvals/{id}/reject` | POST | `{ reason }` | `{ status }` |
| `/claims` | GET | — | `List<Claim>` |
| `/claims` | POST | `Claim` (ohne id) | `{ id, status }` |
| `/insights` | GET | — | `List<FinancialInsight>` |
| `/health` | GET | — | `{ status: "ok" }` |

### 17.2 Android → Gemini (Firebase Vertex AI)

```
SDK: com.google.firebase:firebase-vertexai
Model: gemini-2.5-flash
Auth: Automatisch via Firebase SDK (google-services.json)
```

| Call | Method | Input | Output |
|------|--------|-------|--------|
| Vertragsanalyse | `generateContent(prompt)` | Text + Portfolio-Kontext | JSON → `ContractAnalysis` |
| E-Mail-Analyse | `generateContent(prompt)` | E-Mail-Liste + Kontext | JSON → `List<FinancialInsight>` |
| Live-Chat | `chat.sendMessage(text)` | User-Text | Streaming-Text |
| Life-Case-Strategie | `generateContent(prompt)` | Case-Daten + Kontext | JSON → Strategie-Plan |

---

## Kapitel 26 — Release-Checkliste

### Pre-Release (vor jedem Build)

- [ ] Alle P0-Bugs sind gefixt
- [ ] `isMinifyEnabled = true` im Release-Build
- [ ] Proguard-Rules getestet (kein Crash nach Minification)
- [ ] Kein hardkodierter API-Key im Code (→ `google-services.json`)
- [ ] Keine `Log.d()`-Calls im Release-Code
- [ ] `libs.versions.toml` auf aktuelle Versionen geprüft
- [ ] Unit-Tests: 100% grün
- [ ] Integration-Tests: 100% grün
- [ ] Performance-Targets eingehalten (Cold Start < 2s, APK < 30 MB)

### Build & Sign

- [ ] Release-APK/AAB gebaut: `./gradlew bundleRelease`
- [ ] Signiert mit Production-Keystore
- [ ] AAB getestet via `bundletool`

### Firebase & Backend

- [ ] Firebase Crashlytics aktiviert
- [ ] Firebase Performance Monitoring aktiviert
- [ ] Backend auf Cloud Run deployed (Production)
- [ ] Firestore Security Rules deployed und getestet
- [ ] Firebase Auth korrekt konfiguriert

### Post-Release

- [ ] Play Store Listing aktualisiert
- [ ] Crashlytics-Dashboard überwacht (24h)
- [ ] Beta-Tester-Feedback gesammelt
- [ ] Metriken geprüft (DAU, Retention, AI-Call-Volumen)

---

## Kapitel 27 — Architecture Decision Records (ADRs)

### ADR-001: Firebase Vertex AI statt direkter Gemini API

**Kontext:** Gemini kann direkt über die Google AI API oder via Firebase Vertex AI angesprochen werden.

**Entscheidung:** Firebase Vertex AI.

**Begründung:**
- Automatische Auth via `google-services.json` — kein API-Key im Client-Code
- Firebase BOM verwaltet Versions-Kompatibilität
- Integration mit Firebase Crashlytics, Performance, Analytics
- Firestore als Backend-DB bereits vorhanden
- Vertex AI bietet Enterprise-SLAs

---

### ADR-002: Ktor statt Retrofit für Netzwerk

**Kontext:** Retrofit ist der Standard für Android-HTTP, Ktor ist Kotlin-nativ.

**Entscheidung:** Ktor mit OkHttp-Engine.

**Begründung:**
- Kotlin-First: Coroutines nativ, keine Callback-Wrapper nötig
- Multiplatform-fähig (falls iOS-Port geplant)
- kotlinx.serialization statt Gson/Moshi (konsistent mit Domain-Modellen)
- OkHttp-Engine nutzt bewährte HTTP-Infrastruktur

---

### ADR-003: MVI statt MVVM

**Kontext:** MVVM mit LiveData ist Android-Standard, MVI mit StateFlow ist moderner.

**Entscheidung:** MVI mit StateFlow.

**Begründung:**
- Unidirektionaler Datenfluss: State ist immer konsistent
- Immutable State: Keine Race Conditions
- Testbar: State-Transitions sind deterministisch
- Compose-kompatibel: `collectAsStateWithLifecycle()`

---

### ADR-004: Local-First mit Cloud-Sync

**Kontext:** App könnte Cloud-First (Firestore) oder Local-First (Room/DataStore) sein.

**Entscheidung:** Local-First mit selektivem Cloud-Sync.

**Begründung:**
- Datenschutz: Sensible Finanzdaten primär lokal
- Offline-Fähigkeit: App funktioniert ohne Internet
- Performance: Kein Netzwerk-Roundtrip für UI-Rendering
- Cloud nur für: Backend-APIs, AI-Calls, Cross-Device-Sync (Premium)

---

### ADR-005: Gemini Web-Grounding statt Check24/Verivox-API

**Kontext:** Für den Tarifvergleich brauchen wir aktuelle Marktpreise. Check24 und Verivox haben keine öffentlichen APIs.

**Entscheidung:** Gemini mit Google Search Grounding.

**Begründung:**
- Check24, Verivox, Tarifcheck bieten keine öffentliche API — ihr Geschäftsmodell basiert auf eigenem Traffic
- Gemini Grounding durchsucht das gesamte Web in Echtzeit
- Keine Vendor-Abhängigkeit, keine Provisionen
- 1.500 gegroundete Anfragen/Tag kostenlos
- Antworten enthalten Quellen-URLs für Transparenz

---

### ADR-006: finAPI für Bank-Anbindung (nicht Tink/Plaid)

**Kontext:** PSD2-konforme Bank-Anbindung für den Finance Guardian.

**Entscheidung:** finAPI (München) als PSD2-Aggregator.

**Begründung:**
- BaFin-lizensiert (AISP + PISP), Sitz in München
- "License as a Service" — keine eigene BaFin-Registrierung nötig
- €60/Monat für bis zu 200 User — günstigster Einstieg
- PSD2 Web Form übernimmt SCA (Strong Customer Authentication)
- Tink (Enterprise, kein Self-Service), Plaid (kein EU-Self-Service) sind für unsere Phase zu groß

---

### ADR-007: Next.js für Web-App und Landing Page

**Kontext:** Web-Frontend-Technologie für die Plattform-Erweiterung.

**Entscheidung:** Next.js 15 mit App Router + TypeScript + Tailwind.

**Begründung:**
- SSR für SEO-kritische Seiten (Landing Page, Blog)
- Firebase Auth JS SDK → identisches Auth wie Mobile
- Tailwind CSS → Design-Tokens aus `shared/design-tokens.json`
- Firebase Hosting mit automatischem CDN
- Größtes React-Ökosystem, einfachstes Recruiting

---

### ADR-008: Kein Provisions-Modell, keine Maklertätigkeit

**Kontext:** Monetarisierungsstrategie — wie verdient SOVEREIGN Geld?

**Entscheidung:** Freemium-Subscription + Success-Fee + Micro-Transactions. Null Provisionen.

**Begründung:**
- Ethische Grundlage: SOVEREIGN ist Interessenvertreter, nicht Makler
- Provisionen schaffen Interessenkonflikte (wir würden teurere Verträge empfehlen)
- Subscription-Modell aligned Nutzer-Interesse (wir verdienen, wenn der Nutzer bleibt)
- Success-Fee bei Claims ist risikofrei für User und hochprofitabel
- LTV/CAC-Ratio von 5-16x ist langfristig nachhaltiger als Provisions-Modell

---

## Kapitel 28 — Contributor Guide & Code Standards

### 20.1 Kotlin Code-Konventionen

```
- Kotlin Official Style Guide (kotlinlang.org/docs/coding-conventions.html)
- ktlint für automatische Formatierung
- detekt für statische Analyse
```

### 20.2 Naming-Konventionen

| Element | Konvention | Beispiel |
|---------|-----------|---------|
| Package | lowercase, domain-orientiert | `com.sovereign.core.domain.model` |
| Klasse | PascalCase | `GeminiContractAnalyzer` |
| Interface | PascalCase, kein `I`-Prefix | `ContractAnalyzer` (nicht `IContractAnalyzer`) |
| Funktion | camelCase | `analyzeDocument()` |
| Konstante | SCREAMING_SNAKE_CASE | `MAX_MEMORY_COUNT` |
| Composable | PascalCase | `SovereignCard()`, `RiskBadge()` |
| ViewModel State | `{Feature}UiState` | `ContractsUiState` |
| UseCase | `{Verb}{Noun}UseCase` | `GetContractsUseCase` |

### 20.3 Commit-Message-Format

```
<type>(<scope>): <description>

Typen: feat, fix, refactor, docs, test, chore, style
Scope: app, core-data, core-domain, core-ui, feature-dashboard, backend, etc.

Beispiele:
feat(core-data): implement real Gemini JSON parsing in ContractAnalyzer
fix(core-data): update Gemini model from preview to gemini-2.5-flash
refactor(feature-dashboard): extract FinancialAlertCard to shared component
test(core-data): add unit tests for GeminiContractAnalyzer
docs: update SOVEREIGN_DNA.md with complete Design System chapter
```

### 20.4 Branch-Strategie

```
main          ← Production-ready, protected
├── develop   ← Integration Branch
│   ├── feature/gemini-2.5-upgrade
│   ├── feature/finance-guardian
│   ├── fix/contract-analyzer-mock
│   └── fix/backend-auth
```

### 20.5 PR-Checkliste

- [ ] Branch ist aktuell mit `develop`
- [ ] Alle Tests grün
- [ ] ktlint + detekt clean
- [ ] Kein unnötiger Code-Churn
- [ ] Commit-Messages folgen der Konvention
- [ ] Screenshots bei UI-Änderungen
- [ ] DNA.md aktualisiert bei Architektur-Änderungen

---

# ENDE DES DOKUMENTS

> **SOVEREIGN 2030 — Developer DNA v3.0.0**
> Erstellt: 2026-03-30 | Letzte Aktualisierung: 2026-03-30
> **Plattform:** Android App + Web App + Landing Page + Unified GCP Backend
> **28 Kapitel** | **~3.900 Zeilen** | Null Platzhalter
> Dieses Dokument ist die Single Source of Truth.
> Jede Abweichung vom Code ist ein Bug — entweder im Code oder im Dokument.
>
> *"The power of a corporation in the palm of your hand."*
