import api from '../axios';
import { UserAddress } from '@/types/address';

export const clientAddressesApi = {
  getAll: () => api.get<{ success: boolean; data: UserAddress[] }>('/c-end/addresses'),
  create: (data: Partial<UserAddress>) => api.post<{ success: boolean; data: UserAddress }>('/c-end/addresses', data),
  update: (id: string, data: Partial<UserAddress>) => api.patch<{ success: boolean; data: UserAddress }>(`/c-end/addresses/${id}`, data),
  delete: (id: string) => api.delete<{ success: boolean; message: string }>(`/c-end/addresses/${id}`),
};
