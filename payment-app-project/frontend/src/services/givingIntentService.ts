import { api } from "./api";

export type GivingIntentStatus = "PENDING" | "CONFIRMED" | "NOT_CONFIRMED";

export interface GivingIntent {
  token: string;
  status: GivingIntentStatus;
}

export const givingIntentService = {
  async create(): Promise<GivingIntent> {
    const { data } = await api.post<GivingIntent>("/giving-intents");
    return data;
  },

  async getStatus(token: string): Promise<GivingIntent> {
    const { data } = await api.get<GivingIntent>(`/giving-intents/${token}/status`);
    return data;
  },
};
