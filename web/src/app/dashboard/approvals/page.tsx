'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Zap, Info, ShieldAlert, ArrowRight } from 'lucide-react';
import { api } from '@/lib/api';
import { useRequireAuth } from '@/hooks/useRequireAuth';

export default function ApprovalsPage() {
  const { user, loading: authLoading } = useRequireAuth();
  const [approvals, setApprovals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    async function loadApprovals() {
      try {
        setLoading(true);
        const data = await api.approvals.list('PENDING');
        setApprovals(data?.approvals || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadApprovals();
  }, [user]);

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    try {
      if (action === 'approve') {
        await api.approvals.approve(id);
      } else {
        await api.approvals.reject(id);
      }
      // Remove from UI with animation
      setApprovals(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (authLoading) return null;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <header style={{ marginBottom: '40px', textAlign: 'center' }}>
        <div style={{ 
          width: '56px', height: '56px', borderRadius: '16px',
          background: 'linear-gradient(135deg, rgba(0, 229, 255, 0.1), rgba(187, 134, 252, 0.1))',
          border: '1px solid rgba(0, 229, 255, 0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px', boxShadow: '0 0 30px rgba(0, 229, 255, 0.15)'
        }}>
          <Zap size={28} color="var(--sovereign-cyan)" />
        </div>
        <h1 style={{ 
          fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px',
          fontFamily: 'var(--font-space-grotesk, sans-serif)', letterSpacing: '-0.03em'
        }}>
          Algorithmic Senate
        </h1>
        <p style={{ color: 'var(--sovereign-slate)', fontSize: '1.05rem', margin: 0 }}>
          Prüfung und Autorisierung autonomer Agenten-Vorschläge.
        </p>
      </header>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {[1,2].map(i => <div key={i} className="skeleton skeleton-card" style={{ height: '260px' }} />)}
        </div>
      ) : approvals.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card-level-1" 
          style={{ padding: '64px 32px', textAlign: 'center' }}
        >
          <div style={{ 
            width: '64px', height: '64px', borderRadius: '50%', 
            background: 'var(--sovereign-glass-10)', border: '1px solid var(--sovereign-glass-border)',
            margin: '0 auto 24px auto', display: 'flex', alignItems: 'center', justifyContent: 'center' 
          }}>
            <ShieldAlert size={32} color="var(--sovereign-slate)" />
          </div>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '12px', color: 'var(--sovereign-alabaster)' }}>
            Keine offenen Vorschläge
          </h3>
          <p style={{ color: 'var(--sovereign-slate)', fontSize: '0.95rem', maxWidth: '400px', margin: '0 auto' }}>
            Deine autonomen Systeme arbeiten derzeit innerhalb der festgelegten Boundary Conditions. Keine manuellen Freigaben erforderlich.
          </p>
        </motion.div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <AnimatePresence>
            {approvals.map((approval, index) => (
              <motion.div 
                key={approval.id} 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                transition={{ delay: index * 0.1 }}
                className="glass-card-level-1" 
                style={{ 
                  padding: '32px', overflow: 'hidden', position: 'relative',
                  borderTop: '2px solid',
                  borderTopColor: approval.riskLevel === 'HIGH' ? 'var(--sovereign-riskred)' 
                                : approval.riskLevel === 'MEDIUM' ? 'var(--sovereign-gold)' 
                                : 'var(--sovereign-cyan)'
                }}
              >
                {/* Background glow based on risk */}
                <div 
                  className={`floating-aura${approval.riskLevel === 'HIGH' ? '' : '-purple'}`}
                  style={{ 
                    position: 'absolute', top: '-100px', right: '-100px', 
                    width: '300px', height: '300px', opacity: 0.05, zIndex: 0 
                  }} 
                />

                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span className="category-chip" style={{ color: 'var(--sovereign-cyan)', borderColor: 'rgba(0, 229, 255, 0.3)' }}>
                        <Zap size={12} /> {approval.agentName || 'Senate'}
                      </span>
                      <span className={`risk-badge-${(approval.riskLevel || 'low').toLowerCase()}`}>
                        Risiko: {approval.riskLevel || 'LOW'}
                      </span>
                    </div>
                    {approval.expiresAt && (
                      <span className="deadline-chip deadline-chip-warning">
                        Läuft bald ab
                      </span>
                    )}
                  </div>
                  
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '12px', letterSpacing: '-0.02em' }}>
                    {approval.title}
                  </h3>
                  <p style={{ color: 'var(--sovereign-alabaster)', lineHeight: 1.6, marginBottom: '24px', fontSize: '0.95rem' }}>
                    {approval.description}
                  </p>
                  
                  <div style={{ 
                    background: 'var(--sovereign-glass-10)', borderRadius: '12px', 
                    padding: '16px 20px', marginBottom: '32px', display: 'flex', alignItems: 'flex-start', gap: '14px',
                    border: '1px solid var(--sovereign-glass-border)'
                  }}>
                    <Info size={20} color="var(--sovereign-cyan)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <p style={{ margin: '0 0 6px', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--sovereign-slate)', fontWeight: 700 }}>
                        Algorithmische Begründung
                      </p>
                      <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--sovereign-alabaster)', lineHeight: 1.5 }}>
                        {approval.reason || 'Optimales finanzielles Ergebnis auf Basis der aktuellen Boundary Conditions und Marktdaten identifiziert.'}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <button 
                      onClick={() => handleAction(approval.id, 'approve')}
                      className="primary-aura-button" 
                      style={{ flex: 1, padding: '14px 24px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                    >
                      <CheckCircle size={18} />
                      Aktion Autorisieren (Biometrisch)
                    </button>
                    <button 
                      onClick={() => handleAction(approval.id, 'reject')}
                      className="secondary-button"
                      style={{ padding: '14px 32px', border: '1px solid rgba(255, 23, 68, 0.3)', color: 'var(--sovereign-riskred)', display: 'flex', alignItems: 'center', gap: '10px' }}
                    >
                      <XCircle size={18} />
                      Ablehnen
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
