// Base config for backend communication.
// In a production app, this would initialize Axios or fetch instance with headers.

export const apiDelay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const baseClient = {
  get: async <T>(url: string): Promise<T> => {
    await apiDelay(500);
    throw new Error('Not implemented: Using local mock data seeds instead.');
  },
  post: async <T>(url: string, data: any): Promise<T> => {
    await apiDelay(500);
    throw new Error('Not implemented: Using local mock data seeds instead.');
  },
};
