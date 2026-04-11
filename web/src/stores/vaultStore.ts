import { create } from 'zustand';

export type VaultRole = 'ADMIN' | 'MEMBER' | 'VIEWER';

export interface VaultMember {
  uid: string;
  email: string;
  displayName?: string;
  role: VaultRole;
  joinedAt: string;
}

export interface SharedContract {
  id: string;
  name: string;
  provider: string;
  sharedBy: string;
  sharedAt: string;
  sharedCount: number;
}

export interface PendingInvite {
  id: string;
  email: string;
  role: VaultRole;
  expiresAt: string;
  invitedBy: string;
}

export interface Vault {
  id: string;
  name: string;
  createdAt: string;
  memberCount: number;
}

interface VaultStore {
  vault: Vault | null;
  members: VaultMember[];
  sharedContracts: SharedContract[];
  pendingInvites: PendingInvite[];
  isLoading: boolean;
  error: string | null;

  setVault: (vault: Vault | null) => void;
  setMembers: (members: VaultMember[]) => void;
  setSharedContracts: (contracts: SharedContract[]) => void;
  setPendingInvites: (invites: PendingInvite[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useVaultStore = create<VaultStore>((set) => ({
  vault: null,
  members: [],
  sharedContracts: [],
  pendingInvites: [],
  isLoading: false,
  error: null,

  setVault: (vault) => set({ vault }),
  setMembers: (members) => set({ members }),
  setSharedContracts: (sharedContracts) => set({ sharedContracts }),
  setPendingInvites: (pendingInvites) => set({ pendingInvites }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
