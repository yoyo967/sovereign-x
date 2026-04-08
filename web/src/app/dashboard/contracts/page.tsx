'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, Variants } from 'framer-motion';
import { FileText, Plus, Search, Filter, Calendar, AlertTriangle, Upload, X, CheckCircle, Loader2, ChevronRight, Building2, Euro, Clock, AlertCircle } from 'lucide-react';
import { api } from '@/lib/api';
import { useRequireAuth } from '@/hooks/useRequireAuth';

// ── Upload Modal ──────────────────────────────────────────────

type UploadStep = "idle" | "analyzing" | "result" | "done";

interface DetectedContract {
  provider: string;
  category: string;
  monthlyCost: string;
  noticePeriod: string;
  nextRenewal: string;
  autoRenewal: boolean;
  confidence: number;
}

const MOCK_RESULT: DetectedContract = {
  provider: "Telekom Deutschland",
  category: "TELEKOMMUNIKATION",
  monthlyCost: "39,95",
  noticePeriod: "1 Monat zum Monatsende",
  nextRenewal: "31.08.2025",
  autoRenewal: true,
  confidence: 94,
};

function UploadModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<UploadStep>("idle");
  const [fileName, setFileName] = useState<string>("");
  const [dragOver, setDragOver] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    setFileName(file.name);
    setStep("analyzing");
    setAnalysisProgress(0);
    // Simulate analysis steps
    const steps = [15, 35, 55, 72, 88, 94, 100];
    steps.forEach((val, i) => {
      setTimeout(() => {
        setAnalysisProgress(val);
        if (val === 100) setTimeout(() => setStep("result"), 400);
      }, i * 380);
    });
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") handleFile(file);
  }, [handleFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const ANALYSIS_STEPS = [
    { label: "Dokument einlesen", threshold: 15 },
    { label: "Textextraktion (OCR)", threshold: 35 },
    { label: "Vertragstyp erkennen", threshold: 55 },
    { label: "Konditionen analysieren", threshold: 72 },
    { label: "Fristen berechnen", threshold: 88 },
    { label: "Sonderkündigungsrechte prüfen", threshold: 94 },
    { label: "Analyse abgeschlossen", threshold: 100 },
  ];

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(8,14,26,0.85)", backdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "1.5rem",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        style={{
          width: "100%", maxWidth: 560,
          background: "#0D1929",
          border: "1px solid rgba(0,212,255,0.15)",
          padding: "2rem",
          position: "relative",
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Schließen"
          style={{ position: "absolute", top: "1.25rem", right: "1.25rem", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.35)", padding: 4 }}
        >
          <X size={18} />
        </button>

        {/* Step: idle — drop zone */}
        {step === "idle" && (
          <>
            <p style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.58rem", letterSpacing: "0.12em", color: "rgba(0,212,255,0.5)", marginBottom: "0.5rem", textTransform: "uppercase" }}>
              Neuer Vertrag
            </p>
            <h2 style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontWeight: 800, fontSize: "1.4rem", color: "#F0F4FF", marginBottom: "1.5rem", letterSpacing: "-0.02em" }}>
              Vertrag hochladen
            </h2>

            {/* Drop zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
              style={{
                border: `2px dashed ${dragOver ? "rgba(0,212,255,0.5)" : "rgba(0,212,255,0.2)"}`,
                background: dragOver ? "rgba(0,212,255,0.04)" : "rgba(0,212,255,0.01)",
                borderRadius: 2,
                padding: "3rem 2rem",
                textAlign: "center",
                cursor: "pointer",
                transition: "all 0.15s",
                marginBottom: "1.5rem",
              }}
            >
              <Upload size={32} style={{ color: "rgba(0,212,255,0.4)", margin: "0 auto 1rem" }} />
              <p style={{ fontSize: "0.92rem", color: "rgba(255,255,255,0.6)", marginBottom: "0.4rem" }}>
                PDF-Vertrag hierher ziehen
              </p>
              <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.3)" }}>
                oder klicken zum Auswählen
              </p>
              <input ref={inputRef} type="file" accept=".pdf" style={{ display: "none" }} onChange={handleFileInput} />
            </div>

            {/* Supported types */}
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
              {["Mobilfunk", "Strom/Gas", "Versicherung", "Streaming", "Fitnessstudio", "Mietvertrag"].map((cat) => (
                <span key={cat} style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.58rem", letterSpacing: "0.06em", color: "rgba(255,255,255,0.3)", border: "1px solid rgba(255,255,255,0.07)", padding: "3px 8px" }}>
                  {cat}
                </span>
              ))}
            </div>

            <div style={{ padding: "0.75rem 1rem", background: "rgba(0,212,255,0.04)", border: "1px solid rgba(0,212,255,0.1)", fontSize: "0.8rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.55 }}>
              <strong style={{ color: "rgba(0,212,255,0.6)" }}>Datenschutz:</strong> Dein Dokument wird lokal analysiert und nicht dauerhaft gespeichert. Keine Weitergabe an Dritte.
            </div>
          </>
        )}

        {/* Step: analyzing */}
        {step === "analyzing" && (
          <>
            <p style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.58rem", letterSpacing: "0.12em", color: "rgba(0,212,255,0.5)", marginBottom: "0.5rem", textTransform: "uppercase" }}>
              Analyse läuft
            </p>
            <h2 style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontWeight: 800, fontSize: "1.4rem", color: "#F0F4FF", marginBottom: "0.5rem", letterSpacing: "-0.02em" }}>
              SOVEREIGN analysiert…
            </h2>
            <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.35)", marginBottom: "2rem" }}>{fileName}</p>

            {/* Progress bar */}
            <div style={{ height: 3, background: "rgba(255,255,255,0.06)", marginBottom: "2rem", position: "relative" }}>
              <motion.div
                animate={{ width: `${analysisProgress}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                style={{ height: "100%", background: "rgba(0,212,255,0.7)", position: "absolute", left: 0, top: 0 }}
              />
            </div>

            {/* Steps */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {ANALYSIS_STEPS.map((s) => {
                const done = analysisProgress >= s.threshold;
                const active = analysisProgress < s.threshold && analysisProgress >= (ANALYSIS_STEPS.find((x) => x.threshold > analysisProgress - 15)?.threshold ?? 0);
                return (
                  <div key={s.label} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    {done
                      ? <CheckCircle size={15} style={{ color: "rgba(0,212,255,0.7)", flexShrink: 0 }} />
                      : active
                      ? <Loader2 size={15} style={{ color: "rgba(255,255,255,0.5)", flexShrink: 0, animation: "spin 1s linear infinite" }} />
                      : <div style={{ width: 15, height: 15, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.1)", flexShrink: 0 }} />
                    }
                    <span style={{ fontSize: "0.83rem", color: done ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.25)" }}>
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Step: result */}
        {step === "result" && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
              <CheckCircle size={20} style={{ color: "#00E676", flexShrink: 0 }} />
              <div>
                <p style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.58rem", letterSpacing: "0.12em", color: "#00E676", textTransform: "uppercase", marginBottom: "0.2rem" }}>
                  Analyse abgeschlossen · {MOCK_RESULT.confidence}% Konfidenz
                </p>
                <h2 style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontWeight: 800, fontSize: "1.3rem", color: "#F0F4FF", letterSpacing: "-0.02em", margin: 0 }}>
                  Vertrag erkannt
                </h2>
              </div>
            </div>

            {/* Detected data */}
            <div style={{ border: "1px solid rgba(255,255,255,0.07)", marginBottom: "1.5rem" }}>
              {[
                { icon: <Building2 size={14} />, label: "Anbieter", value: MOCK_RESULT.provider },
                { icon: <FileText size={14} />, label: "Kategorie", value: MOCK_RESULT.category },
                { icon: <Euro size={14} />, label: "Monatliche Kosten", value: `€${MOCK_RESULT.monthlyCost}` },
                { icon: <Clock size={14} />, label: "Kündigungsfrist", value: MOCK_RESULT.noticePeriod },
                { icon: <Calendar size={14} />, label: "Nächste Verlängerung", value: MOCK_RESULT.nextRenewal },
              ].map(({ icon, label, value }, i, arr) => (
                <div key={label} style={{ display: "grid", gridTemplateColumns: "auto auto 1fr", gap: "0.75rem", padding: "0.75rem 1rem", borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none", alignItems: "center" }}>
                  <span style={{ color: "rgba(0,212,255,0.45)" }}>{icon}</span>
                  <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.35)", minWidth: 140 }}>{label}</span>
                  <span style={{ fontSize: "0.88rem", fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>{value}</span>
                </div>
              ))}
            </div>

            {/* Warning: auto-renewal */}
            {MOCK_RESULT.autoRenewal && (
              <div style={{ display: "flex", gap: "0.6rem", padding: "0.75rem 1rem", background: "rgba(255,160,0,0.06)", border: "1px solid rgba(255,160,0,0.2)", marginBottom: "1.5rem" }}>
                <AlertCircle size={15} style={{ color: "rgba(255,160,0,0.8)", flexShrink: 0, marginTop: 1 }} />
                <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.5, margin: 0 }}>
                  <strong style={{ color: "rgba(255,160,0,0.9)" }}>Automatische Verlängerung erkannt.</strong>{" "}
                  Soll SOVEREIGN eine Kündigung-Erinnerung zum {MOCK_RESULT.nextRenewal} setzen?
                </p>
              </div>
            )}

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button
                onClick={() => setStep("done")}
                className="primary-aura-button"
                style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
              >
                Vertrag speichern
                <ChevronRight size={15} />
              </button>
              <button
                onClick={onClose}
                className="secondary-button"
                style={{ padding: "0.65rem 1rem" }}
              >
                Verwerfen
              </button>
            </div>
          </>
        )}

        {/* Step: done */}
        {step === "done" && (
          <div style={{ textAlign: "center", padding: "2rem 1rem" }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(0,230,118,0.1)", border: "2px solid rgba(0,230,118,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}
            >
              <CheckCircle size={28} style={{ color: "#00E676" }} />
            </motion.div>
            <h2 style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontWeight: 800, fontSize: "1.4rem", color: "#F0F4FF", letterSpacing: "-0.02em", marginBottom: "0.5rem" }}>
              Vertrag gespeichert.
            </h2>
            <p style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.65, marginBottom: "2rem" }}>
              {MOCK_RESULT.provider} wurde deinem Vertrags-Tresor hinzugefügt.
              Kündigung-Erinnerung gesetzt für{" "}
              <strong style={{ color: "rgba(255,255,255,0.7)" }}>{MOCK_RESULT.nextRenewal}</strong>.
            </p>
            <button onClick={onClose} className="primary-aura-button">
              Fertig
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

interface Contract {
  id: string;
  category: string;
  status: string;
  provider: string;
  name: string;
  monthlyCostEur?: number;
  nextPaymentDate?: string;
}

export default function ContractsPage() {
  const { user, loading: authLoading } = useRequireAuth();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    async function loadContracts() {
      try {
        setLoading(true);
        const data = await api.contracts.list();
        setContracts(data?.contracts || []);
      } catch (err) {
        console.error(err);
        setError('Fehler beim Laden der Verträge.');
      } finally {
        setLoading(false);
      }
    }
    loadContracts();
  }, [user]);

  if (authLoading) return null; // handled by useRequireAuth

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.1 } 
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <div style={{ maxWidth: '1280px' }}>
      <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ 
            fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px',
            fontFamily: 'var(--font-space-grotesk, sans-serif)',
            letterSpacing: '-0.03em'
          }}>
            Vertrags-Tresor
          </h1>
          <p style={{ color: 'var(--sovereign-slate)', fontSize: '1.05rem', margin: 0 }}>
            Management und Optimierung deines globalen Vertragsportfolios.
          </p>
        </div>
        <button onClick={() => setUploadOpen(true)} className="primary-aura-button" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={16} />
          Neuer Vertrag
        </button>
      </header>

      {/* Control Bar */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--sovereign-slate)' }} />
          <input 
            type="text" 
            placeholder="Suchen nach Anbieter, Kategorie..." 
            className="sovereign-input"
            style={{ paddingLeft: '48px' }}
          />
        </div>
        <button className="secondary-button" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={16} />
          Filter
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
          {[1,2,3].map(i => <div key={i} className="skeleton skeleton-card" style={{ height: '200px' }} />)}
        </div>
      ) : error ? (
        <div className="glass-card-level-1" style={{ padding: '32px', textAlign: 'center', color: 'var(--sovereign-riskred)' }}>
          <AlertTriangle size={32} style={{ margin: '0 auto 16px' }} />
          <p>{error}</p>
        </div>
      ) : contracts.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="empty-state glass-card-level-1"
        >
          <div className="empty-state-icon">
            <FileText size={32} color="var(--sovereign-cyan)" />
          </div>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '8px', color: 'var(--sovereign-alabaster)' }}>Keine Verträge gefunden</h3>
          <p style={{ color: 'var(--sovereign-slate)', marginBottom: '32px', maxWidth: '400px' }}>
            Lade Vertragsdokumente (PDF) hoch oder verbinde dein Bankkonto, damit Sovereign Verträge automatisch erkennt.
          </p>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button className="primary-aura-button">Bank verbinden</button>
            <button className="secondary-button" onClick={() => setUploadOpen(true)}>Dokument hochladen</button>
          </div>
        </motion.div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}
        >
          {contracts.map(contract => (
            <motion.div key={contract.id} variants={itemVariants} className="stat-card" style={{ cursor: 'pointer' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <span className="category-chip">{contract.category || 'GENERAL'}</span>
                <span className={`deadline-chip ${contract.status === 'ACTIVE' ? 'deadline-chip-safe' : 'deadline-chip-warning'}`}>
                  {contract.status === 'ACTIVE' ? 'Aktiv' : contract.status}
                </span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ 
                  width: '40px', height: '40px', borderRadius: '12px', 
                  background: 'var(--sovereign-glass-15)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center' 
                }}>
                  <FileText size={20} color="var(--sovereign-cyan)" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 2px' }}>{contract.provider}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--sovereign-slate)', margin: 0 }}>{contract.name}</p>
                </div>
              </div>
              
              <div style={{ 
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', 
                borderTop: '1px solid var(--sovereign-silver)', paddingTop: '16px', marginTop: 'auto' 
              }}>
                <div>
                  <p style={{ fontSize: '0.7rem', color: 'var(--sovereign-slate)', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Kosten
                  </p>
                  <p style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: 'var(--sovereign-alabaster)', letterSpacing: '-0.02em' }}>
                    €{contract.monthlyCostEur?.toFixed(2) || '0.00'}<span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--sovereign-slate)' }}>/mo</span>
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '0.7rem', color: 'var(--sovereign-slate)', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Nächste Zahlung
                  </p>
                  <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--sovereign-alabaster)', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={14} color="var(--sovereign-slate)" />
                    {contract.nextPaymentDate ? new Date(contract.nextPaymentDate).toLocaleDateString('de-DE') : 'Unbekannt'}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {uploadOpen && <UploadModal onClose={() => setUploadOpen(false)} />}
    </div>
  );
}
