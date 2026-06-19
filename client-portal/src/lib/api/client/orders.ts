import api from '../axios';
import { Order } from '@/types/order';

export const clientOrdersApi = {
  getAll: (filters?: Record<string, any>) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value as string);
      });
    }
    const queryString = params.toString();
    const url = queryString ? `/c-end/orders?${queryString}` : '/c-end/orders';
    return api.get<{ success: boolean; data: Order[] }>(url);
  },
  
  getById: (id: string) => api.get<{ success: boolean; data: Order }>(`/c-end/orders/${id}`),
  
  create: (data: any) => api.post<{ success: boolean; data: Order }>('/c-end/orders', data),
  
  cancel: (id: string) => api.post<{ success: boolean; data: Order }>(`/c-end/orders/${id}/cancel`),
};
