import { create } from 'zustand';
import type { SenateItem } from '@/components/ui/SenateQueueItem';

export interface Tenant {
  id: string;
  name: string;
  plan: string;
  status: string;
  primary_locale: string;
  compliance_profile: string;
  created_at: string | null;
  member_count: number;
  security_score: number | null;
  eu_first_score: number | null;
}

export interface ServiceHealth {
  name: string;
  status: 'healthy' | 'degraded' | 'down';
  latencyMs?: number;
  uptime?: number;
  errorRate?: number;
}

interface AdminStore {
  tenants: Tenant[];
  selectedTenant: Tenant | null;
  senateQueue: SenateItem[];
  health: ServiceHealth[];
  isLoading: boolean;
  error: string | null;

  setTenants: (tenants: Tenant[]) => void;
  setSelectedTenant: (tenant: Tenant | null) => void;
  setSenateQueue: (queue: SenateItem[]) => void;
  setHealth: (health: ServiceHealth[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  updateTenantStatus: (id: string, status: string) => void;
}

export const useAdminStore = create<AdminStore>((set) => ({
  tenants: [],
  selectedTenant: null,
  senateQueue: [],
  health: [],
  isLoading: false,
  error: null,

  setTenants: (tenants) => set({ tenants }),
  setSelectedTenant: (selectedTenant) => set({ selectedTenant }),
  setSenateQueue: (senateQueue) => set({ senateQueue }),
  setHealth: (health) => set({ health }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  updateTenantStatus: (id, status) => set((s) => ({
    tenants: s.tenants.map((t) => t.id === id ? { ...t, status } : t),
  })),
}));
