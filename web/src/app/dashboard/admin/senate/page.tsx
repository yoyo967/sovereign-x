'use client';

import { useEffect, useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { Gavel, RefreshCw } from 'lucide-react';
import { api } from '@/lib/api';
import { useAdminStore } from '@/stores/adminStore';
import { SenateQueueItem } from '@/components/ui/SenateQueueItem';
import { SkeletonLoader } from '@/components/ui/SkeletonLoader';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { SovereignCard } from '@/components/ui/SovereignCard';
import type { SenateStatus } from '@/components/ui/SenateQueueItem';

const STATUS_FILTERS: { key: SenateStatus | ''; label: string }[] = [
  { key: '', label: 'Alle' },
  { key: 'PENDING', label: 'Ausstehend' },
  { key: 'REVIEWING', label: 'In Prüfung' },
  { key: 'APPROVED', label: 'Genehmigt' },
  { key: 'REJECTED', label: 'Abgelehnt' },
];

export default function SenatePage() {
  const { senateQueue, setSenateQueue } = useAdminStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<SenateStatus | ''>('');

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.approvals.list('ALL');
      setSenateQueue(Array.isArray(data) ? data : (data?.approvals ?? []));
    } catch {
      setError('Senate Queue konnte nicht geladen werden.');
    } finally {
      setLoading(false);
    }
  }, [setSenateQueue]);

  useEffect(() => { void load(); }, [load]);

  const handleApprove = async (id: string) => {
    try {
      await api.approvals.approve(id, false);
      void load();
    } catch { /* swallow */ }
  };

  const handleReject = async (id: string) => {
    try {
      await api.approvals.reject(id);
      void load();
    } catch { /* swallow */ }
  };

  const filtered = statusFilter
    ? senateQueue.filter((item) => item.status === statusFilter)
    : senateQueue;

  const stats = {
    total: senateQueue.length,
    pending: senateQueue.filter((i) => i.status === 'PENDING').length,
    approved: senateQueue.filter((i) => i.status === 'APPROVED').length,
    rejected: senateQueue.filter((i) => i.status === 'REJECTED').length,
  };

  if (loading) return <SkeletonLoader variant="card" count={3} />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ margin: '0 0 4px', fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.03em' }}>Senate Queue</h2>
          <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--s-text-muted)' }}>Plattformweite Genehmigungs-Queue aller Agenten-Aktionen</p>
        </div>
        <button onClick={load} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--s-divider)', color: 'var(--s-text-muted)', fontSize: '0.82rem', cursor: 'pointer' }}>
          <RefreshCw size={14} /> Aktualisieren
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
        {[
          { label: 'Gesamt', value: stats.total, color: '#BB86FC' },
          { label: 'Ausstehend', value: stats.pending, color: '#FFD600' },
          { label: 'Genehmigt', value: stats.approved, color: '#00E676' },
          { label: 'Abgelehnt', value: stats.rejected, color: '#FF1744' },
        ].map(({ label, value, color }) => (
          <SovereignCard key={label} variant="glass" animate={false} padding="12px 16px">
            <p style={{ margin: '0 0 4px', fontSize: '0.6rem', fontFamily: 'var(--font-mono)', color: 'var(--s-text-faint)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</p>
            <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color }}>{value}</p>
          </SovereignCard>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {STATUS_FILTERS.map(({ key, label }) => (
          <button key={key || 'all'} onClick={() => setStatusFilter(key)} style={{
            padding: '4px 12px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 600,
            background: statusFilter === key ? 'rgba(255,23,68,0.12)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${statusFilter === key ? 'rgba(255,23,68,0.3)' : 'rgba(255,255,255,0.1)'}`,
            color: statusFilter === key ? 'var(--sovereign-riskred)' : 'var(--s-text-muted)',
            cursor: 'pointer',
          }}>{label}</button>
        ))}
      </div>

      {/* Queue */}
      {filtered.length === 0 ? (
        <EmptyState icon={<Gavel size={24} />} title="Keine Einträge" description="Die Senate Queue ist leer." />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <SenateQueueItem item={item} onApprove={item.status === 'PENDING' ? handleApprove : undefined} onReject={item.status === 'PENDING' ? handleReject : undefined} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
