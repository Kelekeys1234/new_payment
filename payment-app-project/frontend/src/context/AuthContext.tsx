import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { authService } from "../services/authService";
import { clearStoredAuth, getStoredAuth, setStoredAuth } from "../services/authStorage";
import type {
  ActivateAccountRequest,
  AuthResponse,
  AuthUser,
  LoginRequest,
} from "../types/Auth";

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (request: LoginRequest) => Promise<AuthUser>;
  activate: (request: ActivateAccountRequest) => Promise<AuthUser>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function applyAuthResponse(response: AuthResponse): AuthUser {
  setStoredAuth(response.token, response.user);
  return response.user;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => getStoredAuth()?.user ?? null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = getStoredAuth();
    if (!stored) {
      setLoading(false);
      return;
    }
    authService
      .me()
      .then((freshUser) => {
        setStoredAuth(stored.token, freshUser);
        setUser(freshUser);
      })
      .catch(() => {
        clearStoredAuth();
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  async function login(request: LoginRequest): Promise<AuthUser> {
    const response = await authService.login(request);
    const loggedInUser = applyAuthResponse(response);
    setUser(loggedInUser);
    return loggedInUser;
  }

  async function activate(request: ActivateAccountRequest): Promise<AuthUser> {
    const response = await authService.activate(request);
    const activatedUser = applyAuthResponse(response);
    setUser(activatedUser);
    return activatedUser;
  }

  function logout() {
    clearStoredAuth();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, activate, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
