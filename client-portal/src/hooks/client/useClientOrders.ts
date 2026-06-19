import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientOrdersApi } from '@/lib/api/client/orders';
import { message } from 'antd';
import { useRouter } from 'next/navigation';

export function useClientOrders(filters?: Record<string, any>) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const ordersQuery = useQuery({
    queryKey: ['clientOrders', filters],
    queryFn: async () => {
      const response = await clientOrdersApi.getAll(filters);
      return response.data;
    },
  });

  const createOrderMutation = useMutation({
    mutationFn: clientOrdersApi.create,
    onSuccess: (response: any) => {
      queryClient.invalidateQueries({ queryKey: ['clientOrders'] });
      message.success('Order placed successfully!');
      router.push(`/orders/${response.data?.id || response.id}`);
    },
    onError: (error: any) => {
      message.error(error.message || 'Failed to place order');
    },
  });

  return {
    orders: ordersQuery.data || [],
    isLoading: ordersQuery.isLoading,
    createOrder: createOrderMutation.mutateAsync,
    isCreating: createOrderMutation.isPending,
  };
}

export function useClientOrderDetails(id?: string) {
  return useQuery({
    queryKey: ['clientOrder', id],
    queryFn: async () => {
      if (!id) return null;
      const response = await clientOrdersApi.getById(id);
      return response.data;
    },
    enabled: !!id,
  });
}