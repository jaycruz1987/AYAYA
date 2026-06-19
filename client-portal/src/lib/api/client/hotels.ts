import api from '../axios';
import { Hotel } from '@/types/hotel';

export const clientHotelsApi = {
  getAll: (filters?: Record<string, any>) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value as string);
      });
    }
    const queryString = params.toString();
    // Use the main /hotels endpoint since /c-end/hotels might not be implemented yet
    const url = queryString ? `/hotels?${queryString}` : '/hotels';
    return api.get<{ success: boolean; data: Hotel[] }>(url);
  },
  getById: (id: string) => api.get<{ success: boolean; data: Hotel }>(`/hotels/${id}`),
};
