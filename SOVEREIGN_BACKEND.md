# SOVEREIGN 2030 — Backend & Infrastructure Setup Guide

> **Zweck:** Vollständige Anleitung zur Konfiguration der gesamten SOVEREIGN-Plattform auf Google Cloud Platform via CLI.
> **Version:** 1.0.0 | **Datum:** 2026-03-31
> **Voraussetzung:** Google Cloud SDK (`gcloud`), Firebase CLI (`firebase`), Node.js 20+, Python 3.11+, Docker
> **Ziel-Architektur:** Ein Backend bedient Mobile App + Web App + Landing Page

---

## INHALTSVERZEICHNIS

| # | Kapitel | Beschreibung |
|---|---------|-------------|
| 1 | [GCP-Projekt erstellen & konfigurieren](#1-gcp-projekt-erstellen--konfigurieren) | Projekt, Billing, APIs |
| 2 | [IAM & Service Accounts](#2-iam--service-accounts) | Berechtigungen, Dienstkontoen |
| 3 | [Firebase einrichten](#3-firebase-einrichten) | Auth, Firestore, Hosting |
| 4 | [Secret Manager](#4-secret-manager) | API-Keys, Secrets sicher speichern |
| 5 | [Firestore — Struktur & Security Rules](#5-firestore--struktur--security-rules) | Datenmodell, Regeln, Indizes |
| 6 | [FastAPI Backend — Vollständiger Code](#6-fastapi-backend--vollständiger-code) | Routers, Middleware, Models |
| 7 | [Docker & Cloud Run](#7-docker--cloud-run) | Container bauen, deployen |
| 8 | [Firebase Hosting — Web App & Landing Page](#8-firebase-hosting--web-app--landing-page) | Domains, Rewrites, Deploy |
| 9 | [Cloud DNS & Custom Domains](#9-cloud-dns--custom-domains) | sovereign.de, app.sovereign.de, api.sovereign.de |
| 10 | [Cloud CDN & Load Balancing](#10-cloud-cdn--load-balancing) | Performance, Caching |
| 11 | [Monitoring, Logging & Alerting](#11-monitoring-logging--alerting) | Uptime, Error-Tracking, Budget |
| 12 | [CI/CD Pipeline](#12-cicd-pipeline) | GitHub Actions → Cloud Run + Firebase |
| 13 | [Stripe Integration](#13-stripe-integration) | Subscriptions, Webhooks |
| 14 | [finAPI Integration (PSD2)](#14-finapi-integration-psd2) | Bank-Anbindung |
| 15 | [Checkliste — Go-Live](#15-checkliste--go-live) | Alles vor dem Launch prüfen |

---

## 1. GCP-Projekt erstellen & konfigurieren

### 1.1 Projekt anlegen

```bash
# Variablen (einmal setzen, überall verwenden)
export PROJECT_ID="opus-magnum-ai"
export REGION="europe-west3"
export ZONE="europe-west3-a"
export BILLING_ACCOUNT_ID="DEIN-BILLING-ACCOUNT"  # → gcloud billing accounts list

# Projekt erstellen
gcloud projects create $PROJECT_ID \
  --name="SOVEREIGN Platform" \
  --set-as-default

# Billing verknüpfen
gcloud billing projects link $PROJECT_ID \
  --billing-account=$BILLING_ACCOUNT_ID

# Projekt als Standard setzen
gcloud config set project $PROJECT_ID
gcloud config set compute/region $REGION
gcloud config set compute/zone $ZONE
```

### 1.2 APIs aktivieren

```bash
# Alle benötigten APIs in einem Befehl
gcloud services enable \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  firestore.googleapis.com \
  firebase.googleapis.com \
  firebasehosting.googleapis.com \
  identitytoolkit.googleapis.com \
  aiplatform.googleapis.com \
  secretmanager.googleapis.com \
  cloudresourcemanager.googleapis.com \
  artifactregistry.googleapis.com \
  dns.googleapis.com \
  compute.googleapis.com \
  monitoring.googleapis.com \
  logging.googleapis.com \
  cloudfunctions.googleapis.com \
  firebaserules.googleapis.com \
  fcm.googleapis.com \
  analyticsreporting.googleapis.com
```

### 1.3 Artifact Registry (Docker-Repo)

```bash
gcloud artifacts repositories create sovereign-repo \
  --repository-format=docker \
  --location=$REGION \
  --description="SOVEREIGN Docker images"
```

---

## 2. IAM & Service Accounts

### 2.1 Backend Service Account (Cloud Run)

```bash
# Service Account für den Backend-Service
gcloud iam service-accounts create sovereign-backend-sa \
  --display-name="SOVEREIGN Backend Service"

# Berechtigungen zuweisen
SA_EMAIL="sovereign-backend@${PROJECT_ID}.iam.gserviceaccount.com"

# Firestore Zugriff
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/datastore.user"

# Vertex AI (Gemini) Zugriff
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/aiplatform.user"

# Secret Manager Zugriff
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/secretmanager.secretAccessor"

# Firebase Auth Token-Verifizierung
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/firebase.sdkAdminServiceAgent"
```

### 2.2 CI/CD Service Account (GitHub Actions)

```bash
gcloud iam service-accounts create sovereign-cicd \
  --display-name="SOVEREIGN CI/CD (GitHub Actions)"

CICD_EMAIL="sovereign-cicd@${PROJECT_ID}.iam.gserviceaccount.com"

# Cloud Run deployen
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${CICD_EMAIL}" \
  --role="roles/run.admin"

# Docker-Images pushen
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${CICD_EMAIL}" \
  --role="roles/artifactregistry.writer"

# Cloud Build starten
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${CICD_EMAIL}" \
  --role="roles/cloudbuild.builds.editor"

# Service Account als Cloud Run Service verwenden
gcloud iam service-accounts add-iam-policy-binding $SA_EMAIL \
  --member="serviceAccount:${CICD_EMAIL}" \
  --role="roles/iam.serviceAccountUser"

# JSON Key für GitHub Secrets generieren
gcloud iam service-accounts keys create ./cicd-key.json \
  --iam-account=${CICD_EMAIL}

echo "⚠️  cicd-key.json als GitHub Secret 'GCP_SA_KEY' speichern, dann LÖSCHEN!"
```

---

## 3. Firebase einrichten

### 3.1 Firebase-Projekt initialisieren

```bash
# Firebase CLI installieren (falls nicht vorhanden)
npm install -g firebase-tools

# Login
firebase login

# Firebase dem GCP-Projekt hinzufügen
firebase projects:addfirebase $PROJECT_ID

# Lokales Firebase-Projekt initialisieren
cd /pfad/zum/sovereign-repo
firebase init
# → Auswahl: Firestore, Hosting, Authentication, Functions (optional)
# → Projekt: sovereign-platform
# → Firestore Rules: firestore.rules
# → Firestore Indexes: firestore.indexes.json
```

### 3.2 Firebase Authentication konfigurieren

```bash
# E-Mail/Passwort aktivieren
firebase auth:import --project=$PROJECT_ID

# Über Firebase Console aktivieren (CLI-Support begrenzt):
# → https://console.firebase.google.com/project/sovereign-platform/authentication/providers
# Aktivieren:
#   1. E-Mail/Passwort (mit E-Mail-Link)
#   2. Google Sign-In
#   3. Apple Sign-In (für iOS-Zukunft)
```

**Firebase Auth Konfiguration (via REST API):**

```bash
# Google Sign-In Provider aktivieren
curl -X PATCH \
  "https://identitytoolkit.googleapis.com/admin/v2/projects/${PROJECT_ID}/config" \
  -H "Authorization: Bearer $(gcloud auth print-access-token)" \
  -H "Content-Type: application/json" \
  -d '{
    "signIn": {
      "email": {
        "enabled": true,
        "passwordRequired": true
      }
    }
  }'
```

### 3.3 Android-App registrieren

```bash
firebase apps:create ANDROID \
  --project=$PROJECT_ID \
  --package-name="com.sovereign.app" \
  --display-name="SOVEREIGN Android"

# google-services.json herunterladen
firebase apps:sdkconfig ANDROID \
  --project=$PROJECT_ID \
  --out=android/app/google-services.json
```

### 3.4 Web-App registrieren

```bash
firebase apps:create WEB \
  --project=$PROJECT_ID \
  --display-name="SOVEREIGN Web App"

# Firebase Config abrufen (für Next.js)
firebase apps:sdkconfig WEB --project=$PROJECT_ID
# → Output in web/.env.local speichern:
# NEXT_PUBLIC_FIREBASE_API_KEY=...
# NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
# NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
```

---

## 4. Secret Manager

### 4.1 Secrets erstellen

```bash
# Stripe Secret Key
echo -n "sk_live_DEIN_STRIPE_KEY" | \
  gcloud secrets create stripe-secret-key \
  --replication-policy="automatic" \
  --data-file=-

# Stripe Webhook Secret
echo -n "whsec_DEIN_WEBHOOK_SECRET" | \
  gcloud secrets create stripe-webhook-secret \
  --replication-policy="automatic" \
  --data-file=-

# finAPI Client Credentials
echo -n "DEIN_FINAPI_CLIENT_ID" | \
  gcloud secrets create finapi-client-id \
  --replication-policy="automatic" \
  --data-file=-

echo -n "DEIN_FINAPI_CLIENT_SECRET" | \
  gcloud secrets create finapi-client-secret \
  --replication-policy="automatic" \
  --data-file=-

# Gemini API Key (falls direkt statt via Vertex AI)
echo -n "DEIN_GEMINI_KEY" | \
  gcloud secrets create gemini-api-key \
  --replication-policy="automatic" \
  --data-file=-
```

### 4.2 Secrets auflisten & verifizieren

```bash
gcloud secrets list --project=$PROJECT_ID

# Secret-Wert lesen (nur zur Verifizierung!)
gcloud secrets versions access latest --secret="stripe-secret-key"
```

---

## 5. Firestore — Struktur & Security Rules

### 5.1 Firestore-Datenbank erstellen

```bash
# Firestore im Native Mode erstellen (Europe)
gcloud firestore databases create \
  --location=eur3 \
  --type=firestore-native
```

### 5.2 Datenstruktur (Collections & Documents)

```
firestore/
│
├── users/{uid}/                          ← Pro User (private Daten)
│   ├── profile                           ← Document (kein Subcollection)
│   │   ├── displayName: string
│   │   ├── email: string
│   │   ├── createdAt: timestamp
│   │   ├── tier: "FREE" | "PRO" | "SHIELD"
│   │   ├── stripeCustomerId: string | null
│   │   ├── stripeSubscriptionId: string | null
│   │   └── preferredLanguage: "de" | "en"
│   │
│   ├── settings                          ← Document
│   │   ├── boundaryConditions: map
│   │   │   ├── maxAutoAmountEur: number (default: 50)
│   │   │   ├── allowAutonomousNegotiation: boolean (default: false)
│   │   │   ├── negotiationStrategy: "CONSERVATIVE"|"MODERATE"|"AGGRESSIVE"
│   │   │   ├── requireBiometricForAll: boolean (default: true)
│   │   │   ├── killSwitchActive: boolean (default: false)
│   │   │   └── ... (16 Parameter total)
│   │   └── connectedAccounts: map
│   │       ├── gmail: boolean
│   │       ├── finapi: boolean
│   │       └── finapiConsentExpiry: timestamp | null
│   │
│   ├── contracts/{contractId}            ← Subcollection
│   │   ├── provider: string
│   │   ├── productName: string
│   │   ├── category: "TELECOM"|"INSURANCE"|"ENERGY"|"HOUSING"|...
│   │   ├── status: "ACTIVE"|"PENDING_CANCELLATION"|"CANCELLED"|"EXPIRED"
│   │   ├── monthlyPriceEur: number
│   │   ├── startDate: timestamp
│   │   ├── endDate: timestamp | null
│   │   ├── cancellationNoticeDays: number
│   │   ├── autoRenewal: boolean
│   │   ├── autoRenewalMonths: number
│   │   ├── notes: string | null
│   │   ├── analysisResult: map | null      ← Gemini-Analyse-Ergebnis
│   │   ├── riskLevel: "LOW"|"MEDIUM"|"HIGH"
│   │   ├── sharedWithVault: string | null  ← VaultID falls geteilt
│   │   ├── createdAt: timestamp
│   │   └── updatedAt: timestamp
│   │
│   ├── documents/{docId}                  ← Subcollection (Vault)
│   │   ├── fileName: string
│   │   ├── fileSize: number
│   │   ├── mimeType: string
│   │   ├── storagePath: string             ← Cloud Storage Pfad
│   │   ├── status: "UPLOADING"|"SCANNED"|"ANALYZING"|"IDENTIFIED"|...
│   │   ├── category: string
│   │   ├── detectedProvider: string | null
│   │   ├── analysisConfidence: number
│   │   ├── extractedText: string | null    ← OCR-Ergebnis
│   │   └── uploadedAt: timestamp
│   │
│   ├── lifeCases/{caseId}                 ← Subcollection
│   │   ├── title: string
│   │   ├── description: string
│   │   ├── category: "HOUSING"|"INSURANCE"|"LEGAL"|"WORK"|...
│   │   ├── status: "IDENTIFIED"|"DOCUMENTING"|"CORRESPONDENCE_ACTIVE"|...
│   │   ├── urgency: "LOW"|"MEDIUM"|"HIGH"|"CRITICAL"
│   │   ├── riskScore: number (0.0-1.0)
│   │   ├── participants: array<map>
│   │   ├── timeline: array<map>
│   │   ├── createdAt: timestamp
│   │   └── lastUpdate: timestamp
│   │
│   ├── approvals/{approvalId}             ← Subcollection
│   │   ├── agentType: "NEGOTIATION"|"SWITCHING"|"CLAIM"
│   │   ├── status: "PENDING"|"APPROVED"|"REJECTED"|"EXPIRED"|"AUTO_APPROVED"
│   │   ├── actionSummary: string
│   │   ├── actionDetail: string
│   │   ├── affectedProvider: string
│   │   ├── affectedContractId: string | null
│   │   ├── estimatedSavingEur: number
│   │   ├── riskLevel: "LOW"|"MEDIUM"|"HIGH"
│   │   ├── createdAt: timestamp
│   │   └── expiresAt: timestamp
│   │
│   ├── claims/{claimId}                   ← Subcollection
│   │   ├── type: string
│   │   ├── status: "DETECTED"|"APPROVED"|"SUBMITTED"|"ACCEPTED"|...
│   │   ├── provider: string
│   │   ├── description: string
│   │   ├── compensationEur: number
│   │   ├── userPayoutEur: number
│   │   ├── sovereignFeeEur: number
│   │   ├── filedAt: timestamp
│   │   └── resolvedAt: timestamp | null
│   │
│   ├── savings/{savingId}                 ← Subcollection
│   │   ├── agentType: string
│   │   ├── savingAmountEur: number
│   │   ├── savingType: "MONTHLY"|"ONE_TIME"|"ANNUAL"
│   │   ├── provider: string
│   │   ├── description: string
│   │   └── achievedAt: timestamp
│   │
│   ├── transactions/{txId}                ← Subcollection (Bank)
│   │   ├── amount: number
│   │   ├── currency: string (default: "EUR")
│   │   ├── counterpartName: string
│   │   ├── purpose: string
│   │   ├── bookingDate: timestamp
│   │   └── source: "CSV_IMPORT"|"FINAPI"|"MANUAL"
│   │
│   ├── insights/{insightId}               ← Subcollection (Finance Guardian)
│   │   ├── type: "PRICE_INCREASE"|"NEW_SUBSCRIPTION"|"UNUSUAL_ACTIVITY"|...
│   │   ├── merchantName: string
│   │   ├── amount: number
│   │   ├── previousAmount: number | null
│   │   ├── description: string
│   │   ├── isActionable: boolean
│   │   └── timestamp: timestamp
│   │
│   └── agentMemories/{memoryId}           ← Subcollection
│       ├── category: "USER_PREFERENCE"|"PROVIDER_FACT"|"FINANCIAL_PATTERN"|...
│       ├── key: string
│       ├── value: string
│       ├── importance: number (0.0-1.0)
│       ├── source: string
│       ├── createdAt: timestamp
│       └── lastAccessedAt: timestamp
│
├── vaults/{vaultId}/                      ← Family Vault (Multi-User)
│   ├── name: string
│   ├── ownerId: string (uid)
│   ├── createdAt: timestamp
│   ├── members/{memberId}                 ← Subcollection
│   │   ├── userId: string
│   │   ├── displayName: string
│   │   ├── email: string
│   │   ├── role: "ADMIN"|"MEMBER"|"VIEWER"
│   │   └── joinedAt: timestamp
│   ├── sharedContracts/{contractId}       ← Kopie/Referenz
│   └── auditLog/{logId}                   ← Wer hat was wann getan
│       ├── userId: string
│       ├── action: string
│       ├── details: string
│       └── timestamp: timestamp
│
├── invites/{inviteId}/                    ← Einladungen (TTL: 7 Tage)
│   ├── vaultId: string
│   ├── invitedBy: string (uid)
│   ├── email: string
│   ├── role: "MEMBER"|"VIEWER"
│   ├── token: string (signiert)
│   ├── createdAt: timestamp
│   └── expiresAt: timestamp
│
└── platform/                              ← System-Dokumente
    ├── stats                              ← Globale Statistiken
    │   ├── totalUsers: number
    │   ├── totalContractsAnalyzed: number
    │   ├── totalSavingsEur: number
    │   └── lastUpdated: timestamp
    └── config                             ← Feature-Flags, Maintenance-Mode
        ├── maintenanceMode: boolean
        ├── minAppVersion: string
        └── featureFlags: map
```

### 5.3 Firestore Security Rules

```javascript
// firestore.rules
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // ══════════════════════════════════════════════
    // HILFSFUNKTIONEN
    // ══════════════════════════════════════════════

    function isAuthenticated() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    function isVaultMember(vaultId) {
      return isAuthenticated()
        && exists(/databases/$(database)/documents/vaults/$(vaultId)/members/$(request.auth.uid));
    }

    function isVaultAdmin(vaultId) {
      return isAuthenticated()
        && get(/databases/$(database)/documents/vaults/$(vaultId)/members/$(request.auth.uid)).data.role == "ADMIN";
    }

    function hasValidTier(requiredTiers) {
      let userTier = get(/databases/$(database)/documents/users/$(request.auth.uid)/profile).data.tier;
      return userTier in requiredTiers;
    }

    // ══════════════════════════════════════════════
    // USER-DATEN (private, nur eigene)
    // ══════════════════════════════════════════════

    match /users/{userId} {
      // Profil & Settings: nur der eigene User
      match /profile {
        allow read: if isOwner(userId);
        allow write: if isOwner(userId);
      }

      match /settings {
        allow read, write: if isOwner(userId);
      }

      // Alle Subcollections: nur eigene Daten
      match /contracts/{contractId} {
        allow read, write: if isOwner(userId);
      }

      match /documents/{docId} {
        allow read, write: if isOwner(userId);
      }

      match /lifeCases/{caseId} {
        allow read, write: if isOwner(userId);
      }

      match /approvals/{approvalId} {
        allow read: if isOwner(userId);
        allow update: if isOwner(userId)
          && request.resource.data.status in ["APPROVED", "REJECTED"];
        allow create: if false;  // Nur Backend erstellt Approvals
        allow delete: if false;
      }

      match /claims/{claimId} {
        allow read: if isOwner(userId);
        allow create: if isOwner(userId)
          && hasValidTier(["PRO", "SHIELD"]);
        allow update: if false;  // Nur Backend aktualisiert Claims
        allow delete: if false;
      }

      match /savings/{savingId} {
        allow read: if isOwner(userId);
        allow write: if false;  // Nur Backend schreibt Savings
      }

      match /transactions/{txId} {
        allow read: if isOwner(userId);
        allow create: if isOwner(userId);
        allow update, delete: if isOwner(userId);
      }

      match /insights/{insightId} {
        allow read: if isOwner(userId);
        allow write: if false;  // Nur Backend/AI schreibt Insights
      }

      match /agentMemories/{memoryId} {
        allow read: if isOwner(userId);
        allow write: if false;  // Nur Backend/AI schreibt Memories
      }
    }

    // ══════════════════════════════════════════════
    // FAMILY VAULT (Multi-User)
    // ══════════════════════════════════════════════

    match /vaults/{vaultId} {
      allow read: if isVaultMember(vaultId);
      allow create: if isAuthenticated()
        && hasValidTier(["SHIELD"]);
      allow update: if isVaultAdmin(vaultId);
      allow delete: if isVaultAdmin(vaultId);

      match /members/{memberId} {
        allow read: if isVaultMember(vaultId);
        allow write: if isVaultAdmin(vaultId);
      }

      match /sharedContracts/{contractId} {
        allow read: if isVaultMember(vaultId);
        allow write: if isVaultMember(vaultId)
          && get(/databases/$(database)/documents/vaults/$(vaultId)/members/$(request.auth.uid)).data.role in ["ADMIN", "MEMBER"];
      }

      match /auditLog/{logId} {
        allow read: if isVaultMember(vaultId);
        allow write: if false;  // Nur Backend schreibt Audit-Logs
      }
    }

    // ══════════════════════════════════════════════
    // EINLADUNGEN
    // ══════════════════════════════════════════════

    match /invites/{inviteId} {
      allow read: if isAuthenticated()
        && resource.data.email == request.auth.token.email;
      allow create: if isAuthenticated();  // Backend validiert Vault-Ownership
      allow update: if isAuthenticated()
        && resource.data.email == request.auth.token.email;
      allow delete: if false;
    }

    // ══════════════════════════════════════════════
    // PLATFORM (öffentliche Stats + Config)
    // ══════════════════════════════════════════════

    match /platform/{doc} {
      allow read: if true;   // Stats sind öffentlich (Landing Page)
      allow write: if false;  // Nur Backend schreibt
    }

    // ══════════════════════════════════════════════
    // DEFAULT: Alles andere verbieten
    // ══════════════════════════════════════════════

    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### 5.4 Firestore Security Rules deployen

```bash
firebase deploy --only firestore:rules --project=$PROJECT_ID
```

### 5.5 Firestore Indexes

```json
// firestore.indexes.json
{
  "indexes": [
    {
      "collectionGroup": "contracts",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "updatedAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "contracts",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "category", "order": "ASCENDING" },
        { "fieldPath": "monthlyPriceEur", "order": "ASCENDING" }
      ]
    },
    {
      "collectionGroup": "approvals",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "transactions",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "bookingDate", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "insights",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "isActionable", "order": "ASCENDING" },
        { "fieldPath": "timestamp", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "lifeCases",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "urgency", "order": "DESCENDING" },
        { "fieldPath": "lastUpdate", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "agentMemories",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "category", "order": "ASCENDING" },
        { "fieldPath": "importance", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "savings",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "achievedAt", "order": "DESCENDING" }
      ]
    }
  ],
  "fieldOverrides": []
}
```

```bash
firebase deploy --only firestore:indexes --project=$PROJECT_ID
```

---

## 6. FastAPI Backend — Vollständiger Code

### 6.1 Projektstruktur

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                    ← FastAPI App-Entry
│   ├── config.py                  ← Umgebungsvariablen
│   ├── dependencies.py            ← Shared Dependencies (Auth, DB)
│   │
│   ├── middleware/
│   │   ├── __init__.py
│   │   ├── auth.py                ← Firebase Token-Verifizierung
│   │   ├── rate_limit.py          ← Rate Limiting
│   │   └── tier_check.py          ← Tier-basierte Feature-Gates
│   │
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── contracts.py           ← /v2/contracts/*
│   │   ├── approvals.py           ← /v2/approvals/*
│   │   ├── claims.py              ← /v2/claims/*
│   │   ├── finance.py             ← /v2/finance/*
│   │   ├── ai.py                  ← /v2/ai/* (Gemini-Proxy)
│   │   ├── user.py                ← /v2/user/* (Profil, Settings)
│   │   ├── billing.py             ← /v2/billing/* (Stripe)
│   │   ├── family.py              ← /v2/family/* (Multi-User)
│   │   └── public.py              ← /v2/public/* (Stats, Pricing)
│   │
│   ├── services/
│   │   ├── __init__.py
│   │   ├── firestore_service.py   ← Firestore CRUD-Operationen
│   │   ├── gemini_service.py      ← Vertex AI / Gemini Calls
│   │   ├── stripe_service.py      ← Stripe Subscription Management
│   │   ├── finapi_service.py      ← finAPI PSD2-Integration
│   │   └── notification_service.py ← FCM Push Notifications
│   │
│   └── models/
│       ├── __init__.py
│       ├── contract.py            ← Pydantic Models
│       ├── approval.py
│       ├── claim.py
│       ├── finance.py
│       ├── user.py
│       └── common.py              ← Shared Enums, Base Models
│
├── tests/
│   ├── test_contracts.py
│   ├── test_auth.py
│   └── test_ai.py
│
├── requirements.txt
├── Dockerfile
├── .env.example
└── cloudbuild.yaml
```

### 6.2 `requirements.txt`

```
# Backend Framework
fastapi==0.115.0
uvicorn[standard]==0.32.0
python-multipart==0.0.12

# Firebase / Google Cloud
firebase-admin==6.5.0
google-cloud-firestore==2.19.0
google-cloud-aiplatform==1.71.0
google-cloud-secret-manager==2.20.0

# Stripe
stripe==10.12.0

# HTTP Client (finAPI)
httpx==0.27.0

# Validation
pydantic==2.9.0
pydantic-settings==2.5.0

# Rate Limiting
slowapi==0.1.9

# Testing
pytest==8.3.0
pytest-asyncio==0.24.0
httpx==0.27.0
```

### 6.3 `app/config.py`

```python
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # GCP
    project_id: str = "sovereign-platform"
    region: str = "europe-west1"

    # API
    api_version: str = "v2"
    debug: bool = False

    # CORS
    allowed_origins: list[str] = [
        "https://sovereign.de",
        "https://app.sovereign.de",
        "http://localhost:3000",
    ]

    # Rate Limiting
    rate_limit_per_minute: int = 60

    # Stripe (aus Secret Manager geladen)
    stripe_secret_key: str = ""
    stripe_webhook_secret: str = ""

    # finAPI
    finapi_client_id: str = ""
    finapi_client_secret: str = ""
    finapi_base_url: str = "https://live.finapi.io"

    # Gemini
    gemini_model: str = "gemini-2.5-flash"
    gemini_model_pro: str = "gemini-2.5-pro"

    class Config:
        env_file = ".env"


@lru_cache()
def get_settings() -> Settings:
    return Settings()
```

### 6.4 `app/main.py`

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.middleware import SlowAPIMiddleware

from app.config import get_settings
from app.routers import (
    contracts, approvals, claims, finance,
    ai, user, billing, family, public
)

settings = get_settings()

# ═══════════════════════════════════════════
# APP INITIALIZATION
# ═══════════════════════════════════════════

app = FastAPI(
    title="SOVEREIGN Platform API",
    version="2.0.0",
    description="Unified Backend for Mobile App, Web App & Landing Page",
    docs_url="/docs" if settings.debug else None,
    redoc_url="/redoc" if settings.debug else None,
)

# ═══════════════════════════════════════════
# MIDDLEWARE
# ═══════════════════════════════════════════

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
    allow_headers=["*"],
)

# Rate Limiting
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_middleware(SlowAPIMiddleware)

# ═══════════════════════════════════════════
# ROUTERS
# ═══════════════════════════════════════════

# Authenticated Endpoints (Mobile + Web)
app.include_router(contracts.router, prefix="/v2/contracts", tags=["Contracts"])
app.include_router(approvals.router, prefix="/v2/approvals", tags=["Approvals"])
app.include_router(claims.router,    prefix="/v2/claims",    tags=["Claims"])
app.include_router(finance.router,   prefix="/v2/finance",   tags=["Finance"])
app.include_router(ai.router,        prefix="/v2/ai",        tags=["AI"])
app.include_router(user.router,      prefix="/v2/user",      tags=["User"])
app.include_router(billing.router,   prefix="/v2/billing",   tags=["Billing"])
app.include_router(family.router,    prefix="/v2/family",     tags=["Family"])

# Public Endpoints (Landing Page, no auth)
app.include_router(public.router, prefix="/v2/public", tags=["Public"])


# ═══════════════════════════════════════════
# HEALTH CHECK
# ═══════════════════════════════════════════

@app.get("/health", tags=["System"])
async def health_check():
    return {"status": "ok", "version": "2.0.0", "platform": "SOVEREIGN"}
```

### 6.5 `app/middleware/auth.py`

```python
from fastapi import Depends, HTTPException, Header
from firebase_admin import auth as firebase_auth, initialize_app, get_app
from typing import Optional

# Firebase Admin SDK initialisieren (einmalig)
try:
    get_app()
except ValueError:
    initialize_app()


async def get_current_user(authorization: str = Header(...)) -> dict:
    """
    Verifiziert das Firebase ID-Token aus dem Authorization-Header.
    Gibt den dekodierten Token zurück (enthält uid, email, etc.)
    """
    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=401,
            detail="Authorization header must start with 'Bearer '"
        )

    token = authorization.split("Bearer ")[1]

    try:
        decoded_token = firebase_auth.verify_id_token(token)
        return decoded_token
    except firebase_auth.ExpiredIdTokenError:
        raise HTTPException(status_code=401, detail="Token expired")
    except firebase_auth.RevokedIdTokenError:
        raise HTTPException(status_code=401, detail="Token revoked")
    except firebase_auth.InvalidIdTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Authentication failed: {str(e)}")


async def get_optional_user(
    authorization: Optional[str] = Header(None)
) -> Optional[dict]:
    """Optionale Authentifizierung (für Public-Endpoints mit optionalem Login)."""
    if authorization is None:
        return None
    return await get_current_user(authorization)
```

### 6.6 `app/middleware/tier_check.py`

```python
from fastapi import Depends, HTTPException
from google.cloud import firestore

from app.middleware.auth import get_current_user

db = firestore.Client()


async def require_pro(user: dict = Depends(get_current_user)) -> dict:
    """Erfordert mindestens PRO-Tier."""
    profile = db.collection("users").document(user["uid"]).collection("profile").document("profile").get()
    if not profile.exists:
        raise HTTPException(status_code=403, detail="User profile not found")

    tier = profile.to_dict().get("tier", "FREE")
    if tier not in ("PRO", "SHIELD"):
        raise HTTPException(
            status_code=403,
            detail="This feature requires SOVEREIGN PRO or SHIELD"
        )
    user["tier"] = tier
    return user


async def require_shield(user: dict = Depends(get_current_user)) -> dict:
    """Erfordert SHIELD-Tier."""
    profile = db.collection("users").document(user["uid"]).collection("profile").document("profile").get()
    if not profile.exists:
        raise HTTPException(status_code=403, detail="User profile not found")

    tier = profile.to_dict().get("tier", "FREE")
    if tier != "SHIELD":
        raise HTTPException(
            status_code=403,
            detail="This feature requires SOVEREIGN SHIELD"
        )
    user["tier"] = tier
    return user
```

### 6.7 `app/routers/contracts.py`

```python
from fastapi import APIRouter, Depends, HTTPException
from google.cloud import firestore
from datetime import datetime
from typing import Optional

from app.middleware.auth import get_current_user
from app.models.contract import ContractCreate, ContractResponse

router = APIRouter()
db = firestore.Client()


@router.get("/", response_model=list[ContractResponse])
async def get_contracts(
    status: Optional[str] = None,
    category: Optional[str] = None,
    user: dict = Depends(get_current_user)
):
    """Alle Verträge des Users abrufen."""
    ref = db.collection("users").document(user["uid"]).collection("contracts")

    if status:
        ref = ref.where("status", "==", status)
    if category:
        ref = ref.where("category", "==", category)

    docs = ref.order_by("updatedAt", direction=firestore.Query.DESCENDING).stream()
    return [{"id": doc.id, **doc.to_dict()} for doc in docs]


@router.get("/{contract_id}", response_model=ContractResponse)
async def get_contract(
    contract_id: str,
    user: dict = Depends(get_current_user)
):
    """Einzelnen Vertrag abrufen."""
    doc = db.collection("users").document(user["uid"]) \
        .collection("contracts").document(contract_id).get()

    if not doc.exists:
        raise HTTPException(status_code=404, detail="Contract not found")

    return {"id": doc.id, **doc.to_dict()}


@router.post("/", status_code=201)
async def create_contract(
    contract: ContractCreate,
    user: dict = Depends(get_current_user)
):
    """Neuen Vertrag anlegen."""
    # Tier-basiertes Limit prüfen
    existing = db.collection("users").document(user["uid"]) \
        .collection("contracts").count().get()

    count = existing[0][0].value
    profile = db.collection("users").document(user["uid"]).document("profile").get()
    tier = profile.to_dict().get("tier", "FREE") if profile.exists else "FREE"

    if tier == "FREE" and count >= 3:
        raise HTTPException(
            status_code=403,
            detail="Free tier is limited to 3 contracts. Upgrade to PRO for unlimited."
        )

    data = contract.model_dump()
    data["createdAt"] = datetime.utcnow()
    data["updatedAt"] = datetime.utcnow()

    _, ref = db.collection("users").document(user["uid"]) \
        .collection("contracts").add(data)

    return {"id": ref.id, "status": "created"}


@router.delete("/{contract_id}")
async def delete_contract(
    contract_id: str,
    user: dict = Depends(get_current_user)
):
    """Vertrag löschen."""
    ref = db.collection("users").document(user["uid"]) \
        .collection("contracts").document(contract_id)

    if not ref.get().exists:
        raise HTTPException(status_code=404, detail="Contract not found")

    ref.delete()
    return {"status": "deleted"}
```

### 6.8 `app/routers/ai.py`

```python
from fastapi import APIRouter, Depends, HTTPException
from google.cloud import firestore
from google import genai
from google.genai import types

from app.middleware.auth import get_current_user
from app.middleware.tier_check import require_pro
from app.config import get_settings

router = APIRouter()
db = firestore.Client()
settings = get_settings()

# Gemini Client
client = genai.Client(project=settings.project_id, location=settings.region)


@router.post("/analyze-contract")
async def analyze_contract(
    text: str,
    user: dict = Depends(get_current_user)
):
    """Vertragstext via Gemini analysieren."""
    # Portfolio-Kontext laden
    memories = db.collection("users").document(user["uid"]) \
        .collection("agentMemories") \
        .order_by("importance", direction=firestore.Query.DESCENDING) \
        .limit(10).stream()

    memory_context = "\n".join([
        f"- {m.to_dict()['key']}: {m.to_dict()['value']}"
        for m in memories
    ])

    contracts = db.collection("users").document(user["uid"]) \
        .collection("contracts") \
        .where("status", "==", "ACTIVE").stream()

    contract_context = "\n".join([
        f"  - {c.to_dict()['provider']} ({c.to_dict()['category']}): {c.to_dict()['monthlyPriceEur']}€/Monat"
        for c in contracts
    ])

    prompt = f"""Du bist Sovereign AI, ein hochspezialisierter Vertragsanalyst.
Standard: Google Premium Quality — präzise, analytisch, strukturiert.

PORTFOLIO-KONTEXT DES NUTZERS:
{memory_context}

AKTIVE VERTRÄGE:
{contract_context}

AUFGABE:
Analysiere den folgenden Vertragstext vollständig.

VERTRAGSTEXT:
{text}

AUSGABE (strikt JSON):
{{
  "provider": "string",
  "productName": "string",
  "category": "TELECOM|INSURANCE|ENERGY|HOUSING|STREAMING|FITNESS|OTHER",
  "monthlyPriceEur": 0.00,
  "cancellationNoticeDays": 30,
  "autoRenewal": true,
  "autoRenewalMonths": 12,
  "riskLevel": "LOW|MEDIUM|HIGH",
  "insights": [
    {{"title": "string", "description": "string", "type": "POTENTIAL_SAVING|RISK_DETECTED|MARKET_COMPARISON|ACTION_REQUIRED"}}
  ],
  "confidence": 0.85
}}"""

    response = client.models.generate_content(
        model=settings.gemini_model,
        contents=prompt,
        config=types.GenerateContentConfig(
            temperature=0.2,
            max_output_tokens=8192,
            response_mime_type="application/json",
        ),
    )

    return {"analysis": response.text}


@router.post("/compare-market")
async def compare_market(
    provider: str,
    category: str,
    current_price: float,
    postal_code: str,
    user: dict = Depends(require_pro)
):
    """Marktvergleich via Gemini Web-Grounding (kein Check24 nötig)."""
    grounding_tool = types.Tool(google_search=types.GoogleSearch())

    prompt = f"""Der Nutzer hat einen {category}-Vertrag bei {provider} für {current_price}€/Monat.
PLZ: {postal_code}.

Suche aktuelle Anbieter und Tarife in dieser Region:
1. Die 5 günstigsten Alternativen mit Preis und Konditionen
2. Ökostrom/Öko-Optionen separat (falls Energie)
3. Vergleich zum aktuellen Vertrag: Sparpotenzial pro Monat und Jahr

Nenne für jeden Tarif die Quelle (URL)."""

    response = client.models.generate_content(
        model=settings.gemini_model,
        contents=prompt,
        config=types.GenerateContentConfig(
            tools=[grounding_tool],
            temperature=0.1,
            max_output_tokens=4096,
        ),
    )

    return {
        "comparison": response.text,
        "sources": [
            chunk.web.uri
            for chunk in (response.candidates[0].grounding_metadata.grounding_chunks or [])
            if hasattr(chunk, "web")
        ]
    }
```

### 6.9 `app/routers/billing.py`

```python
from fastapi import APIRouter, Depends, HTTPException, Request
from google.cloud import firestore
import stripe

from app.middleware.auth import get_current_user
from app.config import get_settings

router = APIRouter()
db = firestore.Client()
settings = get_settings()
stripe.api_key = settings.stripe_secret_key

# Stripe Price IDs (in Stripe Dashboard erstellen)
PRICE_IDS = {
    "PRO_MONTHLY": "price_PRO_MONTHLY_ID",
    "PRO_YEARLY": "price_PRO_YEARLY_ID",
    "SHIELD_MONTHLY": "price_SHIELD_MONTHLY_ID",
    "SHIELD_YEARLY": "price_SHIELD_YEARLY_ID",
}


@router.post("/create-checkout")
async def create_checkout_session(
    plan: str,  # "PRO_MONTHLY", "PRO_YEARLY", "SHIELD_MONTHLY", "SHIELD_YEARLY"
    user: dict = Depends(get_current_user)
):
    """Stripe Checkout Session erstellen (Web-App)."""
    if plan not in PRICE_IDS:
        raise HTTPException(status_code=400, detail=f"Invalid plan: {plan}")

    # Stripe Customer erstellen oder vorhandenen verwenden
    profile_ref = db.collection("users").document(user["uid"]).document("profile")
    profile = profile_ref.get()
    customer_id = profile.to_dict().get("stripeCustomerId") if profile.exists else None

    if not customer_id:
        customer = stripe.Customer.create(
            email=user.get("email"),
            metadata={"firebase_uid": user["uid"]}
        )
        customer_id = customer.id
        profile_ref.set({"stripeCustomerId": customer_id}, merge=True)

    session = stripe.checkout.Session.create(
        customer=customer_id,
        payment_method_types=["card", "sepa_debit"],
        line_items=[{"price": PRICE_IDS[plan], "quantity": 1}],
        mode="subscription",
        success_url="https://app.sovereign.de/billing/success?session_id={CHECKOUT_SESSION_ID}",
        cancel_url="https://app.sovereign.de/billing/cancel",
        metadata={"firebase_uid": user["uid"]},
    )

    return {"checkout_url": session.url, "session_id": session.id}


@router.post("/webhook")
async def stripe_webhook(request: Request):
    """Stripe Webhook — aktualisiert User-Tier bei Subscription-Änderungen."""
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.stripe_webhook_secret
        )
    except (ValueError, stripe.error.SignatureVerificationError):
        raise HTTPException(status_code=400, detail="Invalid webhook")

    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        uid = session["metadata"]["firebase_uid"]
        subscription = stripe.Subscription.retrieve(session["subscription"])
        price_id = subscription["items"]["data"][0]["price"]["id"]

        # Tier bestimmen
        tier = "FREE"
        if price_id in (PRICE_IDS["PRO_MONTHLY"], PRICE_IDS["PRO_YEARLY"]):
            tier = "PRO"
        elif price_id in (PRICE_IDS["SHIELD_MONTHLY"], PRICE_IDS["SHIELD_YEARLY"]):
            tier = "SHIELD"

        # User-Tier aktualisieren
        db.collection("users").document(uid).document("profile").set({
            "tier": tier,
            "stripeSubscriptionId": subscription.id
        }, merge=True)

    elif event["type"] == "customer.subscription.deleted":
        subscription = event["data"]["object"]
        # Customer → UID mapping
        customer = stripe.Customer.retrieve(subscription["customer"])
        uid = customer["metadata"].get("firebase_uid")
        if uid:
            db.collection("users").document(uid).document("profile").set({
                "tier": "FREE",
                "stripeSubscriptionId": None
            }, merge=True)

    return {"status": "ok"}


@router.get("/subscription")
async def get_subscription(user: dict = Depends(get_current_user)):
    """Aktuellen Subscription-Status abrufen."""
    profile = db.collection("users").document(user["uid"]).document("profile").get()
    if not profile.exists:
        return {"tier": "FREE", "subscription": None}

    data = profile.to_dict()
    sub_id = data.get("stripeSubscriptionId")

    if sub_id:
        try:
            subscription = stripe.Subscription.retrieve(sub_id)
            return {
                "tier": data.get("tier", "FREE"),
                "subscription": {
                    "status": subscription.status,
                    "current_period_end": subscription.current_period_end,
                    "cancel_at_period_end": subscription.cancel_at_period_end,
                }
            }
        except stripe.error.StripeError:
            pass

    return {"tier": data.get("tier", "FREE"), "subscription": None}
```

### 6.10 `app/routers/public.py`

```python
from fastapi import APIRouter
from google.cloud import firestore

router = APIRouter()
db = firestore.Client()


@router.get("/stats")
async def get_platform_stats():
    """Öffentliche Plattform-Statistiken (für Landing Page)."""
    stats = db.collection("platform").document("stats").get()
    if stats.exists:
        return stats.to_dict()
    return {
        "totalUsers": 0,
        "totalContractsAnalyzed": 0,
        "totalSavingsEur": 0,
    }


@router.get("/pricing")
async def get_pricing():
    """Pricing-Daten (für Landing Page)."""
    return {
        "tiers": [
            {
                "name": "FREE",
                "price_monthly_eur": 0,
                "features": [
                    "3 Verträge",
                    "Basis-Scan",
                    "1 Life-Case",
                    "Dashboard",
                    "5 AI-Chats/Tag",
                ]
            },
            {
                "name": "PRO",
                "price_monthly_eur": 6.99,
                "price_yearly_eur": 69.90,
                "features": [
                    "Unbegrenzte Verträge",
                    "Deep Clause Engine",
                    "5 Life-Cases",
                    "Finance Guardian",
                    "50 AI-Chats/Tag",
                    "E-Mail-Analyse",
                    "Vertrags-Radar",
                    "Widget",
                ]
            },
            {
                "name": "SHIELD",
                "price_monthly_eur": 14.99,
                "price_yearly_eur": 149.90,
                "features": [
                    "Alles aus PRO",
                    "Unbegrenzte AI-Chats",
                    "Execution Engine (Gmail)",
                    "Bank-Anbindung (PSD2)",
                    "Professional Shield (B2B)",
                    "Multi-User / Familie (5)",
                    "Gemini Live (Voice+Cam)",
                    "Priority Support",
                ]
            }
        ],
        "add_ons": [
            {"name": "Premium-Kündigung (Einschreiben)", "price_eur": 4.99},
            {"name": "Rechtssichere Vorlage", "price_eur": 2.99},
        ],
        "claims_fee_percent": 25,
    }


@router.get("/health")
async def public_health():
    return {"status": "ok"}
```

### 6.11 `app/models/contract.py`

```python
from pydantic import BaseModel, Field
from typing import Optional
from enum import Enum


class ContractCategory(str, Enum):
    TELECOM = "TELECOM"
    INSURANCE = "INSURANCE"
    ENERGY = "ENERGY"
    HOUSING = "HOUSING"
    STREAMING = "STREAMING"
    FITNESS = "FITNESS"
    MOBILITY = "MOBILITY"
    OTHER = "OTHER"


class ContractStatus(str, Enum):
    ACTIVE = "ACTIVE"
    PENDING_CANCELLATION = "PENDING_CANCELLATION"
    CANCELLED = "CANCELLED"
    EXPIRED = "EXPIRED"
    DRAFT = "DRAFT"


class ContractCreate(BaseModel):
    provider: str = Field(..., min_length=1, max_length=200)
    productName: str = Field(..., min_length=1, max_length=200)
    category: ContractCategory
    status: ContractStatus = ContractStatus.ACTIVE
    monthlyPriceEur: float = Field(..., ge=0)
    startDate: Optional[str] = None
    endDate: Optional[str] = None
    cancellationNoticeDays: int = Field(default=30, ge=0)
    autoRenewal: bool = False
    autoRenewalMonths: int = Field(default=0, ge=0)
    notes: Optional[str] = None


class ContractResponse(ContractCreate):
    id: str
    riskLevel: Optional[str] = None
    analysisResult: Optional[dict] = None
    createdAt: Optional[str] = None
    updatedAt: Optional[str] = None

    class Config:
        from_attributes = True
```

---

## 7. Docker & Cloud Run

### 7.1 `Dockerfile`

```dockerfile
FROM python:3.11-slim

# Arbeitsverzeichnis
WORKDIR /app

# System-Dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Python-Dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# App-Code
COPY app/ ./app/

# Port (Cloud Run erwartet PORT-Env)
ENV PORT=8080

# Start
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080", "--workers", "2"]
```

### 7.2 Docker-Image bauen & pushen

```bash
# Image bauen
docker build -t ${REGION}-docker.pkg.dev/${PROJECT_ID}/sovereign-docker/backend:latest ./backend

# Bei Artifact Registry authentifizieren
gcloud auth configure-docker ${REGION}-docker.pkg.dev

# Image pushen
docker push ${REGION}-docker.pkg.dev/${PROJECT_ID}/sovereign-docker/backend:latest
```

### 7.3 Cloud Run Service deployen

```bash
gcloud run deploy sovereign-backend \
  --image=${REGION}-docker.pkg.dev/${PROJECT_ID}/sovereign-docker/backend:latest \
  --region=$REGION \
  --platform=managed \
  --service-account=$SA_EMAIL \
  --allow-unauthenticated \
  --port=8080 \
  --memory=512Mi \
  --cpu=1 \
  --min-instances=0 \
  --max-instances=10 \
  --timeout=60 \
  --set-env-vars="PROJECT_ID=${PROJECT_ID},REGION=${REGION}" \
  --set-secrets="STRIPE_SECRET_KEY=stripe-secret-key:latest,STRIPE_WEBHOOK_SECRET=stripe-webhook-secret:latest,FINAPI_CLIENT_ID=finapi-client-id:latest,FINAPI_CLIENT_SECRET=finapi-client-secret:latest"

# URL abrufen
gcloud run services describe sovereign-backend \
  --region=$REGION \
  --format="value(status.url)"
```

### 7.4 Custom Domain für Cloud Run

```bash
# Domain-Mapping erstellen (api.sovereign.de → Cloud Run)
gcloud run domain-mappings create \
  --service=sovereign-backend \
  --domain=api.sovereign.de \
  --region=$REGION
```

---

## 8. Firebase Hosting — Web App & Landing Page

### 8.1 `firebase.json` (Multi-Site Hosting)

```json
{
  "hosting": [
    {
      "site": "sovereign-landing",
      "public": "landing/out",
      "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
      "rewrites": [
        { "source": "**", "destination": "/index.html" }
      ],
      "headers": [
        {
          "source": "**/*.@(js|css|svg|png|webp|woff2)",
          "headers": [
            { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
          ]
        },
        {
          "source": "**",
          "headers": [
            { "key": "X-Frame-Options", "value": "DENY" },
            { "key": "X-Content-Type-Options", "value": "nosniff" },
            { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
            { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" }
          ]
        }
      ]
    },
    {
      "site": "sovereign-webapp",
      "public": "web/out",
      "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
      "rewrites": [
        { "source": "**", "destination": "/index.html" }
      ],
      "headers": [
        {
          "source": "**",
          "headers": [
            { "key": "X-Frame-Options", "value": "DENY" },
            { "key": "X-Content-Type-Options", "value": "nosniff" },
            { "key": "Strict-Transport-Security", "value": "max-age=63072000; includeSubDomains; preload" }
          ]
        }
      ]
    }
  ],
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  }
}
```

### 8.2 Hosting-Sites erstellen & deployen

```bash
# Sites erstellen
firebase hosting:sites:create sovereign-landing --project=$PROJECT_ID
firebase hosting:sites:create sovereign-webapp --project=$PROJECT_ID

# Custom Domains verknüpfen
firebase hosting:channel:deploy --site=sovereign-landing --project=$PROJECT_ID
firebase hosting:channel:deploy --site=sovereign-webapp --project=$PROJECT_ID

# Landing Page bauen & deployen
cd landing && npm run build && cd ..
firebase deploy --only hosting:sovereign-landing --project=$PROJECT_ID

# Web App bauen & deployen
cd web && npm run build && cd ..
firebase deploy --only hosting:sovereign-webapp --project=$PROJECT_ID
```

### 8.3 Custom Domains konfigurieren

```bash
# sovereign.de → Landing Page
firebase hosting:sites:update sovereign-landing \
  --project=$PROJECT_ID

# In Firebase Console:
# → Hosting → sovereign-landing → Custom Domain → sovereign.de
# → Hosting → sovereign-webapp → Custom Domain → app.sovereign.de

# DNS-Einträge (bei eurem DNS-Provider):
# sovereign.de     A     151.101.1.195
# sovereign.de     A     151.101.65.195
# app.sovereign.de CNAME sovereign-webapp.web.app
# api.sovereign.de CNAME  → Cloud Run Domain Mapping
```

---

## 9. Cloud DNS & Custom Domains

### 9.1 Cloud DNS Zone erstellen (optional, wenn DNS über GCP)

```bash
# DNS-Zone erstellen
gcloud dns managed-zones create sovereign-zone \
  --dns-name="sovereign.de." \
  --description="SOVEREIGN Platform DNS" \
  --visibility=public

# A-Records für Landing Page (Firebase Hosting IPs)
gcloud dns record-sets create sovereign.de. \
  --zone=sovereign-zone \
  --type=A \
  --ttl=300 \
  --rrdatas="151.101.1.195,151.101.65.195"

# CNAME für Web App
gcloud dns record-sets create app.sovereign.de. \
  --zone=sovereign-zone \
  --type=CNAME \
  --ttl=300 \
  --rrdatas="sovereign-webapp.web.app."

# CNAME für API (Cloud Run)
gcloud dns record-sets create api.sovereign.de. \
  --zone=sovereign-zone \
  --type=CNAME \
  --ttl=300 \
  --rrdatas="sovereign-backend-HASH.run.app."

# TXT für Domain-Verifizierung
gcloud dns record-sets create sovereign.de. \
  --zone=sovereign-zone \
  --type=TXT \
  --ttl=300 \
  --rrdatas="\"google-site-verification=DEIN_CODE\""

# Nameserver abrufen (beim Domain-Registrar eintragen)
gcloud dns managed-zones describe sovereign-zone \
  --format="value(nameServers)"
```

---

## 10. Cloud CDN & Load Balancing

### 10.1 CDN für statische Assets (optional, Firebase Hosting hat eigenes CDN)

Firebase Hosting bringt bereits ein globales CDN mit. Ein separates Cloud CDN ist erst bei > 100K Nutzern oder komplexem Load Balancing nötig.

**Für den MVP:** Firebase Hosting CDN reicht vollkommen.

**Für Scale (50K+ User):** Cloud Load Balancer + Cloud CDN vor Cloud Run:

```bash
# Serverless NEG (Network Endpoint Group) erstellen
gcloud compute network-endpoint-groups create sovereign-neg \
  --region=$REGION \
  --network-endpoint-type=serverless \
  --cloud-run-service=sovereign-backend

# Backend Service erstellen
gcloud compute backend-services create sovereign-backend-service \
  --global \
  --load-balancing-scheme=EXTERNAL_MANAGED \
  --protocol=HTTPS \
  --enable-cdn \
  --cache-mode=CACHE_ALL_STATIC

# NEG zum Backend hinzufügen
gcloud compute backend-services add-backend sovereign-backend-service \
  --global \
  --network-endpoint-group=sovereign-neg \
  --network-endpoint-group-region=$REGION
```

---

## 11. Monitoring, Logging & Alerting

### 11.1 Uptime Check

```bash
# Uptime Check für API
gcloud monitoring uptime create \
  --display-name="SOVEREIGN API Health" \
  --resource-type=uptime-url \
  --hostname="api.sovereign.de" \
  --path="/health" \
  --check-every=300 \
  --timeout=10
```

### 11.2 Alert Policies

```bash
# Alert: API-Fehlerrate > 5%
gcloud monitoring policies create \
  --display-name="API Error Rate > 5%" \
  --condition-display-name="High Error Rate" \
  --condition-filter='resource.type="cloud_run_revision" AND metric.type="run.googleapis.com/request_count" AND metric.labels.response_code_class!="2xx"' \
  --condition-threshold-value=0.05 \
  --condition-threshold-comparison=COMPARISON_GT \
  --notification-channels="projects/${PROJECT_ID}/notificationChannels/CHANNEL_ID"

# Alert: Latenz > 5s
gcloud monitoring policies create \
  --display-name="API Latency > 5s" \
  --condition-display-name="High Latency" \
  --condition-filter='resource.type="cloud_run_revision" AND metric.type="run.googleapis.com/request_latencies"' \
  --condition-threshold-value=5000 \
  --condition-threshold-comparison=COMPARISON_GT
```

### 11.3 Budget-Alert

```bash
# Budget: €100/Monat mit Alerts bei 50%, 80%, 100%
gcloud billing budgets create \
  --billing-account=$BILLING_ACCOUNT_ID \
  --display-name="SOVEREIGN Platform Budget" \
  --budget-amount=100EUR \
  --threshold-rule=percent=0.5 \
  --threshold-rule=percent=0.8 \
  --threshold-rule=percent=1.0 \
  --filter-projects="projects/${PROJECT_ID}"
```

### 11.4 Log-basierte Metriken

```bash
# Custom Metric: Gemini API Calls zählen
gcloud logging metrics create gemini-api-calls \
  --description="Anzahl der Gemini API Aufrufe" \
  --log-filter='resource.type="cloud_run_revision" AND textPayload=~"gemini"'

# Custom Metric: Stripe Webhook Events
gcloud logging metrics create stripe-webhooks \
  --description="Stripe Webhook Events" \
  --log-filter='resource.type="cloud_run_revision" AND httpRequest.requestUrl=~"/v2/billing/webhook"'
```

---

## 12. CI/CD Pipeline

### 12.1 GitHub Actions — Backend Deploy

```yaml
# .github/workflows/deploy-backend.yml
name: Deploy Backend to Cloud Run

on:
  push:
    branches: [main]
    paths: ['backend/**']

env:
  PROJECT_ID: sovereign-platform
  REGION: europe-west1
  SERVICE: sovereign-backend
  IMAGE: europe-west1-docker.pkg.dev/sovereign-platform/sovereign-docker/backend

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - run: |
          cd backend
          pip install -r requirements.txt
          pip install pytest pytest-asyncio
          python -m pytest tests/ -v

  deploy:
    needs: test
    runs-on: ubuntu-latest
    permissions:
      contents: read
      id-token: write

    steps:
      - uses: actions/checkout@v4

      - uses: google-github-actions/auth@v2
        with:
          credentials_json: ${{ secrets.GCP_SA_KEY }}

      - uses: google-github-actions/setup-gcloud@v2
        with:
          project_id: ${{ env.PROJECT_ID }}

      - name: Configure Docker
        run: gcloud auth configure-docker ${{ env.REGION }}-docker.pkg.dev

      - name: Build & Push Docker Image
        run: |
          docker build -t ${{ env.IMAGE }}:${{ github.sha }} ./backend
          docker push ${{ env.IMAGE }}:${{ github.sha }}

      - name: Deploy to Cloud Run
        run: |
          gcloud run deploy ${{ env.SERVICE }} \
            --image=${{ env.IMAGE }}:${{ github.sha }} \
            --region=${{ env.REGION }} \
            --platform=managed
```

### 12.2 GitHub Actions — Web App Deploy

```yaml
# .github/workflows/deploy-web.yml
name: Deploy Web App to Firebase Hosting

on:
  push:
    branches: [main]
    paths: ['web/**']

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install & Build
        run: |
          cd web
          npm ci
          npm run build

      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: ${{ secrets.GITHUB_TOKEN }}
          firebaseServiceAccount: ${{ secrets.GCP_SA_KEY }}
          projectId: sovereign-platform
          target: sovereign-webapp
```

### 12.3 GitHub Actions — Landing Page Deploy

```yaml
# .github/workflows/deploy-landing.yml
name: Deploy Landing Page to Firebase Hosting

on:
  push:
    branches: [main]
    paths: ['landing/**']

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install & Build
        run: |
          cd landing
          npm ci
          npm run build

      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: ${{ secrets.GITHUB_TOKEN }}
          firebaseServiceAccount: ${{ secrets.GCP_SA_KEY }}
          projectId: sovereign-platform
          target: sovereign-landing
```

---

## 13. Stripe Integration

### 13.1 Stripe Setup (Dashboard)

```
1. Konto erstellen: https://dashboard.stripe.com/register
2. Produkte erstellen:
   - SOVEREIGN PRO Monthly  → €6.99/Monat
   - SOVEREIGN PRO Yearly   → €69.90/Jahr (2 Monate gratis)
   - SOVEREIGN SHIELD Monthly → €14.99/Monat
   - SOVEREIGN SHIELD Yearly  → €149.90/Jahr (2 Monate gratis)
3. Webhook konfigurieren:
   - URL: https://api.sovereign.de/v2/billing/webhook
   - Events:
     - checkout.session.completed
     - customer.subscription.created
     - customer.subscription.updated
     - customer.subscription.deleted
     - invoice.payment_succeeded
     - invoice.payment_failed
4. Zahlungsmethoden aktivieren:
   - Kreditkarte (Visa, Mastercard)
   - SEPA-Lastschrift
   - PayPal (via Stripe)
5. Kundenportal aktivieren:
   - URL: https://billing.stripe.com/p/login/DEIN_CODE
   - Erlaubt: Subscription kündigen, Zahlungsmethode ändern
```

### 13.2 Price IDs in Secret Manager speichern

```bash
echo -n '{"PRO_MONTHLY":"price_xxx","PRO_YEARLY":"price_xxx","SHIELD_MONTHLY":"price_xxx","SHIELD_YEARLY":"price_xxx"}' | \
  gcloud secrets create stripe-price-ids \
  --replication-policy="automatic" \
  --data-file=-
```

---

## 14. finAPI Integration (PSD2)

### 14.1 finAPI Setup

```
1. Konto erstellen: https://www.finapi.io/en/registration/
2. Plan: Access B2C (€60/Monat bis 200 User)
3. Sandbox-Credentials erhalten (für Entwicklung)
4. Live-Credentials beantragen (für Produktion)
5. PSD2 Web Form konfigurieren:
   - Redirect URL: https://app.sovereign.de/bank/callback
   - Mobile Redirect: sovereign://bank/callback (Deep Link)
```

### 14.2 finAPI Flow im Backend

```python
# app/services/finapi_service.py
import httpx
from app.config import get_settings

settings = get_settings()


class FinAPIService:
    def __init__(self):
        self.base_url = settings.finapi_base_url
        self.client_id = settings.finapi_client_id
        self.client_secret = settings.finapi_client_secret
        self._token = None

    async def _get_token(self) -> str:
        """OAuth2 Client Credentials Token holen."""
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/api/v2/oauth/token",
                data={
                    "grant_type": "client_credentials",
                    "client_id": self.client_id,
                    "client_secret": self.client_secret,
                }
            )
            response.raise_for_status()
            self._token = response.json()["access_token"]
            return self._token

    async def create_web_form(self, user_id: str, redirect_url: str) -> dict:
        """PSD2 Web Form erstellen — User authentifiziert sich bei seiner Bank."""
        token = await self._get_token()
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/api/v2/webForms/bankConnectionImport",
                headers={"Authorization": f"Bearer {token}"},
                json={
                    "callbacks": {
                        "finalised": f"{redirect_url}?userId={user_id}&status=success",
                        "cancelled": f"{redirect_url}?userId={user_id}&status=cancelled",
                    }
                }
            )
            response.raise_for_status()
            return response.json()  # Enthält webFormUrl

    async def get_transactions(self, bank_connection_id: str) -> list[dict]:
        """Transaktionen abrufen nach erfolgreicher Bankverbindung."""
        token = await self._get_token()
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/api/v2/transactions",
                headers={"Authorization": f"Bearer {token}"},
                params={
                    "bankConnectionId": bank_connection_id,
                    "order": "date,desc",
                    "perPage": 500,
                }
            )
            response.raise_for_status()
            return response.json().get("transactions", [])
```

---

## 15. Checkliste — Go-Live

### Pre-Launch (alles muss ✅ sein)

**GCP & Infrastruktur:**
- [ ] GCP-Projekt erstellt mit Billing
- [ ] Alle APIs aktiviert
- [ ] Service Accounts erstellt mit korrekten Rollen
- [ ] Secret Manager: Alle Secrets gespeichert
- [ ] Artifact Registry: Docker-Repo erstellt

**Firebase:**
- [ ] Firebase-Projekt initialisiert
- [ ] Authentication: E-Mail + Google aktiviert
- [ ] Android-App registriert, `google-services.json` im Repo
- [ ] Web-App registriert, `.env.local` konfiguriert
- [ ] Firestore: Database erstellt (eur3)
- [ ] Firestore: Security Rules deployed und getestet
- [ ] Firestore: Indexes deployed
- [ ] Hosting: Sites erstellt (Landing + Web App)

**Backend:**
- [ ] FastAPI-Code komplett und getestet
- [ ] Dockerfile baut ohne Fehler
- [ ] Image in Artifact Registry gepusht
- [ ] Cloud Run Service deployed und erreichbar
- [ ] Health-Check: `https://api.sovereign.de/health` → `{"status": "ok"}`
- [ ] CORS korrekt konfiguriert (nur erlaubte Origins)
- [ ] Rate Limiting aktiv

**Domains & DNS:**
- [ ] `sovereign.de` → Landing Page (Firebase Hosting)
- [ ] `app.sovereign.de` → Web App (Firebase Hosting)
- [ ] `api.sovereign.de` → Cloud Run (Backend)
- [ ] SSL-Zertifikate automatisch via Firebase/Cloud Run
- [ ] DNS-Propagation getestet

**Stripe:**
- [ ] Produkte & Preise erstellt
- [ ] Webhook konfiguriert und getestet
- [ ] Zahlungsmethoden: Karte + SEPA aktiv
- [ ] Kundenportal konfiguriert
- [ ] Test-Subscriptions durchgespielt (PRO + SHIELD)

**Monitoring:**
- [ ] Uptime Check aktiv
- [ ] Alert Policies konfiguriert (Error Rate, Latenz)
- [ ] Budget-Alert gesetzt (€100/Monat)
- [ ] Cloud Logging funktioniert

**CI/CD:**
- [ ] GitHub Secrets: `GCP_SA_KEY` gespeichert
- [ ] Backend-Pipeline: Push → Test → Build → Deploy
- [ ] Web-Pipeline: Push → Build → Firebase Hosting
- [ ] Landing-Pipeline: Push → Build → Firebase Hosting

**Security:**
- [ ] Firebase Auth Token-Verifizierung im Backend
- [ ] Keine API-Keys im Client-Code (nur `google-services.json`)
- [ ] Keine Secrets im Git-Repo (`.gitignore` prüfen)
- [ ] HTTPS überall erzwungen
- [ ] Security Headers gesetzt (X-Frame-Options, CSP, HSTS)
- [ ] Firestore Rules: Default-Deny verifiziert

---

# ENDE — SOVEREIGN_BACKEND.md v1.0.0

> **15 Kapitel** | Jeder CLI-Befehl ist copy-paste-ready
> Von der GCP-Projekt-Erstellung bis zum Go-Live
> Alle Secrets, alle Configs, alle Pipelines
>
> *"Infrastructure is the foundation of sovereignty."*
