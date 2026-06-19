import { useMutation, useQueryClient } from '@tanstack/react-query';
import { clientServiceRequestsApi } from '@/lib/api/client/service-requests';
import { message } from 'antd';
import { useRouter } from 'next/navigation';

export function useClientCreateServiceRequest() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const createMutation = useMutation({
    mutationFn: clientServiceRequestsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientServiceRequests'] });
      message.success('Booking request sent successfully!');
      router.push('/profile'); // Redirect to profile or a specific requests page later
    },
    onError: (error: any) => {
      message.error(error.message || 'Failed to send request');
    },
  });

  return {
    createRequest: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
  };
}