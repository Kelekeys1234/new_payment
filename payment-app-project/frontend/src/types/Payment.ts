export type PaymentType = "BANK_TRANSFER" | "CASH" | "CARD" | "MOBILE_MONEY" | "OTHER";
export type PaymentPurpose = "LOAN" | "DONATION";
export type PaymentFrequency = "ONE_TIME" | "DAILY" | "WEEKLY" | "MONTHLY";
export type PaymentMethod = "DAILY" | "WEEKLY" | "MONTHLY";
export type CurrencyCode = "NGN" | "USD" | "EUR" | "GBP";

export interface Payment {
  id: string;
  userId: number;
  userName: string | null;
  phoneNumber: string | null;
  isVisitor: boolean;
  paymentType: PaymentType;
  paymentMethod: PaymentMethod;
  paymentPurpose: PaymentPurpose;
  paymentFrequency: PaymentFrequency;
  amount: number;
  currency: CurrencyCode;
  createdBy: string;
  created: string; // ISO datetime
}

export interface CreatePaymentRequest {
  createdBy: string;
  phoneNumber: string;
  fullName?: string;
  isVisitor: boolean;
  paymentType: PaymentType;
  paymentMethod: PaymentMethod;
  paymentPurpose: PaymentPurpose;
  paymentFrequency: PaymentFrequency;
  amount: number;
  currency: CurrencyCode;
}

export interface UpdatePaymentRequest {
  createdBy: string;
  isVisitor: boolean;
  paymentType: PaymentType;
  paymentMethod: PaymentMethod;
  paymentPurpose: PaymentPurpose;
  paymentFrequency: PaymentFrequency;
  amount: number;
  currency: CurrencyCode;
}

export const PAYMENT_TYPE_LABELS: Record<PaymentType, string> = {
  BANK_TRANSFER: "Bank Transfer",
  CASH: "Cash",
  CARD: "Card",
  MOBILE_MONEY: "Mobile Money",
  OTHER: "Other",
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  DAILY: "Daily",
  WEEKLY: "Weekly",
  MONTHLY: "Monthly",
};

export const PAYMENT_FREQUENCY_LABELS: Record<PaymentFrequency, string> = {
  ONE_TIME: "One-time",
  DAILY: "Daily",
  WEEKLY: "Weekly",
  MONTHLY: "Monthly",
};

export const CURRENCY_LABELS: Record<CurrencyCode, string> = {
  NGN: "NGN - Nigerian Naira",
  USD: "USD - US Dollar",
  EUR: "EUR - Euro",
  GBP: "GBP - British Pound",
};

export const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  NGN: "₦",
  USD: "$",
  EUR: "€",
  GBP: "£",
};
