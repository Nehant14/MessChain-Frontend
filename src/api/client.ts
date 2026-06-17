import { readStoredSession } from '../utils/storage';

export const apiDelay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:3000';

const getAuthHeaders = async () => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const session = await readStoredSession();
  if (session?.token) {
    headers.Authorization = `Bearer ${session.token}`;
  }

  return headers;
};

const parseResponse = async <T>(response: Response): Promise<T> => {
  const text = await response.text();
  if (!text) {
    return undefined as T;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    return text as unknown as T;
  }
};

export const baseClient = {
  get: async <T>(url: string): Promise<T> => {
    const response = await fetch(`${BACKEND_URL}${url}`, {
      method: 'GET',
      headers: await getAuthHeaders(),
    });

    if (!response.ok) {
      const errBody = await parseResponse<{ error?: string; message?: string }>(response);
      throw new Error(errBody?.error || errBody?.message || `GET request to ${url} failed.`);
    }

    return parseResponse<T>(response);
  },

  post: async <T>(url: string, data?: unknown): Promise<T> => {
    const response = await fetch(`${BACKEND_URL}${url}`, {
      method: 'POST',
      headers: await getAuthHeaders(),
      body: data === undefined ? undefined : JSON.stringify(data),
    });

    if (!response.ok) {
      const errBody = await parseResponse<{ error?: string; message?: string }>(response);
      throw new Error(errBody?.error || errBody?.message || `POST request to ${url} failed.`);
    }

    return parseResponse<T>(response);
  },
};