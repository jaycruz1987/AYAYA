import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { hotelServiceRequestsApi } from '@/lib/api/hotel/service-requests';
import { message } from 'antd';

export function useHotelServiceRequests(filters?: Record<string, any>) {
  const queryClient = useQueryClient();

  const requestsQuery = useQuery({
    queryKey: ['hotelServiceRequests', filters],
    queryFn: async () => {
      const response = await hotelServiceRequestsApi.getAll(filters);
      return response.data;
    },
  });

  const updateNotesMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { adminNotes: string; status?: string } }) => 
      hotelServiceRequestsApi.updateNotes(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotelServiceRequests'] });
      message.success('Service request updated successfully');
    },
    onError: (error: any) => {
      message.error(error.message || 'Failed to update service request');
    },
  });

  return {
    requests: requestsQuery.data || [],
    isLoading: requestsQuery.isLoading,
    updateNotes: updateNotesMutation.mutateAsync,
    isUpdating: updateNotesMutation.isPending,
  };
}

export function useHotelServiceRequestDetails(id?: string) {
  return useQuery({
    queryKey: ['hotelServiceRequest', id],
    queryFn: async () => {
      if (!id) return null;
      const response = await hotelServiceRequestsApi.getById(id);
      return response.data;
    },
    enabled: !!id,
  });
}