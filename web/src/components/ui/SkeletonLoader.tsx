'use client';

type SkeletonVariant = 'card' | 'text' | 'table' | 'kpi' | 'list';

interface SkeletonLoaderProps {
  variant?: SkeletonVariant;
  count?: number;
}

function SkeletonBlock({ width = '100%', height = 16, radius = 6, mb = 0 }: { width?: string | number; height?: number; radius?: number; mb?: number }) {
  return (
    <div className="skeleton" style={{ width, height, borderRadius: radius, marginBottom: mb }} />
  );
}

function CardSkeleton() {
  return (
    <div style={{ padding: '20px', borderRadius: 16, background: 'var(--s-surface)', border: '1px solid var(--s-border)' }}>
      <SkeletonBlock width="40%" height={12} mb={10} />
      <SkeletonBlock width="70%" height={28} mb={8} />
      <SkeletonBlock width="55%" height={12} />
    </div>
  );
}

function KpiSkeleton() {
  return (
    <div style={{ padding: '20px', borderRadius: 16, background: 'var(--s-surface)', border: '1px solid var(--s-border)' }}>
      <SkeletonBlock width="50%" height={11} mb={12} />
      <SkeletonBlock width="65%" height={36} mb={10} />
      <SkeletonBlock width="40%" height={11} />
    </div>
  );
}

function TextSkeleton() {
  return (
    <div>
      <SkeletonBlock width="90%" height={14} mb={6} />
      <SkeletonBlock width="75%" height={14} mb={6} />
      <SkeletonBlock width="60%" height={14} />
    </div>
  );
}

function TableRowSkeleton() {
  return (
    <div style={{ display: 'flex', gap: '16px', padding: '14px 0', borderBottom: '1px solid var(--s-divider)', alignItems: 'center' }}>
      <SkeletonBlock width={32} height={32} radius={8} />
      <div style={{ flex: 1 }}>
        <SkeletonBlock width="60%" height={13} mb={5} />
        <SkeletonBlock width="40%" height={11} />
      </div>
      <SkeletonBlock width={64} height={22} radius={4} />
    </div>
  );
}

function ListSkeleton() {
  return (
    <div style={{ padding: '16px', borderRadius: 12, background: 'var(--s-surface)', border: '1px solid var(--s-border)' }}>
      <SkeletonBlock width="55%" height={13} mb={6} />
      <SkeletonBlock width="80%" height={11} />
    </div>
  );
}

export function SkeletonLoader({ variant = 'card', count = 3 }: SkeletonLoaderProps) {
  const items = Array.from({ length: count }, (_, i) => i);

  if (variant === 'kpi') {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
        {items.map(i => <KpiSkeleton key={i} />)}
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
        {items.map(i => <CardSkeleton key={i} />)}
      </div>
    );
  }

  if (variant === 'table') {
    return (
      <div>
        {items.map(i => <TableRowSkeleton key={i} />)}
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {items.map(i => <ListSkeleton key={i} />)}
      </div>
    );
  }

  return <TextSkeleton />;
}
