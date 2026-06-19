import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOrders, getOrderById, performOrderAction } from '@/lib/api/orders';
import { message } from 'antd';

export const useOrders = (filters?: Record<string, string>) => {
  return useQuery({
    queryKey: ['orders', filters],
    queryFn: () => getOrders(filters),
  });
};

export const useOrder = (id: string) => {
  return useQuery({
    queryKey: ['orders', id],
    queryFn: () => getOrderById(id),
    enabled: !!id,
  });
};

export const usePerformOrderAction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, action }: { id: string; action: string }) => 
      performOrderAction(id, action),
    onSuccess: () => {
      message.success('Order action performed successfully');
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Failed to perform order action');
    },
  });
};
