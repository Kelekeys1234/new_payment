import { api } from "./api";
import type {
  ActivateAccountRequest,
  AuthResponse,
  AuthStatus,
  AuthUser,
  LoginRequest,
} from "../types/Auth";

export const authService = {
  async status(phone: string): Promise<AuthStatus> {
    const { data } = await api.get<AuthStatus>("/auth/status", { params: { phone } });
    return data;
  },

  async requestOtp(phoneNumber: string): Promise<{ message: string }> {
    const { data } = await api.post<{ message: string }>("/auth/request-otp", { phoneNumber });
    return data;
  },

  async activate(request: ActivateAccountRequest): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>("/auth/activate", request);
    return data;
  },

  async login(request: LoginRequest): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>("/auth/login", request);
    return data;
  },

  async me(): Promise<AuthUser> {
    const { data } = await api.get<AuthUser>("/auth/me");
    return data;
  },

  async grantAdmin(phoneNumber: string): Promise<AuthUser> {
    const { data } = await api.post<AuthUser>("/auth/grant-admin", { phoneNumber });
    return data;
  },
};
