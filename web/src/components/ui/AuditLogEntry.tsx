'use client';

import { Lock } from 'lucide-react';

export interface AuditEvent {
  id: string;
  timestamp: string; // ISO 8601
  actor: string;
  action: string;
  resource?: string;
  metadata?: Record<string, string | number | boolean>;
}

interface AuditLogEntryProps {
  event: AuditEvent;
  isLast?: boolean;
}

export function AuditLogEntry({ event, isLast = false }: AuditLogEntryProps) {
  const ts = new Date(event.timestamp);
  const date = ts.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const time = ts.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <div style={{ display: 'flex', gap: '14px', position: 'relative' }}>
      {/* Timeline line */}
      {!isLast && (
        <div style={{
          position: 'absolute',
          left: 15,
          top: 32,
          bottom: -8,
          width: 1,
          background: 'var(--s-border)',
        }} />
      )}
      {/* Icon */}
      <div style={{
        width: 32,
        height: 32,
        borderRadius: '50%',
        background: 'rgba(0,212,255,0.06)',
        border: '1px solid rgba(0,212,255,0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        zIndex: 1,
      }}>
        <Lock size={13} color="var(--sovereign-cyan)" />
      </div>
      {/* Content */}
      <div style={{ flex: 1, paddingBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--s-text)' }}>
              {event.action}
            </span>
            {event.resource && (
              <span style={{ marginLeft: 8, fontSize: '0.78rem', color: 'var(--s-text-muted)', fontFamily: 'var(--font-mono)' }}>
                · {event.resource}
              </span>
            )}
          </div>
          <time style={{ fontSize: '0.7rem', color: 'var(--s-text-faint)', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>
            {date} {time}
          </time>
        </div>
        <p style={{ fontSize: '0.78rem', color: 'var(--s-text-muted)', margin: '3px 0 0', fontFamily: 'var(--font-mono)' }}>
          {event.actor}
        </p>
        {event.metadata && Object.keys(event.metadata).length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
            {Object.entries(event.metadata).map(([k, v]) => (
              <span key={k} style={{
                fontSize: '0.65rem',
                fontFamily: 'var(--font-mono)',
                padding: '2px 7px',
                borderRadius: '4px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid var(--s-border)',
                color: 'var(--s-text-muted)',
              }}>
                {k}: {String(v)}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
