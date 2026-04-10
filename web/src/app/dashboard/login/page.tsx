"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Fingerprint, Shield, MapPin, CheckCircle2, X } from "lucide-react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

// ─── Passkey Setup Modal (shown once after registration) ──────────────────────

function PasskeySetupModal({ onDone }: { onDone: () => void }) {
  const [state, setState] = useState<"idle" | "registering" | "done" | "skipped">("idle");

  const handleRegister = async () => {
    if (!window.PublicKeyCredential) { setState("skipped"); return; }
    try {
      const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      if (!available) { setState("skipped"); return; }
      setState("registering");
      await navigator.credentials.create({
        publicKey: {
          challenge: crypto.getRandomValues(new Uint8Array(32)),
          rp: { name: "Sovereign 2030", id: window.location.hostname },
          user: {
            id: crypto.getRandomValues(new Uint8Array(16)),
            name: "sovereign-user",
            displayName: "Sovereign User",
          },
          pubKeyCredParams: [{ type: "public-key", alg: -7 }],
          authenticatorSelection: { userVerification: "required", authenticatorAttachment: "platform" },
          timeout: 60000,
        },
      });
      setState("done");
    } catch {
      setState("skipped");
    }
  };

  useEffect(() => {
    if (state === "done" || state === "skipped") {
      const t = setTimeout(onDone, 1400);
      return () => clearTimeout(t);
    }
  }, [state, onDone]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}
    >
      <motion.div
        initial={{ scale: 0.95, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95 }}
        style={{ width: "100%", maxWidth: 400, background: "#0D1929", border: "1px solid rgba(0,212,255,0.15)", padding: "2rem", textAlign: "center" }}
      >
        {state === "done" ? (
          <>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(0,200,140,0.1)", border: "1px solid rgba(0,200,140,0.25)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem" }}>
              <CheckCircle2 size={28} color="var(--sovereign-success, #00C88C)" />
            </div>
            <p style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.7rem", letterSpacing: "0.1em", color: "rgba(0,200,140,0.9)", textTransform: "uppercase" }}>
              Passkey registriert
            </p>
          </>
        ) : state === "skipped" ? (
          <>
            <p style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.7rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em" }}>Passkey übersprungen</p>
          </>
        ) : (
          <>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(0,212,255,0.06)", border: "1px solid rgba(0,212,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
              <Fingerprint size={32} color="#00D4FF" />
            </div>
            <h3 style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontSize: "1.25rem", fontWeight: 800, marginBottom: "0.75rem", letterSpacing: "-0.02em", color: "#F0F4FF" }}>
              Passkey einrichten
            </h3>
            <p style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.62rem", color: "rgba(255,255,255,0.35)", lineHeight: 1.7, marginBottom: "1.75rem", letterSpacing: "0.04em" }}>
              Schütze Hochrisiko-Aktionen mit FaceID oder Fingerabdruck.<br />
              Dein Passkey wird nur lokal auf deinem Gerät gespeichert.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <button
                onClick={handleRegister}
                disabled={state === "registering"}
                style={{
                  padding: "0.8rem", background: "#00D4FF", border: "none",
                  color: "#080E1A", fontFamily: "var(--font-mono, monospace)",
                  fontSize: "0.7rem", letterSpacing: "0.12em", fontWeight: 700,
                  textTransform: "uppercase", cursor: state === "registering" ? "wait" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                }}
              >
                <Fingerprint size={14} />
                {state === "registering" ? "Aktiviere Biometrie…" : "Passkey aktivieren"}
              </button>
              <button
                onClick={() => { setState("skipped"); }}
                style={{ padding: "0.7rem", background: "transparent", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-mono, monospace)", fontSize: "0.6rem", letterSpacing: "0.1em", cursor: "pointer", textTransform: "uppercase" }}
              >
                Später einrichten
              </button>
            </div>
            <p style={{ marginTop: "1rem", fontFamily: "var(--font-mono, monospace)", fontSize: "0.55rem", color: "rgba(255,255,255,0.15)", lineHeight: 1.6 }}>
              WebAuthn (FIDO2) · Kein Server-Upload · EU-konform
            </p>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

// ─── Main Login Page ──────────────────────────────────────────────────────────

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [showPasskeyModal, setShowPasskeyModal] = useState(false);

  useEffect(() => {
    if (!auth) { setCheckingAuth(false); return; }
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) router.replace("/dashboard");
      else setCheckingAuth(false);
    });
    return () => unsub();
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!auth) return;
    setLoading(true);
    setError("");
    try {
      if (mode === "login") {
        await signInWithEmailAndPassword(auth, email, password);
        router.replace("/dashboard");
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        // Offer passkey setup before redirecting
        setShowPasskeyModal(true);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Fehler aufgetreten";
      if (msg.includes("user-not-found") || msg.includes("wrong-password") || msg.includes("invalid-credential")) {
        setError("E-Mail oder Passwort falsch.");
      } else if (msg.includes("email-already-in-use")) {
        setError("Diese E-Mail ist bereits registriert.");
      } else if (msg.includes("weak-password")) {
        setError("Passwort muss mindestens 6 Zeichen haben.");
      } else {
        setError("Anmeldung fehlgeschlagen. Bitte versuche es erneut.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    if (!auth) return;
    setLoading(true);
    setError("");
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.replace("/dashboard");
    } catch {
      setError("Google-Anmeldung fehlgeschlagen.");
      setLoading(false);
    }
  }

  if (checkingAuth) {
    return (
      <div style={{ height: "100vh", background: "#080E1A", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 40, height: 40, borderRadius: "50%", border: "2px solid rgba(0,212,255,0.3)", borderTopColor: "#00D4FF", animation: "spin 1s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <>
      <AnimatePresence>
        {showPasskeyModal && (
          <PasskeySetupModal onDone={() => { setShowPasskeyModal(false); router.replace("/dashboard"); }} />
        )}
      </AnimatePresence>

      <div style={{
        minHeight: "100vh", background: "#080E1A",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'Inter', sans-serif", padding: "2rem",
      }}>
        {/* Grid */}
        <div style={{
          position: "fixed", inset: 0, pointerEvents: "none",
          backgroundImage: "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 420 }}
        >
          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <Link href="/de" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 32, height: 32, border: "1.5px solid rgba(0,212,255,0.4)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 10, height: 10, border: "1px solid rgba(0,212,255,0.35)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: 3, height: 3, background: "#00D4FF", borderRadius: "50%" }} />
                </div>
              </div>
              <span style={{ fontWeight: 800, fontSize: "0.95rem", letterSpacing: "0.08em", color: "rgba(255,255,255,0.9)" }}>
                SOVEREIGN <span style={{ color: "rgba(0,212,255,0.7)", fontSize: "0.7rem" }}>2030</span>
              </span>
            </Link>
          </div>

          {/* Card */}
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", padding: "2.5rem" }}>
            {/* Tab switcher */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", border: "1px solid rgba(255,255,255,0.06)", marginBottom: "2rem" }}>
              {(["login", "register"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => { setMode(m); setError(""); }}
                  style={{
                    padding: "0.6rem", background: mode === m ? "rgba(0,212,255,0.08)" : "transparent",
                    border: "none", borderBottom: mode === m ? "2px solid #00D4FF" : "2px solid transparent",
                    color: mode === m ? "#00D4FF" : "rgba(255,255,255,0.35)",
                    fontFamily: "var(--font-mono, monospace)", fontSize: "0.6rem",
                    letterSpacing: "0.12em", textTransform: "uppercase",
                    cursor: "pointer", transition: "all 0.2s",
                  }}
                >
                  {m === "login" ? "Anmelden" : "Registrieren"}
                </button>
              ))}
            </div>

            {/* Google Auth */}
            <button
              onClick={handleGoogle}
              disabled={loading}
              style={{
                width: "100%", padding: "0.75rem",
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.75)", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem",
                marginBottom: "1.5rem", transition: "border-color 0.2s", opacity: loading ? 0.5 : 1,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
                <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
                <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"/>
                <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/>
              </svg>
              <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.7rem", letterSpacing: "0.08em" }}>
                Mit Google {mode === "login" ? "anmelden" : "registrieren"}
              </span>
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
              <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.55rem", color: "rgba(255,255,255,0.2)", letterSpacing: "0.1em" }}>ODER</span>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontFamily: "var(--font-mono, monospace)", fontSize: "0.55rem", letterSpacing: "0.1em", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", marginBottom: "0.5rem" }}>
                  E-Mail
                </label>
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  required autoComplete="email"
                  style={{
                    width: "100%", padding: "0.75rem",
                    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
                    color: "#F0F4FF", outline: "none",
                    fontFamily: "'Inter', sans-serif", fontSize: "0.9rem",
                    transition: "border-color 0.2s", boxSizing: "border-box",
                  }}
                  onFocus={(e) => { e.target.style.borderColor = "rgba(0,212,255,0.4)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontFamily: "var(--font-mono, monospace)", fontSize: "0.55rem", letterSpacing: "0.1em", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", marginBottom: "0.5rem" }}>
                  Passwort
                </label>
                <input
                  type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  required autoComplete={mode === "login" ? "current-password" : "new-password"}
                  style={{
                    width: "100%", padding: "0.75rem",
                    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
                    color: "#F0F4FF", outline: "none",
                    fontFamily: "'Inter', sans-serif", fontSize: "0.9rem",
                    transition: "border-color 0.2s", boxSizing: "border-box",
                  }}
                  onFocus={(e) => { e.target.style.borderColor = "rgba(0,212,255,0.4)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; }}
                />
              </div>

              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    style={{
                      padding: "0.75rem", display: "flex", alignItems: "flex-start", gap: "8px",
                      background: "rgba(255,23,68,0.08)", border: "1px solid rgba(255,23,68,0.25)",
                    }}
                  >
                    <X size={13} color="rgba(255,80,80,0.7)" style={{ marginTop: 2, flexShrink: 0 }} />
                    <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.68rem", color: "rgba(255,80,80,0.9)", lineHeight: 1.5 }}>
                      {error}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit" disabled={loading}
                style={{
                  padding: "0.85rem",
                  background: loading ? "rgba(0,212,255,0.3)" : "#00D4FF",
                  border: "none", color: "#080E1A",
                  fontFamily: "var(--font-mono, monospace)", fontSize: "0.7rem",
                  letterSpacing: "0.12em", fontWeight: 700, textTransform: "uppercase",
                  cursor: loading ? "wait" : "pointer", transition: "background 0.2s",
                }}
              >
                {loading ? "…" : mode === "login" ? "Anmelden →" : "Account erstellen →"}
              </button>
            </form>

            {/* Trust badges — registration only */}
            <AnimatePresence>
              {mode === "register" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ overflow: "hidden" }}
                >
                  <div style={{ display: "flex", gap: "1rem", marginTop: "1.25rem", justifyContent: "center", flexWrap: "wrap" }}>
                    {[
                      { Icon: Shield, text: "EU AI Act-konform" },
                      { Icon: MapPin, text: "Daten in der EU" },
                      { Icon: Fingerprint, text: "Passkey-fähig" },
                    ].map(({ Icon, text }) => (
                      <div key={text} style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "0.6rem", color: "rgba(0,212,255,0.5)", fontFamily: "var(--font-mono, monospace)", letterSpacing: "0.06em" }}>
                        <Icon size={11} color="rgba(0,212,255,0.4)" /> {text}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Back link */}
          <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
            <Link
              href="/de"
              style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.58rem", letterSpacing: "0.1em", color: "rgba(255,255,255,0.2)", textDecoration: "none", textTransform: "uppercase", transition: "color 0.2s" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.5)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.2)"; }}
            >
              ← Zurück zur Sovereign Platform
            </Link>
          </div>

          {/* EU disclaimer */}
          <div style={{
            marginTop: "2rem", padding: "0.75rem 1rem",
            border: "1px solid rgba(0,212,255,0.08)", background: "rgba(0,212,255,0.02)",
            display: "flex", gap: "0.75rem", alignItems: "flex-start",
          }}>
            <span style={{ color: "rgba(0,212,255,0.4)", fontSize: "0.7rem", flexShrink: 0, marginTop: 1 }}>ⓘ</span>
            <p style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.58rem", color: "rgba(255,255,255,0.2)", lineHeight: 1.6, margin: 0 }}>
              EU AI Act Art.13 · Deine Daten werden ausschließlich in EU-Regionen verarbeitet (europe-west4). Keine Weitergabe an Dritte.
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
}
