'use client';

import React from 'react';
import { motion } from 'framer-motion';
import BrainstormerTerminal from '@/components/BrainstormerTerminal';

export default function AI_DashboardPage() {
  return (
    <div style={{ maxWidth: '1280px' }}>
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ 
          fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px',
          fontFamily: 'var(--font-space-grotesk, sans-serif)', letterSpacing: '-0.03em'
        }}>
          Algorithmic Senate
        </h1>
        <p style={{ color: 'var(--sovereign-slate)', fontSize: '1.05rem', margin: 0 }}>
          Sprich mit deinem Sovereign Twin, um Strategien und Kontext zu etablieren.
        </p>
      </header>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <BrainstormerTerminal />
      </motion.div>
    </div>
  );
}
