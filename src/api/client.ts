// Base config for backend communication.
export const apiDelay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// CHANGED: Pull the backend URL from environment configurations
const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:3000';

export const baseClient = {
  get: async <T>(url: string): Promise<T> => {
    // CHANGED: Replaced mock error with live global fetch GET call
    // In production, fetch this token from secure native storage (e.g., Expo SecureStore)
    const mockToken = "YOUR_STORED_JWT_TOKEN"; 

    const response = await fetch(`${BACKEND_URL}${url}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${mockToken}` // CHANGED: Added auth token required by backend middleware
      }
    });

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      throw new Error(errBody.error || `GET request to ${url} failed.`);
    }
    return response.json() as Promise<T>;
  },

  post: async <T>(url: string, data: any): Promise<T> => {
    // CHANGED: Replaced mock error with live global fetch POST call
    const mockToken = "YOUR_STORED_JWT_TOKEN";

    const response = await fetch(`${BACKEND_URL}${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${mockToken}` // CHANGED: Added token tracking for req.user validation
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      throw new Error(errBody.error || `POST request to ${url} failed.`);
    }
    return response.json() as Promise<T>;
  },
};