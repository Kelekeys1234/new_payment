import type { Payment } from "./Payment";

export type MemberType = "MEMBER" | "WORKER";

export const MEMBER_TYPE_LABELS: Record<MemberType, string> = {
  MEMBER: "Member",
  WORKER: "Worker",
};

export interface User {
  id: number;
  fullName: string;
  email: string | null;
  phoneNumber: string;
  address: string | null;
  memberType: MemberType | null;
  createdBy: string;
  created: string; // ISO datetime
}

export interface CreateUserRequest {
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  memberType: MemberType;
}

export interface UserPaymentSummary {
  user: User;
  totalPayments: number;
  totalLoans: number;
  totalDonations: number;
  totalAmount: number;
  payments: Payment[];
}
