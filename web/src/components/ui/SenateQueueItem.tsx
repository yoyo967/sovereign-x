'use client';

import { motion } from 'framer-motion';
import { Clock, Eye, CheckCircle2, XCircle } from 'lucide-react';
import { RiskBadge, type RiskLevel } from './RiskBadge';

export type SenateStatus = 'PENDING' | 'REVIEWING' | 'APPROVED' | 'REJECTED' | 'EXPIRED';

export interface SenateItem {
  id: string;
  title: string;
  description: string;
  agentName: string;
  riskLevel: RiskLevel;
  status: SenateStatus;
  createdAt: string;
  expiresAt?: string;
  savingsEur?: number;
}

interface SenateQueueItemProps {
  item: SenateItem;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

const statusConfig: Record<SenateStatus, { icon: React.ElementType; color: string; label: string }> = {
  PENDING:   { icon: Clock,        color: '#FFD600',                           label: 'Ausstehend' },
  REVIEWING: { icon: Eye,          color: 'var(--sovereign-cyan)',             label: 'In Prüfung' },
  APPROVED:  { icon: CheckCircle2, color: 'var(--sovereign-success, #00E676)', label: 'Genehmigt' },
  REJECTED:  { icon: XCircle,      color: 'var(--sovereign-riskred)',          label: 'Abgelehnt' },
  EXPIRED:   { icon: Clock,        color: 'var(--s-text-faint)',               label: 'Abgelaufen' },
};

const STEPS: SenateStatus[] = ['PENDING', 'REVIEWING', 'APPROVED'];

export function SenateQueueItem({ item, onApprove, onReject }: SenateQueueItemProps) {
  const sc = statusConfig[item.status];
  const StatusIcon = sc.icon;
  const stepIndex = STEPS.indexOf(item.status);

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      style={{
        padding: '18px 20px',
        borderRadius: 'var(--s-radius-md)',
        background: 'var(--s-surface)',
        border: '1px solid var(--s-border)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: 'var(--s-text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 4px' }}>
            {item.agentName}
          </p>
          <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700 }}>{item.title}</h4>
          <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: 'var(--s-text-muted)', lineHeight: 1.5 }}>{item.description}</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px', flexShrink: 0 }}>
          <RiskBadge level={item.riskLevel} size="sm" />
          {item.savingsEur != null && (
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--sovereign-success, #00E676)', fontFamily: 'var(--font-mono)' }}>
              +{item.savingsEur.toFixed(2)} €/mo
            </span>
          )}
        </div>
      </div>

      {/* State Machine Visual */}
      {item.status !== 'REJECTED' && item.status !== 'EXPIRED' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {STEPS.map((step, i) => {
            const reached = stepIndex >= i;
            const isCurrent = stepIndex === i;
            return (
              <div key={step} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 0 }}>
                <motion.div
                  animate={isCurrent ? { scale: [1, 1.15, 1] } : {}}
                  transition={{ repeat: Infinity, duration: 1.8 }}
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: reached ? sc.color : 'var(--s-border)',
                    boxShadow: isCurrent ? `0 0 8px ${sc.color}` : 'none',
                    flexShrink: 0,
                  }}
                />
                {i < STEPS.length - 1 && (
                  <div style={{ flex: 1, height: 1, background: reached && stepIndex > i ? sc.color : 'var(--s-border)', margin: '0 4px', transition: 'background 0.4s' }} />
                )}
              </div>
            );
          })}
          <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: sc.color, letterSpacing: '0.08em', marginLeft: 8, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
            {sc.label}
          </span>
        </div>
      )}

      {/* Status badge for terminal states */}
      {(item.status === 'REJECTED' || item.status === 'EXPIRED') && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <StatusIcon size={14} color={sc.color} />
          <span style={{ fontSize: '0.75rem', color: sc.color, fontFamily: 'var(--font-mono)', letterSpacing: '0.06em' }}>{sc.label}</span>
        </div>
      )}

      {/* Actions */}
      {item.status === 'PENDING' && (onApprove || onReject) && (
        <div style={{ display: 'flex', gap: '8px', paddingTop: '4px', borderTop: '1px solid var(--s-divider)' }}>
          {onReject && (
            <button
              className="secondary-button"
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '8px', borderColor: 'rgba(255,23,68,0.2)', color: 'var(--sovereign-riskred)' }}
              onClick={() => onReject(item.id)}
            >
              <XCircle size={14} /> Ablehnen
            </button>
          )}
          {onApprove && (
            <button
              className="primary-aura-button"
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '8px' }}
              onClick={() => onApprove(item.id)}
            >
              <CheckCircle2 size={14} /> Genehmigen
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
}
