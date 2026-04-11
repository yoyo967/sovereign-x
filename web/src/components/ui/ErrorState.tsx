'use client';

import { AlertTriangle } from 'lucide-react';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  inline?: boolean;
}

export function ErrorState({ message = 'Ein Fehler ist aufgetreten.', onRetry, inline = false }: ErrorStateProps) {
  if (inline) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 14px',
        borderRadius: '8px',
        background: 'rgba(255,23,68,0.06)',
        border: '1px solid rgba(255,23,68,0.18)',
        color: 'var(--sovereign-riskred)',
        fontSize: '0.82rem',
      }}>
        <AlertTriangle size={15} />
        <span style={{ flex: 1 }}>{message}</span>
        {onRetry && (
          <button
            onClick={onRetry}
            style={{ background: 'none', border: 'none', color: 'var(--sovereign-riskred)', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 700, textDecoration: 'underline', padding: 0 }}
          >
            Erneut versuchen
          </button>
        )}
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 24px',
      textAlign: 'center',
      gap: '16px',
    }}>
      <div style={{
        width: 52,
        height: 52,
        borderRadius: '50%',
        background: 'rgba(255,23,68,0.08)',
        border: '1px solid rgba(255,23,68,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <AlertTriangle size={24} color="var(--sovereign-riskred)" />
      </div>
      <div>
        <h3 style={{ margin: '0 0 6px', fontSize: '1rem', fontWeight: 700 }}>Fehler</h3>
        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--s-text-muted)', maxWidth: 300 }}>{message}</p>
      </div>
      {onRetry && (
        <button className="secondary-button" onClick={onRetry}>
          Erneut versuchen
        </button>
      )}
    </div>
  );
}
