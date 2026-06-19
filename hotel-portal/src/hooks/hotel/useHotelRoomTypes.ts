import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { hotelRoomTypesApi } from '@/lib/api/hotel/room-types';
import { RoomType } from '@/types/room-type';
import { message } from 'antd';

export function useHotelRoomTypes() {
  const queryClient = useQueryClient();

  const roomTypesQuery = useQuery({
    queryKey: ['hotelRoomTypes'],
    queryFn: async () => {
      const response = await hotelRoomTypesApi.getAll();
      return response.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: hotelRoomTypesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotelRoomTypes'] });
      message.success('Room type created successfully');
    },
    onError: (error: any) => {
      message.error(error.message || 'Failed to create room type');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<RoomType> }) => 
      hotelRoomTypesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotelRoomTypes'] });
      message.success('Room type updated successfully');
    },
    onError: (error: any) => {
      message.error(error.message || 'Failed to update room type');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: hotelRoomTypesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotelRoomTypes'] });
      message.success('Room type deleted successfully');
    },
    onError: (error: any) => {
      message.error(error.message || 'Failed to delete room type');
    },
  });

  return {
    roomTypes: roomTypesQuery.data || [],
    isLoading: roomTypesQuery.isLoading,
    createRoomType: createMutation.mutateAsync,
    updateRoomType: updateMutation.mutateAsync,
    deleteRoomType: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
  };
}
