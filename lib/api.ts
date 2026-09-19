// ============================================================================
// JahitFlow Centralized API Client
// ============================================================================

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export function getAuthToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("jahitflow_token");
  }
  return null;
}

export function setAuthToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("jahitflow_token", token);
  }
}

export function clearAuthSession() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("jahitflow_token");
    localStorage.removeItem("jahitflow_user");
  }
}

export function getAuthUser() {
  if (typeof window !== "undefined") {
    const userStr = localStorage.getItem("jahitflow_user");
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
  }
  return null;
}

export async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (error: any) {
    console.error(`API Error [${endpoint}]:`, error.message);
    throw error;
  }
}

// ----------------------------------------------------------------------------
// API SERVICE MODULES
// ----------------------------------------------------------------------------

export const api = {
  // Auth
  auth: {
    login: (body: any) => apiFetch("/auth/login", { method: "POST", body: JSON.stringify(body) }),
    register: (body: any) => apiFetch("/auth/register", { method: "POST", body: JSON.stringify(body) }),
    getProfile: () => apiFetch("/auth/me"),
  },

  // Customers
  customers: {
    getAll: (search?: string) =>
      apiFetch(`/customers${search ? `?search=${encodeURIComponent(search)}` : ""}`),
    getOne: (id: string) => apiFetch(`/customers/${id}`),
    create: (body: any) =>
      apiFetch("/customers", { method: "POST", body: JSON.stringify(body) }),
    update: (id: string, body: any) =>
      apiFetch(`/customers/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
    delete: (id: string) =>
      apiFetch(`/customers/${id}`, { method: "DELETE" }),
  },

  // Orders
  orders: {
    getAll: (status?: string, search?: string) => {
      const params = new URLSearchParams();
      if (status && status !== "Semua") params.append("status", status);
      if (search) params.append("search", search);
      const q = params.toString();
      return apiFetch(`/orders${q ? `?${q}` : ""}`);
    },
    getOne: (id: string) => apiFetch(`/orders/${id}`),
    create: (body: any) =>
      apiFetch("/orders", { method: "POST", body: JSON.stringify(body) }),
    update: (id: string, body: any) =>
      apiFetch(`/orders/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
    updateStatus: (id: string, status: string) =>
      apiFetch(`/orders/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }),
    delete: (id: string) =>
      apiFetch(`/orders/${id}`, { method: "DELETE" }),
    track: (code: string) =>
      apiFetch(`/orders/track/${encodeURIComponent(code.trim())}`),
  },

  // Payments
  payments: {
    getAll: (status?: string, search?: string) => {
      const params = new URLSearchParams();
      if (status && status !== "Semua") params.append("status", status);
      if (search) params.append("search", search);
      const q = params.toString();
      return apiFetch(`/payments${q ? `?${q}` : ""}`);
    },
    getStats: () => apiFetch("/payments/stats"),
    create: (body: any) =>
      apiFetch("/payments", { method: "POST", body: JSON.stringify(body) }),
    getOne: (id: string) => apiFetch(`/payments/${id}`),
    delete: (id: string) =>
      apiFetch(`/payments/${id}`, { method: "DELETE" }),
  },

  // Reports
  reports: {
    getAnalytics: (period?: string) =>
      apiFetch(`/reports/analytics${period ? `?period=${encodeURIComponent(period)}` : ""}`),
  },

  // Settings & Profile
  settings: {
    get: () => apiFetch("/settings"),
    updateProfile: (body: any) =>
      apiFetch("/settings/profile", { method: "PATCH", body: JSON.stringify(body) }),
    changePassword: (body: any) =>
      apiFetch("/settings/password", { method: "PATCH", body: JSON.stringify(body) }),
  },

  // Dashboard
  dashboard: {
    getSummary: () => apiFetch("/dashboard/summary"),
  },
};
