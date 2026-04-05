# Sovereign Session Gedächtnis v1.4
2026-04-04

## 🔱 Aktueller Projektstatus

Das Projekt "SOVEREIGN 2030" ist vollständig deployed, Firebase Auth aktiv, Onboarding implementiert, KI real.

---

### 1. Backend — LIVE
- **URL:** https://sovereign-api-923137317598.us-central1.run.app
- 9 Router-Gruppen, 35+ Endpoints, FastAPI 2.0.0
- Vertex AI / Gemini 2.5 Flash: **REAL AKTIV** (bestätigt)
- Stripe: Mock-Modus (Schlüssel noch nicht hinterlegt)
- FinAPI: Sandbox-Modus
- Firestore Security Rules: **DEPLOYED** (04.04.2026)
- Secret Manager API: aktiviert

### 2. Frontend — LIVE
- **Firebase Hosting:** https://opus-magnum-ai.web.app
- **Cloud Run:** https://sovereign-web-923137317598.us-central1.run.app
- Next.js 16.2.2, 10 Sprachen, RTL Arabisch, Kyrillisch
- **Firebase Auth:** AKTIV (alle Env Vars eingebaut, v00003-792)
- **Onboarding-Flow:** IMPLEMENTIERT (4 Schritte: Welcome → Profil → Tour → Done)
- **API Response Fixes:** contracts/claims/approvals (data.contracts etc.) GEFIXT

### 3. CI/CD Pipeline — BEREIT (nicht aktiv)
- `d:/Souvereign X/.github/workflows/deploy.yml` erstellt
- Aktivierung: GitHub Remote setzen + Secrets hinterlegen
- **Secrets needed:** GCP_SA_KEY, FIREBASE_TOKEN, alle NEXT_PUBLIC_* Vars
- **Voraussetzung:** `git remote add origin https://github.com/USER/REPO`

### 4. Bug-Status
| Bug | Status |
|---|---|
| Firebase Auth in Production tot | ✅ GEFIXT (v00003-792) |
| API Response Mismatch contracts/claims/approvals | ✅ GEFIXT |
| Firestore Rules nicht deployed | ✅ GEFIXT |
| Onboarding fehlend | ✅ IMPLEMENTIERT |
| Vertex AI Modus unklar | ✅ BESTÄTIGT REAL |
| Stripe Price IDs hardcoded | ✅ GEFIXT (Config-driven) |
| checkout URLs falsch | ✅ GEFIXT (opus-magnum-ai.web.app) |

### 5. Offene TODOs (priorisiert)
- [ ] **Stripe aktivieren**: STRIPE_SECRET_KEY + Price IDs in Cloud Run setzen
- [ ] **CI/CD aktivieren**: GitHub Remote + Secrets
- [ ] **Domain**: sovereign.de → Firebase Hosting Custom Domain
- [ ] **Tests schreiben**: pytest Backend + Playwright Frontend
- [ ] **PSD2 Real**: FinAPI Production Account
- [ ] **Mobile App** (Android/Kotlin): Phase 5
- [ ] **Buch-Projekt** "SOVEREIGN MARKETING": Kap 09–16, Kap 18, Anhänge A–E

### 6. Stripe Aktivierungs-Checklist
```
1. Stripe Dashboard → Products → 4 Preise erstellen:
   PRO_MONTHLY   €6.99/mo  → Price ID: price_xxx
   PRO_YEARLY    €69/yr    → Price ID: price_xxx
   SHIELD_MONTHLY €14.99/mo → Price ID: price_xxx
   SHIELD_YEARLY  €139/yr  → Price ID: price_xxx

2. Cloud Run env vars setzen:
   gcloud run services update sovereign-api \
     --update-env-vars STRIPE_SECRET_KEY=sk_live_xxx \
     --update-env-vars STRIPE_WEBHOOK_SECRET=whsec_xxx \
     --update-env-vars STRIPE_PRICE_PRO_MONTHLY=price_xxx \
     ...

3. Stripe Webhook registrieren:
   URL: https://sovereign-api-923137317598.us-central1.run.app/v2/billing/webhook
   Events: checkout.session.completed, customer.subscription.deleted
```

### 7. CI/CD Aktivierungs-Checklist
```
1. GitHub Repo erstellen + Remote setzen:
   cd "d:/Souvereign X"
   git init && git remote add origin https://github.com/USER/sovereign-2030

2. GitHub Secrets setzen:
   GCP_SA_KEY               → Service Account JSON (roles/editor)
   FIREBASE_TOKEN           → firebase login:ci
   NEXT_PUBLIC_API_URL      → https://sovereign-api-923137317598.us-central1.run.app
   NEXT_PUBLIC_FIREBASE_*   → (alle 6 Firebase Config Werte)

3. Push → Auto-Deploy läuft
```

---

## 🔑 Live-URLs
```
Backend API:      https://sovereign-api-923137317598.us-central1.run.app
Frontend (CDN):   https://opus-magnum-ai.web.app
Frontend (Run):   https://sovereign-web-923137317598.us-central1.run.app
Firebase Console: https://console.firebase.google.com/project/opus-magnum-ai/overview
Stripe Webhook:   https://sovereign-api-923137317598.us-central1.run.app/v2/billing/webhook
API Docs:         https://sovereign-api-923137317598.us-central1.run.app/docs
```

---
*Gedächtnis aktualisiert: 2026-04-04 — Woche 1+2 vollständig abgeschlossen*
