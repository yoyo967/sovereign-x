import { auth } from './firebase';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

async function getAuthHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Guard for build-time or missing Firebase initialization
  if (!auth) {
    return headers;
  }

  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
}

export const api = {
  // ═══════════════════════════════════════════
  // PUBLIC
  // ═══════════════════════════════════════════
  public: {
    getStats: () => fetch(`${API_BASE_URL}/v2/public/stats`).then(r => r.json()),
    getPricing: () => fetch(`${API_BASE_URL}/v2/public/pricing`).then(r => r.json()),
    health: () => fetch(`${API_BASE_URL}/v2/public/health`).then(r => r.json()),
  },

  // ═══════════════════════════════════════════
  // USER & DASHBOARD
  // ═══════════════════════════════════════════
  user: {
    getProfile: async () => {
      const headers = await getAuthHeaders();
      return fetch(`${API_BASE_URL}/v2/user/profile`, { headers }).then(r => r.json());
    },
    updateProfile: async (data: Record<string, string | number | boolean | null>) => {
      const headers = await getAuthHeaders();
      return fetch(`${API_BASE_URL}/v2/user/profile`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data),
      }).then(r => r.json());
    },
    getDashboard: async () => {
      const headers = await getAuthHeaders();
      return fetch(`${API_BASE_URL}/v2/user/dashboard`, { headers }).then(r => r.json());
    },
    onboard: async (data: Record<string, string | number | boolean | null>) => {
      const headers = await getAuthHeaders();
      return fetch(`${API_BASE_URL}/v2/user/onboard`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      }).then(r => r.json());
    },
    getSettings: async () => {
      const headers = await getAuthHeaders();
      return fetch(`${API_BASE_URL}/v2/user/settings`, { headers }).then(r => r.json());
    },
    updateSettings: async (data: any) => {
      const headers = await getAuthHeaders();
      return fetch(`${API_BASE_URL}/v2/user/settings`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data),
      }).then(r => r.json());
    },
  },

  // ═══════════════════════════════════════════
  // CONTRACTS
  // ═══════════════════════════════════════════
  contracts: {
    list: async (params?: Record<string, string>) => {
      const headers = await getAuthHeaders();
      const query = new URLSearchParams(params).toString();
      return fetch(`${API_BASE_URL}/v2/contracts/?${query}`, { headers }).then(r => r.json());
    },
    get: async (id: string) => {
      const headers = await getAuthHeaders();
      return fetch(`${API_BASE_URL}/v2/contracts/${id}`, { headers }).then(r => r.json());
    },
    create: async (data: Record<string, string | number | boolean | null>) => {
      const headers = await getAuthHeaders();
      return fetch(`${API_BASE_URL}/v2/contracts/`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      }).then(r => r.json());
    },
  },

  // ═══════════════════════════════════════════
  // FINANCE
  // ═══════════════════════════════════════════
  finance: {
    getSummary: async () => {
      const headers = await getAuthHeaders();
      return fetch(`${API_BASE_URL}/v2/finance/summary`, { headers }).then(r => r.json());
    },
    getTransactions: async (limit = 100) => {
      const headers = await getAuthHeaders();
      return fetch(`${API_BASE_URL}/v2/finance/transactions?limit=${limit}`, { headers }).then(r => r.json());
    },
    getInsights: async () => {
      const headers = await getAuthHeaders();
      return fetch(`${API_BASE_URL}/v2/finance/insights`, { headers }).then(r => r.json());
    },
    connectBank: async (redirectUrl: string) => {
      const headers = await getAuthHeaders();
      return fetch(`${API_BASE_URL}/v2/finance/connect-bank`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ redirectUrl }),
      }).then(r => r.json());
    },
  },

  // ═══════════════════════════════════════════
  // CLAIMS
  // ═══════════════════════════════════════════
  claims: {
    list: async () => {
      const headers = await getAuthHeaders();
      return fetch(`${API_BASE_URL}/v2/claims/`, { headers }).then(r => r.json());
    },
    create: async (data: Record<string, string | number | boolean | null>) => {
      const headers = await getAuthHeaders();
      return fetch(`${API_BASE_URL}/v2/claims/`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      }).then(r => r.json());
    },
  },

  // ═══════════════════════════════════════════
  // APPROVALS
  // ═══════════════════════════════════════════
  approvals: {
    list: async (status?: string) => {
      const headers = await getAuthHeaders();
      const url = status ? `${API_BASE_URL}/v2/approvals/?status=${status}` : `${API_BASE_URL}/v2/approvals/`;
      return fetch(url, { headers }).then(r => r.json());
    },
    approve: async (id: string, biometricVerified = false) => {
      const headers = await getAuthHeaders();
      return fetch(`${API_BASE_URL}/v2/approvals/${id}/approve`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ biometric_verified: biometricVerified }),
      }).then(r => r.json());
    },
    reject: async (id: string, reason?: string) => {
      const headers = await getAuthHeaders();
      return fetch(`${API_BASE_URL}/v2/approvals/${id}/reject`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ reason }),
      }).then(r => r.json());
    },
  },

  // 🤖 AI BRAINSTORMER
  ai: {
    brainstorm: async (chunk: string) => {
      const headers = await getAuthHeaders();
      return fetch(`${API_BASE_URL}/v2/ai/brainstorm`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ conversation_chunk: chunk }),
      }).then(r => r.json());
    },
  }
};
