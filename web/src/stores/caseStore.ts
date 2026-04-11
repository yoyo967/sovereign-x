import { create } from 'zustand';

export type CaseStatus = 'OPEN' | 'IN_PROGRESS' | 'WAITING' | 'ESCALATED' | 'LEGAL' | 'NEGOTIATING' | 'RESOLVED';

export interface TimelineEntry {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  metadata?: Record<string, string>;
}

export interface Case {
  id: string;
  title: string;
  description: string;
  status: CaseStatus;
  category: string;
  claimAmountEur?: number;
  compensationEur?: number;
  nextStep?: string;
  legalBasis?: string;
  aiStrategy?: string;
  aiConfidence?: number;
  createdAt: string;
  updatedAt: string;
}

interface CaseStore {
  cases: Case[];
  activeCase: Case | null;
  timeline: TimelineEntry[];
  statusFilter: string;
  isLoading: boolean;
  error: string | null;

  setCases: (cases: Case[]) => void;
  setActiveCase: (c: Case | null) => void;
  setTimeline: (timeline: TimelineEntry[]) => void;
  setStatusFilter: (filter: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useCaseStore = create<CaseStore>((set) => ({
  cases: [],
  activeCase: null,
  timeline: [],
  statusFilter: '',
  isLoading: false,
  error: null,

  setCases: (cases) => set({ cases }),
  setActiveCase: (activeCase) => set({ activeCase }),
  setTimeline: (timeline) => set({ timeline }),
  setStatusFilter: (statusFilter) => set({ statusFilter }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
