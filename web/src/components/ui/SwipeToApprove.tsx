'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { CheckCircle2, XCircle, Fingerprint } from 'lucide-react';
import type { ReactNode } from 'react';

interface SwipeToApproveProps {
  children: ReactNode;
  onApprove: () => Promise<void> | void;
  onReject: () => Promise<void> | void;
  requireBiometric?: boolean;
  disabled?: boolean;
}

async function requestBiometric(): Promise<boolean> {
  if (!window.PublicKeyCredential) return true; // fallback: allow
  try {
    const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    if (!available) return true;
    await navigator.credentials.get({
      publicKey: {
        challenge: crypto.getRandomValues(new Uint8Array(32)),
        timeout: 60000,
        userVerification: 'required',
        rpId: window.location.hostname,
        allowCredentials: [],
      },
    });
    return true;
  } catch {
    return false;
  }
}

export function SwipeToApprove({ children, onApprove, onReject, requireBiometric = false, disabled = false }: SwipeToApproveProps) {
  const [decision, setDecision] = useState<'approved' | 'rejected' | null>(null);
  const [biometricPending, setBiometricPending] = useState(false);
  const x = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const approveOpacity = useTransform(x, [-50, 0, 80], [0, 0, 1]);
  const rejectOpacity  = useTransform(x, [-80, 0, 50], [1, 0, 0]);
  const cardRotate     = useTransform(x, [-200, 0, 200], [-8, 0, 8]);
  const cardOpacity    = useTransform(x, [-150, -100, 0, 100, 150], [0, 1, 1, 1, 0]);

  const handleDragEnd = useCallback(async (_: unknown, info: { offset: { x: number } }) => {
    const threshold = 100;
    if (info.offset.x > threshold) {
      // Approve (swipe right)
      if (requireBiometric) {
        setBiometricPending(true);
        const ok = await requestBiometric();
        setBiometricPending(false);
        if (!ok) {
          animate(x, 0, { type: 'spring', stiffness: 400, damping: 30 });
          return;
        }
      }
      setDecision('approved');
      await onApprove();
    } else if (info.offset.x < -threshold) {
      setDecision('rejected');
      await onReject();
    } else {
      animate(x, 0, { type: 'spring', stiffness: 400, damping: 30 });
    }
  }, [onApprove, onReject, requireBiometric, x]);

  if (decision === 'approved') {
    return (
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        style={{ padding: '40px', textAlign: 'center', borderRadius: 16, background: 'rgba(0,230,118,0.06)', border: '1px solid rgba(0,230,118,0.2)' }}
      >
        <CheckCircle2 size={40} color="var(--sovereign-success, #00E676)" style={{ margin: '0 auto 12px', display: 'block' }} />
        <p style={{ fontWeight: 700, color: 'var(--sovereign-success, #00E676)', fontSize: '0.9rem' }}>Genehmigt</p>
      </motion.div>
    );
  }

  if (decision === 'rejected') {
    return (
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        style={{ padding: '40px', textAlign: 'center', borderRadius: 16, background: 'rgba(255,23,68,0.06)', border: '1px solid rgba(255,23,68,0.2)' }}
      >
        <XCircle size={40} color="var(--sovereign-riskred)" style={{ margin: '0 auto 12px', display: 'block' }} />
        <p style={{ fontWeight: 700, color: 'var(--sovereign-riskred)', fontSize: '0.9rem' }}>Abgelehnt</p>
      </motion.div>
    );
  }

  return (
    <div ref={containerRef} style={{ position: 'relative', userSelect: 'none' }}>
      {/* Approve indicator */}
      <motion.div style={{ opacity: approveOpacity, position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', zIndex: 0, pointerEvents: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--sovereign-success, #00E676)', fontWeight: 700, fontSize: '0.85rem' }}>
          <CheckCircle2 size={20} /> GENEHMIGEN
        </div>
      </motion.div>

      {/* Reject indicator */}
      <motion.div style={{ opacity: rejectOpacity, position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', zIndex: 0, pointerEvents: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--sovereign-riskred)', fontWeight: 700, fontSize: '0.85rem' }}>
          <XCircle size={20} /> ABLEHNEN
        </div>
      </motion.div>

      {/* Card */}
      <motion.div
        drag={disabled || biometricPending ? false : 'x'}
        dragConstraints={{ left: -200, right: 200 }}
        dragElastic={0.2}
        style={{ x, rotate: cardRotate, opacity: cardOpacity, position: 'relative', zIndex: 1 }}
        onDragEnd={handleDragEnd}
      >
        {children}
        {biometricPending && (
          <div style={{
            position: 'absolute', inset: 0, borderRadius: 16,
            background: 'rgba(8,14,26,0.85)', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: '12px', zIndex: 10,
          }}>
            <Fingerprint size={40} color="var(--sovereign-cyan)" />
            <p style={{ fontSize: '0.85rem', color: 'var(--sovereign-cyan)', fontWeight: 600 }}>Biometrie erforderlich…</p>
          </div>
        )}
      </motion.div>

      {/* Hint */}
      {!disabled && (
        <p style={{ textAlign: 'center', fontSize: '0.7rem', color: 'var(--s-text-faint)', marginTop: 8, fontFamily: 'var(--font-mono)' }}>
          ← Ablehnen &nbsp;|&nbsp; Genehmigen →
        </p>
      )}
    </div>
  );
}
