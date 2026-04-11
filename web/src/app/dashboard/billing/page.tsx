'use client';

import { motion } from 'framer-motion';
import { Check, Shield, Zap, Star } from 'lucide-react';
import { useRBAC } from '@/hooks/useRBAC';
import { SovereignCard } from '@/components/ui/SovereignCard';

// ─── Plan definitions ─────────────────────────────────────────────────────────

const PLANS = [
  {
    id: 'FREE',
    name: 'Free',
    price: 0,
    color: '#888888',
    icon: <Zap size={20} />,
    features: [
      '3 Verträge scannen & analysieren',
      '1 Life-Case verwalten',
      '10 KI-Chats pro Monat',
      'Basis-Finanzübersicht',
      'Genehmigungen & HITL',
    ],
    cta: null,
  },
  {
    id: 'PRO',
    name: 'Pro',
    price: 14.99,
    color: '#BB86FC',
    icon: <Star size={20} />,
    features: [
      'Unbegrenzte Verträge',
      '10 Life-Cases gleichzeitig',
      '100 KI-Chats pro Monat',
      'Erweiterte KI-Strategie',
      'CSV-Import Finanzen',
      'Prioritäts-Support',
    ],
    cta: 'Upgrade auf PRO',
    stripeLink: '#',
  },
  {
    id: 'SHIELD',
    name: 'Shield',
    price: 29.99,
    color: '#03DAC6',
    icon: <Shield size={20} />,
    features: [
      'Alles aus PRO',
      'Family Vault (bis 5 Mitglieder)',
      'Voice & Kamera-Vision KI',
      'finAPI PSD2 Bankverbindung',
      'Biometrische Absicherung',
      'NIS2-konformes Audit-Log',
    ],
    cta: 'Upgrade auf SHIELD',
    stripeLink: '#',
  },
] as const;

type PlanId = 'FREE' | 'PRO' | 'SHIELD';

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BillingPage() {
  const { tier } = useRBAC();
  const currentTier = (tier ?? 'FREE').toUpperCase() as PlanId;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: 860, margin: '0 auto' }}>

      {/* Header */}
      <div>
        <h1 style={{ margin: '0 0 4px', fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.03em' }}>Abrechnung & Plan</h1>
        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--s-text-muted)' }}>
          Dein aktueller Plan: <span style={{ fontWeight: 700, color: PLANS.find((p) => p.id === currentTier)?.color ?? '#888' }}>{currentTier}</span>
        </p>
      </div>

      {/* Plan Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        {PLANS.map((plan, i) => {
          const isCurrent = currentTier === plan.id;
          return (
            <motion.div key={plan.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <SovereignCard
                variant={isCurrent ? 'elevated' : 'glass'}
                glow={isCurrent}
                animate={false}
                style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
              >
                {/* Plan Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: `${plan.color}18`, border: `1px solid ${plan.color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: plan.color }}>
                      {plan.icon}
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: plan.color, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{plan.name}</p>
                      <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: plan.color }}>
                        {plan.price === 0 ? 'Kostenlos' : `€${plan.price.toFixed(2)}`}
                        {plan.price > 0 && <span style={{ fontSize: '0.7rem', fontWeight: 400, color: 'var(--s-text-faint)' }}>/mo</span>}
                      </p>
                    </div>
                  </div>
                  {isCurrent && (
                    <span style={{ padding: '3px 8px', borderRadius: 20, background: `${plan.color}18`, border: `1px solid ${plan.color}40`, fontSize: '0.6rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: plan.color }}>
                      AKTIV
                    </span>
                  )}
                </div>

                {/* Features */}
                <ul style={{ margin: '0 0 20px', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                  {plan.features.map((f) => (
                    <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.8rem', color: 'var(--s-text-muted)', lineHeight: 1.4 }}>
                      <Check size={14} style={{ color: plan.color, flexShrink: 0, marginTop: 2 }} />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                {isCurrent ? (
                  <div style={{ padding: '8px 12px', borderRadius: 8, background: `${plan.color}08`, border: `1px solid ${plan.color}20`, textAlign: 'center', fontSize: '0.78rem', color: plan.color, fontWeight: 600 }}>
                    ✓ Dein aktueller Plan
                  </div>
                ) : plan.cta && currentTier !== 'SHIELD' ? (
                  <a
                    href={plan.stripeLink}
                    style={{
                      display: 'block', padding: '10px', borderRadius: 10, textAlign: 'center',
                      background: `${plan.color}18`, border: `1px solid ${plan.color}40`,
                      color: plan.color, fontSize: '0.85rem', fontWeight: 700,
                      textDecoration: 'none', transition: 'background 0.15s',
                    }}
                  >
                    {plan.cta}
                  </a>
                ) : (
                  <div style={{ padding: '8px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.03)', textAlign: 'center', fontSize: '0.75rem', color: 'var(--s-text-faint)' }}>
                    Nicht verfügbar
                  </div>
                )}
              </SovereignCard>
            </motion.div>
          );
        })}
      </div>

      {/* Current Plan Details */}
      <SovereignCard variant="glass" animate={false}>
        <p style={{ margin: '0 0 14px', fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--s-text-faint)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Rechnungsdetails</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px' }}>
          {[
            { label: 'Plan', value: currentTier },
            { label: 'Nächste Zahlung', value: currentTier === 'FREE' ? '—' : '01.05.2026' },
            { label: 'Zahlungsmethode', value: currentTier === 'FREE' ? '—' : '**** 4242' },
            { label: 'Status', value: 'Aktiv' },
          ].map(({ label, value }) => (
            <div key={label}>
              <p style={{ margin: '0 0 2px', fontSize: '0.6rem', color: 'var(--s-text-faint)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</p>
              <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>{value}</p>
            </div>
          ))}
        </div>
      </SovereignCard>

      {/* SHIELD plan gate hint for lower tiers */}
      {currentTier !== 'SHIELD' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '14px 18px', borderRadius: 12, background: 'rgba(3,218,198,0.05)', border: '1px solid rgba(3,218,198,0.15)' }}>
          <Shield size={20} style={{ color: '#03DAC6', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <p style={{ margin: '0 0 2px', fontWeight: 700, color: '#03DAC6', fontSize: '0.9rem' }}>Family Vault & Bankverbindung freischalten</p>
            <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--s-text-muted)' }}>SHIELD gibt dir Zugriff auf Family Vault, Voice-KI, finAPI PSD2 und biometrische Absicherung.</p>
          </div>
          <a href="#shield" style={{ padding: '6px 14px', borderRadius: 8, background: 'rgba(3,218,198,0.1)', border: '1px solid rgba(3,218,198,0.3)', color: '#03DAC6', fontSize: '0.78rem', fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap' }}>Upgrade auf SHIELD</a>
        </div>
      )}
    </div>
  );
}
