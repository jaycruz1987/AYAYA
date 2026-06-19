import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getRoomTypesByHotel, 
  createRoomType, 
  updateRoomType, 
  deleteRoomType 
} from '@/lib/api/room-types';
import { RoomType } from '@/types/room-type';
import { message } from 'antd';

export const useRoomTypesByHotel = (hotelId: string) => {
  return useQuery({
    queryKey: ['room-types', hotelId],
    queryFn: () => getRoomTypesByHotel(hotelId),
    enabled: !!hotelId,
  });
};

export const useCreateRoomType = (hotelId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<RoomType>) => createRoomType(hotelId, data),
    onSuccess: () => {
      message.success('Room type created successfully');
      queryClient.invalidateQueries({ queryKey: ['room-types', hotelId] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.error?.message || 'Failed to create room type');
    },
  });
};

export const useUpdateRoomType = (hotelId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<RoomType> }) => updateRoomType(id, data),
    onSuccess: () => {
      message.success('Room type updated successfully');
      queryClient.invalidateQueries({ queryKey: ['room-types', hotelId] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.error?.message || 'Failed to update room type');
    },
  });
};

export const useDeleteRoomType = (hotelId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteRoomType(id),
    onSuccess: () => {
      message.success('Room type deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['room-types', hotelId] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.error?.message || 'Failed to delete room type');
    },
  });
};
