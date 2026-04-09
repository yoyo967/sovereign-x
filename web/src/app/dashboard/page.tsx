'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import {
  Zap, TrendingUp, Shield, AlertTriangle, FileText,
  ChevronRight, CheckCircle, Eye, ArrowUpRight,
  Bot, Globe, Scale, Activity, Clock
} from 'lucide-react';
import { api } from '@/lib/api';
import { useRBAC } from '@/hooks/useRBAC';

// ─── Types ──────────────────────────────────────────────
interface DashboardData {
  tier: string;
  totalContracts: number;
  activeContracts: number;
  totalMonthlyCostEur: number;
  totalAnnualCostEur: number;
  totalSavingsEur: number;
  pendingApprovals: number;
  activeClaims: number;
  recentInsights: Array<{
    id?: string;
    type?: string;
    merchantName?: string;
    amount?: number;
    description?: string;
  }>;
}

// ─── Sovereignty Score Ring ──────────────────────────────
function SovereigntyScore({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 52;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="sovereignty-score-ring">
      <svg width="120" height="120" viewBox="0 0 120 120">
        <defs>
          <linearGradient id="cyan-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00e5ff" />
            <stop offset="100%" stopColor="#bb86fc" />
          </linearGradient>
        </defs>
        <circle className="score-track" cx="60" cy="60" r="52" />
        <motion.circle
          className="score-fill"
          cx="60" cy="60" r="52"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
          stroke="url(#cyan-gradient)"
        />
      </svg>
      <div className="sovereignty-score-value">{score}</div>
    </div>
  );
}

// ─── Stat Card ──────────────────────────────────────────
function StatCard({
  label, value, sub, icon: Icon, color = 'var(--sovereign-cyan)', delay = 0
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  color?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className="stat-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <span style={{ color: 'var(--sovereign-slate)', fontSize: '0.85rem', fontWeight: 500, letterSpacing: '0.02em' }}>
          {label}
        </span>
        <div style={{
          width: '36px', height: '36px', borderRadius: '10px',
          background: `${color}15`, display: 'flex',
          alignItems: 'center', justifyContent: 'center'
        }}>
          <Icon size={18} color={color} />
        </div>
      </div>
      <p style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 4px 0', letterSpacing: '-0.03em', lineHeight: 1 }}>
        {value}
      </p>
      {sub && (
        <span style={{ fontSize: '0.78rem', color, fontWeight: 500 }}>{sub}</span>
      )}
    </motion.div>
  );
}

