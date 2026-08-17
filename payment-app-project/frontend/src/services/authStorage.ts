import type { AuthUser } from "../types/Auth";

const STORAGE_KEY = "nbp_auth";

interface StoredAuth {
  token: string;
  user: AuthUser;
}

export function getStoredAuth(): StoredAuth | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredAuth;
  } catch {
    return null;
  }
}

export function getToken(): string | null {
  return getStoredAuth()?.token ?? null;
}

export function setStoredAuth(token: string, user: AuthUser): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user }));
}

export function clearStoredAuth(): void {
  localStorage.removeItem(STORAGE_KEY);
}
