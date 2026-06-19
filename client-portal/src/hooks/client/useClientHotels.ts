import { useQuery } from '@tanstack/react-query';
import { clientHotelsApi } from '@/lib/api/client/hotels';

export function useClientHotels(filters?: Record<string, any>) {
  return useQuery({
    queryKey: ['clientHotels', filters],
    queryFn: async () => {
      const response = await clientHotelsApi.getAll(filters);
      return response.data;
    },
  });
}

export function useClientHotelDetails(id: string) {
  return useQuery({
    queryKey: ['clientHotelDetails', id],
    queryFn: async () => {
      const response = await clientHotelsApi.getById(id);
      return response.data;
    },
    enabled: !!id,
  });
}