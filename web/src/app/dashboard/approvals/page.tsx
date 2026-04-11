'use client';

import { useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { api } from '@/lib/api';
import { SwipeToApprove } from '@/components/ui/SwipeToApprove';
import { RiskBadge, type RiskLevel } from '@/components/ui/RiskBadge';
import { ConfidenceBadge } from '@/components/ui/ConfidenceBadge';
import { SkeletonLoader } from '@/components/ui/SkeletonLoader';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { SovereignCard } from '@/components/ui/SovereignCard';
import { useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Approval {
  id: string;
  title: string;
  description: string;
  agentName: string;
  riskLevel: RiskLevel;
  status: string;
  deadline?: string;
  savingsEur?: number;
  reason?: string;
  confidence?: number;
}

// ─── Approval Card ────────────────────────────────────────────────────────────

function ApprovalCard({ approval, onApprove, onReject }: { approval: Approval; onApprove: () => Promise<void>; onReject: () => Promise<void> }) {
  const requiresBiometric = approval.riskLevel === 'high' || approval.riskLevel === 'critical';

  return (
    <SwipeToApprove onApprove={onApprove} onReject={onReject} requireBiometric={requiresBiometric}>
      <SovereignCard variant={approval.riskLevel === 'high' || approval.riskLevel === 'critical' ? 'danger' : 'default'} animate={false}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '14px' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: '0 0 2px', fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: 'var(--s-text-faint)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{approval.agentName}</p>
            <h3 style={{ margin: '0 0 4px', fontSize: '1rem', fontWeight: 700 }}>{approval.title}</h3>
            <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--s-text-muted)', lineHeight: 1.5 }}>{approval.description}</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end', flexShrink: 0 }}>
            <RiskBadge level={approval.riskLevel} size="sm" />
            {approval.confidence != null && <ConfidenceBadge score={approval.confidence} size="sm" />}
          </div>
        </div>

        {/* Meta */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', paddingTop: '12px', borderTop: '1px solid var(--s-divider)' }}>
          {approval.savingsEur != null && approval.savingsEur > 0 && (
            <div>
              <p style={{ margin: '0 0 1px', fontSize: '0.65rem', color: 'var(--s-text-faint)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-mono)' }}>Einsparung</p>
              <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: 'var(--sovereign-success, #00E676)', fontFamily: 'var(--font-mono)' }}>+€{approval.savingsEur.toFixed(2)}/mo</p>
            </div>
          )}
          {approval.deadline && (
            <div>
              <p style={{ margin: '0 0 1px', fontSize: '0.65rem', color: 'var(--s-text-faint)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-mono)' }}>Frist</p>
              <p style={{ margin: 0, fontSize: '0.82rem', fontWeight: 600, color: '#FFD600', fontFamily: 'var(--font-mono)' }}>{new Date(approval.deadline).toLocaleDateString('de-DE')}</p>
            </div>
          )}
          {approval.reason && (
            <div style={{ flex: 1 }}>
              <p style={{ margin: '0 0 1px', fontSize: '0.65rem', color: 'var(--s-text-faint)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-mono)' }}>Begründung</p>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--s-text-muted)', lineHeight: 1.4 }}>{approval.reason}</p>
            </div>
          )}
        </div>

        {requiresBiometric && (
          <div style={{ marginTop: '10px', padding: '8px 12px', borderRadius: '8px', background: 'rgba(255,23,68,0.06)', border: '1px solid rgba(255,23,68,0.15)', fontSize: '0.73rem', color: 'var(--sovereign-riskred)' }}>
            Biometrie erforderlich für HIGH-Risk-Aktion
          </div>
        )}
      </SovereignCard>
    </SwipeToApprove>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.approvals.list('PENDING');
      setApprovals(Array.isArray(data) ? data : (data?.approvals ?? []));
    } catch {
      setError('Genehmigungen konnten nicht geladen werden.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const handleApprove = async (id: string) => {
    await api.approvals.approve(id, true);
    setDismissed((prev) => new Set([...prev, id]));
  };

  const handleReject = async (id: string) => {
    await api.approvals.reject(id);
    setDismissed((prev) => new Set([...prev, id]));
  };

  const pending = approvals.filter((a) => !dismissed.has(a.id));

  if (loading) return <SkeletonLoader variant="card" count={3} />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: 640, margin: '0 auto' }}>

      {/* Title */}
      <div>
        <h1 style={{ margin: '0 0 4px', fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.03em' }}>Genehmigungen</h1>
        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--s-text-muted)' }}>
          {pending.length > 0 ? `${pending.length} ausstehend — wische oder nutze die Buttons` : 'Alle Aktionen bearbeitet'}
        </p>
      </div>

      {pending.length === 0 ? (
        <EmptyState
          icon={<CheckCircle2 size={24} />}
          title="Alles erledigt"
          description="Keine ausstehenden Genehmigungen — alle autonomen Aktionen sind bearbeitet."
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {pending.map((approval, i) => (
            <motion.div key={approval.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <ApprovalCard
                approval={approval}
                onApprove={() => handleApprove(approval.id)}
                onReject={() => handleReject(approval.id)}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* HITL note */}
      <div style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(187,134,252,0.04)', border: '1px solid rgba(187,134,252,0.12)' }}>
        <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--s-text-muted)', lineHeight: 1.6 }}>
          <span style={{ fontWeight: 600, color: 'var(--sovereign-purple)' }}>HITL (Human-in-the-Loop):</span> Keine autonome Aktion wird ohne deine Genehmigung ausgeführt. HIGH-Risk-Aktionen erfordern Biometrie.
        </p>
      </div>
    </div>
  );
}
