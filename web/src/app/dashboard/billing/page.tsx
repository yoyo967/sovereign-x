'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Shield, Zap, Check, Lock, Star } from 'lucide-react';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { api } from '@/lib/api';

export default function BillingPage() {
  const { user, loading: authLoading } = useRequireAuth();
  const [currentTier, setCurrentTier] = useState<string>('FREE');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    async function fetchTier() {
      try {
        const dashboard = await api.user.getDashboard();
        setCurrentTier(dashboard.tier || 'FREE');
      } catch (err) {
        console.error('Failed to load billing info:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchTier();
  }, [user]);

  if (authLoading) return null;

  const plans = [
    { 
      name: 'FREE', price: '€0', 
      features: ['Max. 3 Verträge', 'Basis-Scan', 'Manuelle Freigaben', 'Standard-Support'],
      color: 'var(--sovereign-slate)', badgeClass: 'badge-free'
    },
    { 
      name: 'PRO', price: '€6.99', 
      features: ['Unlimitierte Verträge', 'Deep Clause Engine', 'Agenten-Autopilot', 'Priority Support'],
      color: '#00b8d4', badgeClass: 'badge-pro', aura: 'floating-aura'
    },
    { 
      name: 'SHIELD', price: '€14.99', 
      features: ['Alles von PRO', 'Bank-Anbindung (PSD2)', 'Finance Guardian', 'Legal Claims Network'],
      color: 'var(--sovereign-purple)', badgeClass: 'badge-shield', aura: 'floating-aura-purple'
    },
  ];

  return (
    <div style={{ maxWidth: '1280px' }}>
      <header style={{ marginBottom: '56px', textAlign: 'center' }}>
        <div style={{ 
          width: '56px', height: '56px', borderRadius: '16px',
          background: 'rgba(0, 229, 255, 0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px', boxShadow: '0 0 30px rgba(0, 229, 255, 0.15)'
        }}>
          <CreditCard size={28} color="var(--sovereign-cyan)" />
        </div>
        <h1 style={{ 
          fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px',
          fontFamily: 'var(--font-space-grotesk, sans-serif)', letterSpacing: '-0.03em'
        }}>
          Executive Billing
        </h1>
        <p style={{ color: 'var(--sovereign-slate)', fontSize: '1.05rem', margin: 0 }}>
          Verwalte deine Subscriptions und Premium-Kapazitäten.
        </p>
      </header>

      {loading ? (
        <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
          {[1,2,3].map(i => <div key={i} className="skeleton skeleton-card" style={{ width: '380px', height: '500px' }} />)}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', position: 'relative' }}>
          {plans.map((plan, i) => {
            const isActive = currentTier === plan.name;
            return (
              <motion.div 
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                className={isActive ? 'glass-card-level-2' : 'glass-card-level-1'} 
                style={{ 
                  padding: '40px 32px', 
                  border: isActive ? `2px solid ${plan.color}` : '1px solid var(--sovereign-glass-border)',
                  position: 'relative', overflow: 'hidden',
                  display: 'flex', flexDirection: 'column'
                }}
              >
                {/* Aura Glow Behind */}
                {plan.aura && (
                  <div 
                    className={plan.aura} 
                    style={{ position: 'absolute', top: '-100px', right: '-100px', width: '300px', height: '300px', opacity: isActive ? 0.3 : 0.05, zIndex: 0 }} 
                  />
                )}

                <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <span className={plan.badgeClass} style={{ fontSize: '0.75rem', padding: '4px 12px' }}>
                      {plan.name}
                    </span>
                    {isActive && (
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--sovereign-success)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Check size={14} /> AKTIVER PLAN
                      </span>
                    )}
                  </div>
                  
                  <div style={{ marginBottom: '40px' }}>
                    <p style={{ fontSize: '3.5rem', fontWeight: 800, margin: 0, letterSpacing: '-0.04em', lineHeight: 1 }}>
                      {plan.price}
                    </p>
                    <p style={{ fontSize: '0.9rem', color: 'var(--sovereign-slate)', margin: '4px 0 0', fontWeight: 600 }}>
                      pro Monat, monatlich kündbar.
                    </p>
                  </div>
                  
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 48px', display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
                    {plan.features.map(feat => (
                      <li key={feat} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.95rem', color: 'var(--sovereign-alabaster)' }}>
                        <div style={{ padding: '2px', background: `${plan.color}20`, borderRadius: '50%', flexShrink: 0 }}>
                          <Check size={14} color={plan.color} />
                        </div>
                        {feat}
                      </li>
                    ))}
                  </ul>

                  {isActive ? (
                    <button className="secondary-button" style={{ padding: '16px', fontSize: '0.9rem', opacity: 0.6 }} disabled>
                      Derzeit aktiv
                    </button>
                  ) : (
                    <button 
                      className="primary-aura-button" 
                      style={{ 
                        padding: '16px', fontSize: '0.9rem', 
                        background: plan.name === 'SHIELD' 
                          ? 'linear-gradient(135deg, var(--sovereign-cyan), var(--sovereign-purple))' 
                          : undefined
                      }}
                    >
                      Upgraden zu {plan.name}
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Enterprise / Guardian Security Banner */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} style={{ marginTop: '56px' }}>
        <div className="glass-card-level-1" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '24px', background: 'rgba(0, 0, 0, 0.4)' }}>
          <Shield size={32} color="var(--sovereign-slate)" />
          <div>
            <p style={{ fontWeight: 700, margin: '0 0 4px', color: 'var(--sovereign-alabaster)' }}>Zahlungen via Stripe gesichert</p>
            <p style={{ fontSize: '0.85rem', color: 'var(--sovereign-slate)', margin: 0 }}>Wir speichern keine Kreditkartendaten. Alle Zahlungsverkehrsdaten werden verschlüsselt von Stripe Inc. verarbeitet.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
