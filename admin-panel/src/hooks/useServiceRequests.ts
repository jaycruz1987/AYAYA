import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getServiceRequests, 
  getServiceRequestById, 
  assignAdmin, 
  updateNotes, 
  closeRequest 
} from '@/lib/api/service-requests';
import { message } from 'antd';

export const useServiceRequests = (filters?: Record<string, string>) => {
  return useQuery({
    queryKey: ['service-requests', filters],
    queryFn: () => getServiceRequests(filters),
  });
};

export const useServiceRequest = (id: string) => {
  return useQuery({
    queryKey: ['service-requests', id],
    queryFn: () => getServiceRequestById(id),
    enabled: !!id,
  });
};

export const useAssignAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => assignAdmin(id),
    onSuccess: () => {
      message.success('Request assigned to you successfully');
      queryClient.invalidateQueries({ queryKey: ['service-requests'] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Failed to assign request');
    },
  });
};

export const useUpdateNotes = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, adminNotes }: { id: string; adminNotes: string }) => updateNotes(id, adminNotes),
    onSuccess: () => {
      message.success('Notes updated successfully');
      queryClient.invalidateQueries({ queryKey: ['service-requests'] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Failed to update notes');
    },
  });
};

export const useCloseRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, adminNotes }: { id: string; adminNotes?: string }) => closeRequest(id, adminNotes),
    onSuccess: () => {
      message.success('Request closed successfully');
      queryClient.invalidateQueries({ queryKey: ['service-requests'] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Failed to close request');
    },
  });
};
