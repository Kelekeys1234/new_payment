import axios from "axios";
import { clearStoredAuth, getToken } from "./authStorage";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      clearStoredAuth();
    }
    return Promise.reject(error);
  }
);

/**
 * Shape of the error body returned by the backend's GlobalExceptionHandler.
 */
export interface ApiErrorBody {
  message: string;
  status: number;
  timestamp: string;
  details?: string[];
}

/**
 * Extracts a human-readable message from any error thrown by an api.* call,
 * falling back to a generic message if the response isn't in the expected shape.
 */
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const body = error.response?.data as ApiErrorBody | undefined;
    if (body?.message) {
      return body.message;
    }
    if (error.code === "ERR_NETWORK") {
      return "Could not reach the server. Is the backend running on " + baseURL + "?";
    }
  }
  return "Something went wrong. Please try again.";
}
