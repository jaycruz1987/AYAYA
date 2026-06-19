import { useQuery } from '@tanstack/react-query';
import { clientMerchantsApi } from '@/lib/api/client/merchants';

export function useClientMerchants(categoryId?: string) {
  return useQuery({
    queryKey: ['clientMerchants', categoryId],
    queryFn: async () => {
      const response = await clientMerchantsApi.getAll(categoryId);
      return response.data;
    },
  });
}

export function useClientMerchantDetails(id: string) {
  return useQuery({
    queryKey: ['clientMerchantDetails', id],
    queryFn: async () => {
      const response = await clientMerchantsApi.getById(id);
      return response.data;
    },
    enabled: !!id,
  });
}