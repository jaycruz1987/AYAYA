import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientAddressesApi } from '@/lib/api/client/addresses';
import { UserAddress } from '@/types/address';
import { message } from 'antd';

export function useClientAddresses() {
  const queryClient = useQueryClient();

  const addressesQuery = useQuery({
    queryKey: ['clientAddresses'],
    queryFn: async () => {
      const response = await clientAddressesApi.getAll();
      return response.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: clientAddressesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientAddresses'] });
      message.success('Address added');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<UserAddress> }) => 
      clientAddressesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientAddresses'] });
      message.success('Address updated');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: clientAddressesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientAddresses'] });
      message.success('Address deleted');
    },
  });

  return {
    addresses: addressesQuery.data || [],
    isLoading: addressesQuery.isLoading,
    createAddress: createMutation.mutateAsync,
    updateAddress: updateMutation.mutateAsync,
    deleteAddress: deleteMutation.mutateAsync,
  };
}