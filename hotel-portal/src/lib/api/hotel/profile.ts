import api from '../axios';
import { Hotel } from '@/types/hotel';

export const hotelApi = {
  getProfile: () => api.get<{ success: boolean; data: Hotel }>('/b-end/hotel/profile'),
  updateProfile: (data: Partial<Hotel>) => api.patch<{ success: boolean; data: Hotel }>('/b-end/hotel/profile', data),
};
