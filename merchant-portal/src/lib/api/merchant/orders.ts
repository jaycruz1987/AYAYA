import api from '../axios';
import { Order } from '@/types/order';

export const merchantOrdersApi = {
  getAll: (filters?: Record<string, any>) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value as string);
      });
    }
    const queryString = params.toString();
    const url = queryString ? `/b-end/merchant/orders?${queryString}` : '/b-end/merchant/orders';
    return api.get<{ success: boolean; data: Order[] }>(url);
  },
  
  getById: (id: string) => api.get<{ success: boolean; data: Order }>(`/b-end/merchant/orders/${id}`),
  
  performAction: (id: string, action: string) => 
    api.post<{ success: boolean; data: Order }>(`/b-end/merchant/orders/${id}/${action}`),
};
