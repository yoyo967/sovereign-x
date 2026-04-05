'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Plus, Clock, CheckCircle, AlertCircle, Scale, Building, Navigation, Euro } from 'lucide-react';
import { api } from '@/lib/api';
import { useRequireAuth } from '@/hooks/useRequireAuth';

export default function ClaimsCenter() {
  const { user, loading: authLoading } = useRequireAuth();
  const [claims, setClaims] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    async function loadClaims() {
      try {
        setLoading(true);
        const data = await api.claims.list();
        setClaims(data?.claims || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadClaims();
  }, [user]);

  if (authLoading) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div style={{ maxWidth: '1280px' }}>
      <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ 
            fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px',
            fontFamily: 'var(--font-space-grotesk, sans-serif)', letterSpacing: '-0.03em'
          }}>
            Claims Center
          </h1>
          <p style={{ color: 'var(--sovereign-slate)', fontSize: '1.05rem', margin: 0 }}>
            Durchsetzung deiner Rechte und automatische Forderungseintreibung.
          </p>
        </div>
        <button className="primary-aura-button" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={16} />
          Neuer Claim
        </button>
      </header>

      {/* Overview Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '32px' }}>
        <div className="glass-card-level-1" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(0, 229, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Scale size={24} color="var(--sovereign-cyan)" />
          </div>
          <div>
            <p style={{ margin: '0 0 4px', fontSize: '0.85rem', color: 'var(--sovereign-slate)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Aktive Claims</p>
            <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 800, color: 'var(--sovereign-alabaster)' }}>
              {claims.filter(c => c.status !== 'RESOLVED' && c.status !== 'CLOSED').length}
            </p>
          </div>
        </div>
        <div className="glass-card-level-1" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(187, 134, 252, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Euro size={24} color="var(--sovereign-purple)" />
          </div>
          <div>
            <p style={{ margin: '0 0 4px', fontSize: '0.85rem', color: 'var(--sovereign-slate)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Offene Forderungen</p>
            <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 800, color: 'var(--sovereign-alabaster)' }}>
              €{claims.filter(c => c.status !== 'RESOLVED').reduce((acc, c) => acc + (c.potentialCompensationEur || 0), 0).toFixed(2)}
            </p>
          </div>
        </div>
        <div className="glass-card-level-1" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(0, 230, 118, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle size={24} color="var(--sovereign-success)" />
          </div>
          <div>
            <p style={{ margin: '0 0 4px', fontSize: '0.85rem', color: 'var(--sovereign-slate)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Erfolgreich gelöst</p>
            <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 800, color: 'var(--sovereign-alabaster)' }}>
              {claims.filter(c => c.status === 'RESOLVED').length}
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[1,2,3].map(i => <div key={i} className="skeleton skeleton-card" style={{ height: '180px' }} />)}
        </div>
      ) : claims.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="glass-card-level-1" style={{ padding: '64px', textAlign: 'center' }}
        >
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--sovereign-glass-10)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto' }}>
            <ShieldCheck size={32} color="var(--sovereign-cyan)" />
          </div>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '8px', color: 'var(--sovereign-alabaster)' }}>Keine Claims aktiv</h3>
          <p style={{ color: 'var(--sovereign-slate)', maxWidth: '400px', margin: '0 auto' }}>
            Deine Rechte sind gewahrt. Sovereign überwacht Flüge, Verspätungen und Vertragsbrüche automatisch im Hintergrund.
          </p>
        </motion.div>
      ) : (
        <motion.div 
          variants={containerVariants} initial="hidden" animate="visible"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))', gap: '24px' }}
        >
          {claims.map(claim => (
            <motion.div key={claim.id} variants={itemVariants} className="stat-card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span className="badge-free" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>CLAIM: {claim.id.slice(0,8)}</span>
                <span className={`status-pill ${claim.status === 'RESOLVED' ? 'status-resolved' : 'status-active'}`}>
                  {claim.status === 'RESOLVED' ? <CheckCircle size={12} /> : <Clock size={12} />}
                  {claim.status}
                </span>
              </div>
              
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '6px' }}>{claim.title}</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--sovereign-slate)', marginBottom: '24px', lineHeight: 1.5 }}>
                {claim.description || 'Automatisiert verfolgter Rechtsanspruch.'}
              </p>
              
              <div style={{ 
                marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
                background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid var(--sovereign-glass-border)'
              }}>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--sovereign-slate)', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Erwartete Entschädigung
                  </p>
                  <p style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0, color: 'var(--sovereign-success)' }}>
                    €{claim.potentialCompensationEur?.toFixed(2) || '0.00'}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--sovereign-slate)', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Nächster Schritt
                  </p>
                  <p style={{ fontSize: '0.9rem', fontWeight: 600, margin: 0, color: 'var(--sovereign-alabaster)' }}>
                    {claim.nextStep || 'Warten auf Gegenseite'}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
