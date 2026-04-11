import { create } from 'zustand';

export type ContractStatus = 'ACTIVE' | 'CANCELLED' | 'EXPIRED' | 'PENDING';
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface Contract {
  id: string;
  name: string;
  provider: string;
  category: string;
  status: ContractStatus;
  monthlyCostEur?: number;
  nextPaymentDate?: string;
  riskLevel?: RiskLevel;
  aiConfidence?: number;
  autoRenewal?: boolean;
  noticePeriodDays?: number;
}

export type ScanStatus = 'idle' | 'uploading' | 'processing' | 'done' | 'error';

interface ContractFilters {
  search: string;
  status: string;
  risk: string;
  category: string;
}

interface ContractStore {
  contracts: Contract[];
  activeContract: Contract | null;
  scanStatus: ScanStatus;
  scanProgress: number;
  filters: ContractFilters;
  isLoading: boolean;
  error: string | null;

  setContracts: (contracts: Contract[]) => void;
  setActiveContract: (contract: Contract | null) => void;
  setScanStatus: (status: ScanStatus, progress?: number) => void;
  setFilters: (filters: Partial<ContractFilters>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialFilters: ContractFilters = { search: '', status: '', risk: '', category: '' };

export const useContractStore = create<ContractStore>((set) => ({
  contracts: [],
  activeContract: null,
  scanStatus: 'idle',
  scanProgress: 0,
  filters: initialFilters,
  isLoading: false,
  error: null,

  setContracts: (contracts) => set({ contracts }),
  setActiveContract: (activeContract) => set({ activeContract }),
  setScanStatus: (scanStatus, scanProgress = 0) => set({ scanStatus, scanProgress }),
  setFilters: (filters) => set((s) => ({ filters: { ...s.filters, ...filters } })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  reset: () => set({ contracts: [], activeContract: null, scanStatus: 'idle', scanProgress: 0, filters: initialFilters, isLoading: false, error: null }),
}));
