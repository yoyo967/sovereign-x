import { create } from 'zustand';

export interface TerminalMessage {
  id: string;
  role: 'user' | 'senate';
  content: string;
  confidence?: number;
  riskClass?: 'HIGH' | 'LIMITED' | 'MINIMAL';
  uncertainty_label?: string;
  disclaimer?: string;
  timestamp: string;
}

export interface BoundaryConditions {
  maxOutputEur: number;
  autoApproveThresholdEur: number;
  biometricForHighRisk: boolean;
  strictPrivacyFilter: boolean;
  confidenceThreshold: number;
}

const DEFAULT_BOUNDARIES: BoundaryConditions = {
  maxOutputEur: 500,
  autoApproveThresholdEur: 50,
  biometricForHighRisk: true,
  strictPrivacyFilter: true,
  confidenceThreshold: 0.5,
};

interface TerminalStore {
  messages: TerminalMessage[];
  isStreaming: boolean;
  killSwitchActive: boolean;
  boundaryConditions: BoundaryConditions;
  showBoundaries: boolean;

  addMessage: (msg: TerminalMessage) => void;
  setStreaming: (streaming: boolean) => void;
  setKillSwitch: (active: boolean) => void;
  setBoundaryConditions: (bc: Partial<BoundaryConditions>) => void;
  setShowBoundaries: (show: boolean) => void;
  clearMessages: () => void;
}

export const useTerminalStore = create<TerminalStore>((set) => ({
  messages: [],
  isStreaming: false,
  killSwitchActive: false,
  boundaryConditions: DEFAULT_BOUNDARIES,
  showBoundaries: false,

  addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
  setStreaming: (isStreaming) => set({ isStreaming }),
  setKillSwitch: (killSwitchActive) => set({ killSwitchActive }),
  setBoundaryConditions: (bc) => set((s) => ({ boundaryConditions: { ...s.boundaryConditions, ...bc } })),
  setShowBoundaries: (showBoundaries) => set({ showBoundaries }),
  clearMessages: () => set({ messages: [] }),
}));
