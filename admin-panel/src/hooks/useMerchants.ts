import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMerchants, getMerchantById, createMerchant, updateMerchant, deleteMerchant } from '@/lib/api/merchants';
import { Merchant } from '@/types/merchant';
import { message } from 'antd';

export const useMerchants = (filters?: any) => {
  return useQuery({
    queryKey: ['merchants', filters],
    queryFn: () => getMerchants(filters),
  });
};

export const useMerchant = (id: string) => {
  return useQuery({
    queryKey: ['merchant', id],
    queryFn: () => getMerchantById(id),
    enabled: !!id,
  });
};

export const useCreateMerchant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Merchant>) => createMerchant(data),
    onSuccess: () => {
      message.success('Merchant created successfully');
      queryClient.invalidateQueries({ queryKey: ['merchants'] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.error?.message || 'Failed to create merchant');
    },
  });
};

export const useUpdateMerchant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Merchant> }) => updateMerchant(id, data),
    onSuccess: (data, variables) => {
      message.success('Merchant updated successfully');
      queryClient.invalidateQueries({ queryKey: ['merchants'] });
      queryClient.invalidateQueries({ queryKey: ['merchant', variables.id] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.error?.message || 'Failed to update merchant');
    },
  });
};

export const useDeleteMerchant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMerchant(id),
    onSuccess: () => {
      message.success('Merchant deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['merchants'] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.error?.message || 'Failed to delete merchant');
    },
  });
};
