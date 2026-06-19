import api from '../axios';
import { RoomType } from '@/types/room-type';

export const hotelRoomTypesApi = {
  getAll: () => api.get<{ success: boolean; data: RoomType[] }>('/b-end/hotel/room-types'),
  create: (data: Partial<RoomType>) => api.post<{ success: boolean; data: RoomType }>('/b-end/hotel/room-types', data),
  update: (id: string, data: Partial<RoomType>) => api.patch<{ success: boolean; data: RoomType }>(`/b-end/hotel/room-types/${id}`, data),
  delete: (id: string) => api.delete<{ success: boolean; message: string }>(`/b-end/hotel/room-types/${id}`),
};
