import api from '../axios';
import { Merchant } from '@/types/merchant';

export const merchantApi = {
  getProfile: () => api.get<{ success: boolean; data: Merchant }>('/b-end/merchant/profile'),
  updateProfile: (data: Partial<Merchant>) => api.patch<{ success: boolean; data: Merchant }>('/b-end/merchant/profile', data),
};
