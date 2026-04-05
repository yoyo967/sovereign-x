'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Users, UserPlus, Shield, Lock, Share2, Star } from 'lucide-react';
import { useRequireAuth } from '@/hooks/useRequireAuth';

export default function FamilyVault() {
  const { user, loading } = useRequireAuth();

  if (loading) return null;

  return (
    <div style={{ maxWidth: '1280px' }}>
      <header style={{ marginBottom: '56px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ 
            fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px',
            fontFamily: 'var(--font-space-grotesk, sans-serif)', letterSpacing: '-0.03em'
          }}>
            Family Vault
          </h1>
          <p style={{ color: 'var(--sovereign-slate)', fontSize: '1.05rem', margin: 0 }}>
            Sicheres Teilen von Verträgen und kollektiver finanzieller Schutz.
          </p>
        </div>
        <button className="primary-aura-button" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <UserPlus size={16} />
          Mitglied einladen
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '32px' }}>
        <motion.section 
          initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
          className="glass-card-level-1" style={{ padding: '36px' }}
        >
          <div className="section-header" style={{ marginBottom: '24px' }}>Vault-Mitglieder</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Owner */}
            <div style={{ 
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
              padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px',
              border: '1px solid rgba(0, 229, 255, 0.2)'
            }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ 
                  width: '48px', height: '48px', borderRadius: '14px', 
                  background: 'linear-gradient(135deg, var(--sovereign-cyan), #00b8d4)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  fontWeight: 800, color: 'var(--sovereign-navy)', fontSize: '1.2rem',
                  boxShadow: '0 0 20px rgba(0, 229, 255, 0.3)'
                }}>
                  {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <p style={{ margin: '0 0 2px', fontWeight: 700, fontSize: '1.1rem', color: 'var(--sovereign-alabaster)' }}>
                    {user?.displayName || 'Du'} (Owner)
                  </p>
                  <span style={{ fontSize: '0.85rem', color: 'var(--sovereign-slate)' }}>Executive Administrator</span>
                </div>
              </div>
              <span className="badge-shield" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Star size={10} /> Admin
              </span>
            </div>
            
            {/* Placeholder for no other members */}
            <div style={{ 
              textAlign: 'center', padding: '60px 24px', 
              border: '1px dashed var(--sovereign-silver)', borderRadius: '16px',
              background: 'rgba(255,255,255,0.01)'
            }}>
              <Users size={32} color="var(--sovereign-silver)" style={{ margin: '0 auto 16px auto', opacity: 0.5 }} />
              <p style={{ color: 'var(--sovereign-alabaster)', fontSize: '1.1rem', fontWeight: 600, margin: '0 0 8px' }}>
                Noch keine weiteren Mitglieder
              </p>
              <p style={{ color: 'var(--sovereign-slate)', fontSize: '0.9rem', maxWidth: '300px', margin: '0 auto' }}>
                Lade Familie oder Geschäftspartner ein, um Verträge und finanzielle Insights sicher zu teilen.
              </p>
            </div>
          </div>
        </motion.section>

        <motion.section 
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
          className="glass-card-level-1" style={{ padding: '36px', position: 'relative', overflow: 'hidden' }}
        >
          {/* Shield Aura */}
          <div className="floating-aura" style={{ position: 'absolute', top: '-10%', left: '-10%', width: '250px', height: '250px', opacity: 0.05 }} />

          <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <div style={{ 
              width: '80px', height: '80px', borderRadius: '50%',
              background: 'rgba(0, 229, 255, 0.05)', border: '1px solid rgba(0, 229, 255, 0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto'
            }}>
              <Shield size={40} color="var(--sovereign-cyan)" />
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '16px', letterSpacing: '-0.02em' }}>
              Shield Protection
            </h3>
            <p style={{ color: 'var(--sovereign-slate)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '32px' }}>
              Alle Mitglieder deines Vaults stehen unter deinem Sovereign Shield. 
              Claims, KI-Verhandlungen und Optimierungen gelten für alle geteilten Verträge.
            </p>
            <div style={{ 
              padding: '24px', background: 'rgba(16, 230, 230, 0.04)', 
              borderRadius: '16px', border: '1px solid rgba(16, 230, 230, 0.1)',
              textAlign: 'left' 
            }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '12px' }}>
                <Share2 size={20} color="var(--sovereign-cyan)" />
                <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--sovereign-alabaster)' }}>Geteilte Assets: 0</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--sovereign-slate)', lineHeight: 1.5 }}>
                Markiere einen beliebigen Vertrag ins deinem Tresor als "Shared", um die familienweite KI-Optimierung und Rechtsüberwachung zu aktivieren.
              </p>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
