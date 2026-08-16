import { api } from "./api";
import type { CreateUserRequest, User, UserPaymentSummary } from "../types/User";

export const userService = {
  async getAll(): Promise<User[]> {
    const { data } = await api.get<User[]>("/users");
    return data;
  },

  async getById(id: number): Promise<User> {
    const { data } = await api.get<User>(`/users/${id}`);
    return data;
  },

  async getSummary(id: number): Promise<UserPaymentSummary> {
    const { data } = await api.get<UserPaymentSummary>(`/users/${id}/summary`);
    return data;
  },

  /**
   * Looks up a user by phone number. Returns null (rather than throwing) when
   * no user has that phone number yet, since "not found" is an expected outcome
   * of this call, not an error condition, in the payment form flow.
   */
  async searchByPhone(phone: string): Promise<User | null> {
    try {
      const { data } = await api.get<User>("/users/search", { params: { phone } });
      return data;
    } catch (error: any) {
      if (error?.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  async create(request: CreateUserRequest): Promise<User> {
    const { data } = await api.post<User>("/users", request);
    return data;
  },
};
