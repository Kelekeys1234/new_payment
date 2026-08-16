export type PaymentType = "BANK_TRANSFER" | "CASH" | "CARD" | "MOBILE_MONEY" | "OTHER";
export type PaymentPurpose = "LOAN" | "DONATION";
export type CurrencyCode = "NGN" | "USD" | "EUR" | "GBP";

export interface Payment {
  id: string;
  userId: number;
  userName: string | null;
  phoneNumber: string | null;
  isVisitor: boolean;
  paymentType: PaymentType;
  paymentPurpose: PaymentPurpose;
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
  paymentPurpose: PaymentPurpose;
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
