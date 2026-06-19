import api from '../axios';
import { Merchant } from '@/types/merchant';

export const clientMerchantsApi = {
  getAll: (categoryId?: string) => {
    // Temporarily point to the general merchants API until a specific c-end endpoint is created
    const url = categoryId ? `/merchants?categoryId=${categoryId}` : '/merchants';
    return api.get<{ success: boolean; data: Merchant[] }>(url);
  },
  getById: (id: string) => api.get<{ success: boolean; data: Merchant }>(`/merchants/${id}`),
};
