import api from './axios';
import { Merchant, PaginatedResponse } from '@/types/merchant';

export const getMerchants = async (filters?: any): Promise<PaginatedResponse<Merchant[]>> => {
  return api.get('/merchants', { params: filters });
};

export const getMerchantById = async (id: string): Promise<{ success: boolean; data: Merchant }> => {
  return api.get(`/merchants/${id}`);
};

export const createMerchant = async (data: Partial<Merchant>): Promise<{ success: boolean; data: Merchant }> => {
  return api.post('/merchants', data);
};

export const updateMerchant = async (id: string, data: Partial<Merchant>): Promise<{ success: boolean; data: Merchant }> => {
  return api.patch(`/merchants/${id}`, data);
};

export const deleteMerchant = async (id: string): Promise<{ success: boolean; message: string }> => {
  return api.delete(`/merchants/${id}`);
};
