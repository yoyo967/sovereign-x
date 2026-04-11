import { create } from 'zustand';

export interface Transaction {
  id: string;
  date: string;
  merchant: string;
  amount: number;
  direction: 'in' | 'out';
  category?: string;
  source?: string;
}

export interface FinanceAlert {
  id: string;
  type: 'UNUSUAL_ACTIVITY' | 'DUPLICATE_PAYMENT' | 'PRICE_INCREASE' | 'SAVINGS_OPPORTUNITY' | 'NEW_SUBSCRIPTION';
  title: string;
  description: string;
  amount?: number;
  confidence: number;
  createdAt: string;
}

export interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
}

export interface FinanceSummary {
  netCashflowEur: number;
  totalIncomeEur: number;
  totalExpensesEur: number;
  savingsYtdEur: number;
  wealthScore?: number;
  topCategories: { category: string; amount: number }[];
  monthlyData: MonthlyData[];
}

interface FinanceStore {
  summary: FinanceSummary | null;
  transactions: Transaction[];
  alerts: FinanceAlert[];
  page: number;
  isLoading: boolean;
  error: string | null;

  setSummary: (summary: FinanceSummary) => void;
  setTransactions: (txs: Transaction[]) => void;
  setAlerts: (alerts: FinanceAlert[]) => void;
  setPage: (page: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useFinanceStore = create<FinanceStore>((set) => ({
  summary: null,
  transactions: [],
  alerts: [],
  page: 1,
  isLoading: false,
  error: null,

  setSummary: (summary) => set({ summary }),
  setTransactions: (transactions) => set({ transactions }),
  setAlerts: (alerts) => set({ alerts }),
  setPage: (page) => set({ page }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
