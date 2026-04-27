import { USE_MOCK } from '../config/mock';
import { ALL_MOCK_USERS, MOCK_TOKEN } from '../config/mockData';
import type { AuthResponse, LoginPayload } from '../types';

// ─── API Base ───────────────────────────────────────────────

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// ─── Mock Data ──────────────────────────────────────────────

const MOCK_USERS = ALL_MOCK_USERS;

// ─── Storage Keys ───────────────────────────────────────────

const TOKEN_KEY = 'heliflow_token';
const USER_KEY = 'heliflow_user';
const ROLES_KEY = 'heliflow_roles';

// ─── Mock Implementations ───────────────────────────────────

async function mockLogin(payload: LoginPayload): Promise<AuthResponse> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const user = MOCK_USERS.find(
    (u) => u.username === payload.username && u.password === payload.password
  );

  if (!user) {
    throw new Error('Invalid username or password');
  }

  if (!user.isActive) {
    throw new Error('Account is deactivated. Contact your administrator.');
  }

  const { password: _, roles, ...userData } = user;

  return {
    user: userData,
    token: MOCK_TOKEN,
    roles,
  };
}

async function mockGetCurrentUser(): Promise<AuthResponse | null> {
  const token = localStorage.getItem(TOKEN_KEY);
  const userStr = localStorage.getItem(USER_KEY);
  const rolesStr = localStorage.getItem(ROLES_KEY);

  if (!token || !userStr) return null;

  try {
    return {
      user: JSON.parse(userStr),
      token,
      roles: rolesStr ? JSON.parse(rolesStr) : [],
    };
  } catch {
    return null;
  }
}

// ─── Real API Implementations ───────────────────────────────

async function apiLogin(payload: LoginPayload): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Login failed' }));
    throw new Error(error.message || 'Login failed');
  }

  return res.json();
}

async function apiGetCurrentUser(): Promise<AuthResponse | null> {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return null;

  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) return null;
  return res.json();
}

// ─── Shared Helpers ─────────────────────────────────────────

function saveSession(data: AuthResponse): void {
  localStorage.setItem(TOKEN_KEY, data.token);
  localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  localStorage.setItem(ROLES_KEY, JSON.stringify(data.roles));
}

function clearSession(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(ROLES_KEY);
}

function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

// ─── Exported Service ───────────────────────────────────────

export const authService = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const data = USE_MOCK ? await mockLogin(payload) : await apiLogin(payload);
    saveSession(data);
    return data;
  },

  logout: async (): Promise<void> => {
    if (!USE_MOCK) {
      const token = getToken();
      if (token) {
        await fetch(`${API_BASE}/auth/logout`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        }).catch(() => {});
      }
    }
    clearSession();
  },

  getCurrentUser: USE_MOCK ? mockGetCurrentUser : apiGetCurrentUser,

  getToken,

  isAuthenticated: (): boolean => {
    return !!getToken();
  },

  saveSession,
  clearSession,
};
