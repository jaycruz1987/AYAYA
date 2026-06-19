import api from './axios';
import { ServiceRequest } from '@/types/service-request';

export interface PaginatedResponse<T> {
  success: boolean;
  data: T;
}

export const getServiceRequests = async (filters?: Record<string, string>): Promise<PaginatedResponse<ServiceRequest[]>> => {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
  }
  return api.get(`/service-requests?${params.toString()}`);
};

export const getServiceRequestById = async (id: string): Promise<{ success: boolean; data: ServiceRequest }> => {
  return api.get(`/service-requests/${id}`);
};

export const assignAdmin = async (id: string): Promise<{ success: boolean; data: ServiceRequest }> => {
  return api.post(`/service-requests/${id}/assign`);
};

export const updateNotes = async (id: string, adminNotes: string): Promise<{ success: boolean; data: ServiceRequest }> => {
  return api.patch(`/service-requests/${id}/notes`, { adminNotes });
};

export const closeRequest = async (id: string, adminNotes?: string): Promise<{ success: boolean; data: ServiceRequest }> => {
  return api.post(`/service-requests/${id}/close`, { adminNotes });
};
