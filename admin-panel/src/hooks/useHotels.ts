import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getHotels, getHotelById, createHotel, updateHotel, deleteHotel } from '@/lib/api/hotels';
import { Hotel } from '@/types/hotel';
import { message } from 'antd';

export const useHotels = (filters?: any) => {
  return useQuery({
    queryKey: ['hotels', filters],
    queryFn: () => getHotels(filters),
  });
};

export const useHotel = (id: string) => {
  return useQuery({
    queryKey: ['hotel', id],
    queryFn: () => getHotelById(id),
    enabled: !!id,
  });
};

export const useCreateHotel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Hotel>) => createHotel(data),
    onSuccess: () => {
      message.success('Hotel created successfully');
      queryClient.invalidateQueries({ queryKey: ['hotels'] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.error?.message || 'Failed to create hotel');
    },
  });
};

export const useUpdateHotel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Hotel> }) => updateHotel(id, data),
    onSuccess: (data, variables) => {
      message.success('Hotel updated successfully');
      queryClient.invalidateQueries({ queryKey: ['hotels'] });
      queryClient.invalidateQueries({ queryKey: ['hotel', variables.id] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.error?.message || 'Failed to update hotel');
    },
  });
};

export const useDeleteHotel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteHotel(id),
    onSuccess: () => {
      message.success('Hotel deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['hotels'] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.error?.message || 'Failed to delete hotel');
    },
  });
};
