import type { MemberType } from "./User";

export interface AuthUser {
  id: number;
  fullName: string;
  phoneNumber: string;
  email: string | null;
  memberType: MemberType | null;
  admin: boolean;
  superAdmin: boolean;
}

export interface AuthStatus {
  registered: boolean;
  activated: boolean;
}

export interface LoginRequest {
  phoneNumber: string;
  password: string;
}

export interface RequestOtpRequest {
  phoneNumber: string;
}

export interface ActivateAccountRequest {
  phoneNumber: string;
  otp: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  user: AuthUser;
}
