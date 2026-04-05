'use client';

import React, { useState, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import { FileText, Plus, Search, Filter, Calendar, AlertTriangle } from 'lucide-react';
import { api } from '@/lib/api';
import { useRequireAuth } from '@/hooks/useRequireAuth';

interface Contract {
  id: string;
  category: string;
  status: string;
  provider: string;
  name: string;
  monthlyCostEur?: number;
  nextPaymentDate?: string;
}

export default function ContractsPage() {
  const { user, loading: authLoading } = useRequireAuth();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    async function loadContracts() {
      try {
        setLoading(true);
        const data = await api.contracts.list();
        setContracts(data?.contracts || []);
      } catch (err) {
        console.error(err);
        setError('Fehler beim Laden der Verträge.');
      } finally {
        setLoading(false);
      }
    }
    loadContracts();
  }, [user]);

  if (authLoading) return null; // handled by useRequireAuth

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.1 } 
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <div style={{ maxWidth: '1280px' }}>
      <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ 
            fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px',
            fontFamily: 'var(--font-space-grotesk, sans-serif)',
            letterSpacing: '-0.03em'
          }}>
            Vertrags-Tresor
          </h1>
          <p style={{ color: 'var(--sovereign-slate)', fontSize: '1.05rem', margin: 0 }}>
            Management und Optimierung deines globalen Vertragsportfolios.
          </p>
        </div>
        <button className="primary-aura-button" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={16} />
          Neuer Vertrag
        </button>
      </header>

      {/* Control Bar */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--sovereign-slate)' }} />
          <input 
            type="text" 
            placeholder="Suchen nach Anbieter, Kategorie..." 
            className="sovereign-input"
            style={{ paddingLeft: '48px' }}
          />
        </div>
        <button className="secondary-button" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={16} />
          Filter
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
          {[1,2,3].map(i => <div key={i} className="skeleton skeleton-card" style={{ height: '200px' }} />)}
        </div>
      ) : error ? (
        <div className="glass-card-level-1" style={{ padding: '32px', textAlign: 'center', color: 'var(--sovereign-riskred)' }}>
          <AlertTriangle size={32} style={{ margin: '0 auto 16px' }} />
          <p>{error}</p>
        </div>
      ) : contracts.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="empty-state glass-card-level-1"
        >
          <div className="empty-state-icon">
            <FileText size={32} color="var(--sovereign-cyan)" />
          </div>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '8px', color: 'var(--sovereign-alabaster)' }}>Keine Verträge gefunden</h3>
          <p style={{ color: 'var(--sovereign-slate)', marginBottom: '32px', maxWidth: '400px' }}>
            Lade Vertragsdokumente (PDF) hoch oder verbinde dein Bankkonto, damit Sovereign Verträge automatisch erkennt.
          </p>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button className="primary-aura-button">Bank verbinden</button>
            <button className="secondary-button">Dokument hochladen</button>
          </div>
        </motion.div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}
        >
          {contracts.map(contract => (
            <motion.div key={contract.id} variants={itemVariants} className="stat-card" style={{ cursor: 'pointer' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <span className="category-chip">{contract.category || 'GENERAL'}</span>
                <span className={`deadline-chip ${contract.status === 'ACTIVE' ? 'deadline-chip-safe' : 'deadline-chip-warning'}`}>
                  {contract.status === 'ACTIVE' ? 'Aktiv' : contract.status}
                </span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ 
                  width: '40px', height: '40px', borderRadius: '12px', 
                  background: 'var(--sovereign-glass-15)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center' 
                }}>
                  <FileText size={20} color="var(--sovereign-cyan)" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 2px' }}>{contract.provider}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--sovereign-slate)', margin: 0 }}>{contract.name}</p>
                </div>
              </div>
              
              <div style={{ 
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', 
                borderTop: '1px solid var(--sovereign-silver)', paddingTop: '16px', marginTop: 'auto' 
              }}>
                <div>
                  <p style={{ fontSize: '0.7rem', color: 'var(--sovereign-slate)', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Kosten
                  </p>
                  <p style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: 'var(--sovereign-alabaster)', letterSpacing: '-0.02em' }}>
                    €{contract.monthlyCostEur?.toFixed(2) || '0.00'}<span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--sovereign-slate)' }}>/mo</span>
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '0.7rem', color: 'var(--sovereign-slate)', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Nächste Zahlung
                  </p>
                  <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--sovereign-alabaster)', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={14} color="var(--sovereign-slate)" />
                    {contract.nextPaymentDate ? new Date(contract.nextPaymentDate).toLocaleDateString('de-DE') : 'Unbekannt'}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
