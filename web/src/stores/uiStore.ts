import { create } from 'zustand';
import type { DegradationMode } from '@/components/ui/DegradationBanner';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

interface UiStore {
  sidebarCollapsed: boolean;
  degradationMode: DegradationMode;
  toasts: Toast[];
  locale: string;

  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
  setDegradationMode: (mode: DegradationMode) => void;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  setLocale: (locale: string) => void;
}

export const useUiStore = create<UiStore>((set) => ({
  sidebarCollapsed: false,
  degradationMode: 'normal',
  toasts: [],
  locale: 'de',

  setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setDegradationMode: (degradationMode) => set({ degradationMode }),
  addToast: (toast) => set((s) => ({
    toasts: [...s.toasts, { ...toast, id: crypto.randomUUID() }],
  })),
  removeToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
  setLocale: (locale) => set({ locale }),
}));
