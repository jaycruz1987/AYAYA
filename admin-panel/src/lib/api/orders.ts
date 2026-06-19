import api from './axios';
import { Order } from '@/types/order';

export interface PaginatedResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const getOrders = async (filters?: Record<string, string>): Promise<PaginatedResponse<Order[]>> => {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
  }
  return api.get(`/orders?${params.toString()}`);
};

export const getOrderById = async (id: string): Promise<{ success: boolean; data: Order }> => {
  return api.get(`/orders/${id}`);
};

export const performOrderAction = async (id: string, action: string): Promise<{ success: boolean; data: Order }> => {
  return api.post(`/orders/${id}/${action}`);
};
