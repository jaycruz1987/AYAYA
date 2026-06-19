import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { merchantOrdersApi } from '@/lib/api/merchant/orders';
import { message } from 'antd';

export function useMerchantOrders(filters?: Record<string, any>) {
  const queryClient = useQueryClient();

  const ordersQuery = useQuery({
    queryKey: ['merchantOrders', filters],
    queryFn: async () => {
      const response = await merchantOrdersApi.getAll(filters);
      return response.data;
    },
  });

  const performActionMutation = useMutation({
    mutationFn: ({ id, action }: { id: string; action: string }) => 
      merchantOrdersApi.performAction(id, action),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['merchantOrders'] });
      message.success('Order action successful');
    },
    onError: (error: any) => {
      message.error(error.message || 'Failed to perform order action');
    },
  });

  return {
    orders: ordersQuery.data || [],
    isLoading: ordersQuery.isLoading,
    performAction: performActionMutation.mutateAsync,
    isActing: performActionMutation.isPending,
  };
}

export function useMerchantOrderDetails(id?: string) {
  return useQuery({
    queryKey: ['merchantOrder', id],
    queryFn: async () => {
      if (!id) return null;
      const response = await merchantOrdersApi.getById(id);
      return response.data;
    },
    enabled: !!id,
  });
}