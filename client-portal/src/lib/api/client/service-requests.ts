import api from '../axios';

export const clientServiceRequestsApi = {
  create: (data: any) => api.post<{ success: boolean; data: any }>('/c-end/service-requests', data),
};
