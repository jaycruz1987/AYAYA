import api from '../axios';
import { ServiceRequest } from '@/types/service-request';

export const hotelServiceRequestsApi = {
  getAll: (filters?: Record<string, any>) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value as string);
      });
    }
    const queryString = params.toString();
    const url = queryString ? `/b-end/hotel/service-requests?${queryString}` : '/b-end/hotel/service-requests';
    return api.get<{ success: boolean; data: ServiceRequest[] }>(url);
  },
  
  getById: (id: string) => api.get<{ success: boolean; data: ServiceRequest }>(`/b-end/hotel/service-requests/${id}`),
  
  updateNotes: (id: string, data: { adminNotes: string; status?: string }) => 
    api.patch<{ success: boolean; data: ServiceRequest }>(`/b-end/hotel/service-requests/${id}/notes`, data),
};
