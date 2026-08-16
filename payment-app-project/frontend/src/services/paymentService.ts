import { api } from "./api";
import type { CreatePaymentRequest, Payment, UpdatePaymentRequest } from "../types/Payment";

export const paymentService = {
  async getAll(): Promise<Payment[]> {
    const { data } = await api.get<Payment[]>("/payments");
    return data;
  },

  async getById(id: string): Promise<Payment> {
    const { data } = await api.get<Payment>(`/payments/${id}`);
    return data;
  },

  async getByUserId(userId: number): Promise<Payment[]> {
    const { data } = await api.get<Payment[]>(`/payments/user/${userId}`);
    return data;
  },

  async search(query: string): Promise<Payment[]> {
    const { data } = await api.get<Payment[]>("/payments/search", { params: { query } });
    return data;
  },

  async create(request: CreatePaymentRequest): Promise<Payment> {
    const { data } = await api.post<Payment>("/payments", request);
    return data;
  },

  async update(id: string, request: UpdatePaymentRequest): Promise<Payment> {
    const { data } = await api.put<Payment>(`/payments/${id}`, request);
    return data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/payments/${id}`);
  },
};
