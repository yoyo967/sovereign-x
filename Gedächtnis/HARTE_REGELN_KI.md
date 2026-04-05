# HARTE REGELN FÜR DIE KI (ANTIGRAVITY)
*Zuletzt aktualisiert: 03. April 2026*

## Ursachenanalyse: Warum mache ich (die KI) diesen Fehler immer wieder?
Den Fehler, dir eine falsche oder inaktive Live-URL (wie Firebase `opus-magnum-ai.web.app`) zu geben oder unabgesprochen auf `localhost` zurückzufallen, liegt an einem wiederkehrenden **Muster der Annahme (Halluzination) statt Verifikation**:
1. **Blindes Lesen von Configs:** Ich lese in einer `config.py` oder `firebase.json` einen String (z.B. Allowed Origins oder Projekt ID) und **behaupte** daraufhin sofort, dass die Seite dort *jetzt live und funktionsfähig* ist.
2. **Ignorieren des Build-Status:** Ich vergesse, dass ein String in einer Config-Datei nicht bedeutet, dass der Befehl `npm run build` und `firebase deploy` in der aktuellen Code-Version fehlerfrei durchgelaufen ist (im Next.js Export-Fall fehlt oft der `out` Ordner, was zum Firebase 404 Fehler führt, den du gesehen hast).
3. **Mangelnde Kontext-Kontinuität:** Ich verliere den Kontext aus früheren Anweisungen (z.B. "Ich will keine lokalen URLs mehr sehen"), falle aus Bequemlichkeit auf das Terminal zurück, wo ich `npm run dev` sehe, und antworte impulsiv mit Localhost.

## Selbstheilung: Wie korrigiere ich dieses Verhalten systemisch?
Um diese Fehlerkette zu durchbrechen, muss ich meinen internen Algorithmus von **"Annehmen & Behaupten"** auf **"Prüfen & Beweisen"** umstellen.

---

## VERANKERUNG: HARTE REGELN (AB SOFORT GÜLTIG)

### REGEL 1: ABSOLUTES VERBOT VON URL-HALLUZINATIONEN
Ich darf **niemals** eine Live-URL (`.web.app` oder ähnliches) als "fertig" oder "hier ist die Seite" kommunizieren, ohne dass ich in der exakt selben Session einen erfolgreichen Deployment-Log (`firebase deploy`) **gesehen** habe oder manuell die Build-Ordner (`out`/`dist`) auf Inhalt geprüft habe. 

### REGEL 2: "NO LOCALHOST" SPERRE
Wenn der User signalisiert hat, dass er auf Produktionsebene (Cloud Run, Firebase Hosting) arbeitet, existiert `localhost` in meiner Kommunikation nicht mehr. Befehle wie `npm run dev` im Terminal ignoriere ich bei der Ausgabe von URLs strikt. 

### REGEL 3: BUILD BEVOR DEPLOY
Bevor ich im Kontext von Next.js behaupte, etwas sei deployt, **muss** ich prüfen, ob der `public` oder `out` Ordner in der `firebase.json` überhaupt existiert und befüllt ist. Ist der Ordner leer, melde ich: *"Das Deployment fehlt noch, wir müssen zuerst builden."*

### REGEL 4: CHECK & VERIFY VOR ANTWORT
Wenn der User "Gib mir die URL" fragt, lautet der interne Prozess ab sofort:
1. Prüfen, wo das Projekt gehostet ist.
2. Status des Deployments in den letzten Logs prüfen.
3. Erst dann die verifizierte URL formulieren. 
Gibt es keinen Beweis für ein aktuelles Deployment, informiere ich den User, dass wir deployen müssen, statt eine Phantom-URL rauszugeben.