// ─── Loading Skeleton ────────────────────────────────────
function DashboardSkeleton() {
  return (
    <div style={{ maxWidth: '1280px' }}>
      <div className="skeleton skeleton-title" style={{ width: '300px', marginBottom: '8px' }} />
      <div className="skeleton skeleton-text" style={{ width: '400px', marginBottom: '40px' }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
        {[1, 2, 3, 4].map(i => <div key={i} className="skeleton skeleton-card" />)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '28px' }}>
        <div className="skeleton" style={{ height: '320px' }} />
        <div className="skeleton" style={{ height: '320px' }} />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// MAIN DASHBOARD COMPONENT
// ═══════════════════════════════════════════════════════
export default function DashboardOverview() {
  const t = useTranslations('dashboard');
  const { tier: rbacTier } = useRBAC();

  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        setLoading(true);
        const result = await api.user.getDashboard();
        setData(result);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        setError(t('common.error.connectionFailed'));
        setData({
          tier: rbacTier,
          totalContracts: 0,
          activeContracts: 0,
          totalMonthlyCostEur: 0,
          totalAnnualCostEur: 0,
          totalSavingsEur: 0,
          pendingApprovals: 0,
          activeClaims: 0,
          recentInsights: [],
        });
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <DashboardSkeleton />;

  const d = data!;
  const tierKey = d.tier === 'SHIELD' ? 'shield' : d.tier === 'PRO' ? 'pro' : 'free';
  const tierLabel = t(`tier.${tierKey}`);
  const tierClass = d.tier === 'SHIELD' ? 'badge-shield' : d.tier === 'PRO' ? 'badge-pro' : 'badge-free';

  const sovereigntyScore = Math.min(100, Math.round(
    (d.activeContracts > 0 ? 20 : 0) +
    (d.totalSavingsEur > 0 ? 25 : 0) +
    (d.pendingApprovals === 0 ? 15 : 5) +
    (d.tier === 'SHIELD' ? 30 : d.tier === 'PRO' ? 20 : 10) +
    (d.activeClaims > 0 ? 10 : 0)
  ));

  const scoreMessage = sovereigntyScore >= 80
    ? t('score.excellent')
    : sovereigntyScore >= 50
      ? t('score.good')
      : t('score.start');

  const insightTypeLabels: Record<string, string> = {
    PRICE_INCREASE: t('senate.insightTypes.PRICE_INCREASE'),
    NEW_SUBSCRIPTION: t('senate.insightTypes.NEW_SUBSCRIPTION'),
    SAVINGS_OPPORTUNITY: t('senate.insightTypes.SAVINGS_OPPORTUNITY'),
    UNUSUAL_ACTIVITY: t('senate.insightTypes.UNUSUAL_ACTIVITY'),
    DUPLICATE_PAYMENT: t('senate.insightTypes.DUPLICATE_PAYMENT'),
    CONTRACT_DETECTED: t('senate.insightTypes.CONTRACT_DETECTED'),
  };

  const insightIconMap: Record<string, { icon: React.ElementType; color: string }> = {
    PRICE_INCREASE: { icon: AlertTriangle, color: 'var(--sovereign-riskred)' },
    NEW_SUBSCRIPTION: { icon: Eye, color: 'var(--sovereign-gold)' },
    SAVINGS_OPPORTUNITY: { icon: TrendingUp, color: 'var(--sovereign-success)' },
    UNUSUAL_ACTIVITY: { icon: Activity, color: 'var(--sovereign-pink)' },
    DUPLICATE_PAYMENT: { icon: AlertTriangle, color: 'var(--sovereign-gold)' },
    CONTRACT_DETECTED: { icon: FileText, color: 'var(--sovereign-cyan)' },
  };

  function getInsightMeta(type?: string) {
    const key = type ?? '';
    return insightIconMap[key] ?? { icon: Zap, color: 'var(--sovereign-cyan)' };
  }

  const agents = [
    { key: 'negotiation', status: 'active', icon: Scale },
    { key: 'switch', status: 'ready', icon: Globe },
    { key: 'claim', status: 'ready', icon: Shield },
    { key: 'finance', status: 'active', icon: Eye },
  ] as const;

  const quickActions = [
    { labelKey: 'addContract', descKey: 'addContractDesc', descParams: undefined, icon: FileText, href: '/dashboard/contracts', color: 'var(--sovereign-cyan)' },
    { labelKey: 'checkApprovals', descKey: 'checkApprovalsDesc', descParams: { count: d.pendingApprovals }, icon: CheckCircle, href: '/dashboard/approvals', color: 'var(--sovereign-gold)' },
    { labelKey: 'analyzeFinance', descKey: 'analyzeFinanceDesc', descParams: undefined, icon: TrendingUp, href: '/dashboard/finance', color: 'var(--sovereign-purple)' },
    { labelKey: 'submitClaim', descKey: 'submitClaimDesc', descParams: undefined, icon: Shield, href: '/dashboard/claims', color: 'var(--sovereign-teal)' },
  ] as const;

  return (
    <div style={{ maxWidth: '1280px' }}>

      {/* ─── Header ─── */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '36px' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{
              fontSize: '2.2rem', fontWeight: 800, marginBottom: '6px',
              fontFamily: 'var(--font-space-grotesk, sans-serif)',
              letterSpacing: '-0.03em'
            }}>
              {t('overview.title')}
            </h1>
            <p style={{ color: 'var(--sovereign-slate)', fontSize: '1rem' }}>
              {t('overview.subtitle')}
            </p>
          </div>
          {d.pendingApprovals > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              style={{
                background: 'rgba(255, 64, 129, 0.1)',
                border: '1px solid rgba(255, 64, 129, 0.2)',
                borderRadius: '12px', padding: '8px 16px',
                display: 'flex', alignItems: 'center', gap: '8px'
              }}
            >
              <Clock size={14} color="var(--sovereign-pink)" />
              <span style={{ fontSize: '0.8rem', color: 'var(--sovereign-pink)', fontWeight: 600 }}>
                {t('overview.approvalBadge', { count: d.pendingApprovals })}
              </span>
            </motion.div>
          )}
        </div>
      </motion.header>

      {/* ─── Error Banner ─── */}
      {error && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          style={{
            background: 'rgba(255, 214, 0, 0.06)',
            border: '1px solid rgba(255, 214, 0, 0.15)',
            borderRadius: '14px', padding: '14px 20px',
            marginBottom: '24px', display: 'flex',
            alignItems: 'center', gap: '10px'
          }}
        >
          <AlertTriangle size={16} color="var(--sovereign-gold)" />
          <span style={{ fontSize: '0.85rem', color: 'var(--sovereign-gold)' }}>
            {error} {t('common.error.showingBasic')}
          </span>
        </motion.div>
      )}

      {/* ─── Quick Stats Grid ─── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px', marginBottom: '36px'
      }}>
        <StatCard
          label={t('stats.monthlyCost')}
          value={`€${d.totalMonthlyCostEur.toLocaleString('de-DE', { minimumFractionDigits: 2 })}`}
          sub={t('stats.annualCostSub', { amount: `€${d.totalAnnualCostEur.toLocaleString('de-DE')}` })}
          icon={TrendingUp}
          delay={0.1}
        />
        <StatCard
          label={t('stats.activeContracts')}
          value={d.activeContracts}
          sub={t('stats.totalContractsSub', { count: d.totalContracts })}
          icon={FileText}
          color="var(--sovereign-purple)"
          delay={0.2}
        />
        <StatCard
          label={t('stats.savings')}
          value={`€${d.totalSavingsEur.toLocaleString('de-DE', { minimumFractionDigits: 2 })}`}
          sub={t('stats.savingsSub')}
          icon={Zap}
          color="var(--sovereign-success)"
          delay={0.3}
        />
        <StatCard
          label={t('stats.pendingActions')}
          value={d.pendingApprovals + d.activeClaims}
          sub={t('stats.pendingActionsSub', { approvals: d.pendingApprovals, claims: d.activeClaims })}
          icon={CheckCircle}
          color="var(--sovereign-gold)"
          delay={0.4}
        />
      </div>

      {/* ─── Senate Feed + Score ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '28px', marginBottom: '36px' }}>

        {/* Algorithmic Senate Feed */}
        <motion.section
          className="glass-card-level-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{ padding: '28px' }}
        >
          <div className="section-header" style={{ marginBottom: '20px' }}>
            {t('senate.title')}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {d.recentInsights.length > 0 ? (
              d.recentInsights.map((insight, i) => {
                const { icon: InsightIcon, color } = getInsightMeta(insight.type);
                const label = insight.type ? (insightTypeLabels[insight.type] ?? t('senate.insightTypes.DEFAULT')) : t('senate.insightTypes.DEFAULT');
                return (
                  <motion.div
                    key={insight.id ?? i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    style={{
                      display: 'flex', gap: '14px', padding: '16px',
                      background: 'rgba(255,255,255,0.02)', borderRadius: '16px',
                      border: '1px solid var(--sovereign-silver)',
                      cursor: 'pointer'
                    }}
                    whileHover={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.15)' }}
                  >
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '12px',
                      background: `${color}12`, display: 'flex',
                      alignItems: 'center', justifyContent: 'center', flexShrink: 0
                    }}>
                      <InsightIcon size={18} color={color} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <p style={{ fontWeight: 600, fontSize: '0.9rem', margin: 0 }}>
                          {insight.merchantName ?? label}
                        </p>
                        <span className={`deadline-chip${insight.type === 'PRICE_INCREASE' ? ' deadline-chip-urgent' : ''}`}>
                          {label}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.82rem', color: 'var(--sovereign-slate)', margin: 0, lineHeight: 1.5 }}>
                        {insight.description ?? t('senate.defaultDescription')}
                      </p>
                      {insight.amount != null && (
                        <p style={{ fontSize: '0.82rem', color, margin: '6px 0 0', fontWeight: 600 }}>
                          {insight.amount > 0 ? '+' : ''}€{Math.abs(insight.amount).toFixed(2)}/Monat
                        </p>
                      )}
                    </div>
                    <ChevronRight size={16} color="var(--sovereign-slate)" style={{ alignSelf: 'center', flexShrink: 0 }} />
                  </motion.div>
                );
              })
            ) : (
              <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--sovereign-slate)' }}>
                <div style={{
                  width: '56px', height: '56px', borderRadius: '50%',
                  background: 'var(--sovereign-glass-10)', margin: '0 auto 16px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Bot size={24} color="var(--sovereign-cyan)" />
                </div>
                <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--sovereign-alabaster)', margin: '0 0 6px' }}>
                  {t('senate.emptyTitle')}
                </p>
                <p style={{ fontSize: '0.82rem', margin: 0 }}>
                  {t('senate.emptyText')}
                </p>
              </div>
            )}
          </div>
        </motion.section>

        {/* Sovereignty Score + Tier */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <motion.section
            className="glass-card-level-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            style={{ padding: '28px', textAlign: 'center' }}
          >
            <div className="section-header" style={{ justifyContent: 'center', marginBottom: '24px' }}>
              {t('score.title')}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
              <SovereigntyScore score={sovereigntyScore} />
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--sovereign-slate)', margin: '0 0 4px', lineHeight: 1.5 }}>
              {scoreMessage}
            </p>
          </motion.section>

          <motion.section
            className="glass-card-level-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            style={{ padding: '28px', textAlign: 'center', flex: 1 }}
          >
            <div className="section-header" style={{ justifyContent: 'center', marginBottom: '20px' }}>
              {t('tier.title')}
            </div>
            <div style={{
              width: '80px', height: '80px', borderRadius: '50%',
              background: d.tier === 'SHIELD'
                ? 'linear-gradient(135deg, var(--sovereign-cyan), var(--sovereign-purple))'
                : d.tier === 'PRO'
                  ? 'linear-gradient(135deg, var(--sovereign-cyan), #00b8d4)'
                  : 'linear-gradient(135deg, rgba(158,158,158,0.3), rgba(158,158,158,0.1))',
              margin: '0 auto 16px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: d.tier !== 'FREE' ? '0 0 30px rgba(0, 229, 255, 0.2)' : 'none'
            }}>
              <Shield size={36} color="white" />
            </div>
            <h4 style={{ fontSize: '1.3rem', marginBottom: '4px', fontWeight: 800, letterSpacing: '-0.02em' }}>
              {tierLabel.toUpperCase()}
            </h4>
            <span className={tierClass}>{tierLabel} Tier</span>
            <div style={{ marginTop: '20px' }}>
              {d.tier === 'FREE' ? (
                <button className="primary-aura-button" style={{ width: '100%' }}>
                  {t('common.upgradeToPro')}
                </button>
              ) : (
                <button className="secondary-button" style={{ width: '100%' }}>
                  {t('common.managePlan')}
                </button>
              )}
            </div>
          </motion.section>
        </div>
      </div>

      {/* ─── Agent Status + Quick Actions ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px' }}>

        {/* Agent Status */}
        <motion.section
          className="glass-card-level-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          style={{ padding: '28px' }}
        >
          <div className="section-header">{t('agents.title')}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {agents.map((agent, i) => (
              <motion.div
                key={agent.key}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + i * 0.08 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '14px',
                  padding: '14px 16px', borderRadius: '14px',
                  background: agent.status === 'active' ? 'rgba(0, 229, 255, 0.03)' : 'transparent',
                  border: `1px solid ${agent.status === 'active' ? 'rgba(0, 229, 255, 0.1)' : 'transparent'}`,
                }}
              >
                <div style={{
                  width: '36px', height: '36px', borderRadius: '10px',
                  background: agent.status === 'active' ? 'rgba(0, 229, 255, 0.08)' : 'var(--sovereign-glass-10)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <agent.icon size={16} color={agent.status === 'active' ? 'var(--sovereign-cyan)' : 'var(--sovereign-slate)'} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, fontSize: '0.88rem', margin: '0 0 2px' }}>
                    {t(`agents.items.${agent.key}.name`)}
                  </p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--sovereign-slate)', margin: 0 }}>
                    {t(`agents.items.${agent.key}.desc`)}
                  </p>
                </div>
                <span className={`agent-dot ${agent.status === 'active' ? 'agent-dot-active' : 'agent-dot-ready'}`} />
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Quick Actions */}
        <motion.section
          className="glass-card-level-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }}
          style={{ padding: '28px' }}
        >
          <div className="section-header">{t('quickActions.title')}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {quickActions.map((action, i) => (
              <motion.a
                key={action.labelKey}
                href={action.href}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.85 + i * 0.08 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '14px',
                  padding: '14px 16px', borderRadius: '14px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--sovereign-silver)',
                  textDecoration: 'none', color: 'inherit', cursor: 'pointer',
                }}
              >
                <div style={{
                  width: '36px', height: '36px', borderRadius: '10px',
                  background: `${action.color}12`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <action.icon size={16} color={action.color} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, fontSize: '0.88rem', margin: '0 0 2px' }}>
                    {t(`quickActions.${action.labelKey}`)}
                  </p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--sovereign-slate)', margin: 0 }}>
                    {action.descParams
                      ? t(`quickActions.${action.descKey}`, action.descParams)
                      : t(`quickActions.${action.descKey}`)
                    }
                  </p>
                </div>
                <ArrowUpRight size={14} color="var(--sovereign-slate)" />
              </motion.a>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
