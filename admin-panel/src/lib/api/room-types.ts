import api from './axios';
import { RoomType } from '@/types/room-type';
import { PaginatedResponse } from '@/types/merchant';

export const getRoomTypesByHotel = async (hotelId: string): Promise<PaginatedResponse<RoomType[]>> => {
  return api.get(`/hotels/${hotelId}/room-types`);
};

export const createRoomType = async (hotelId: string, data: Partial<RoomType>): Promise<{ success: boolean; data: RoomType }> => {
  return api.post(`/hotels/${hotelId}/room-types`, data);
};

export const updateRoomType = async (id: string, data: Partial<RoomType>): Promise<{ success: boolean; data: RoomType }> => {
  return api.patch(`/room-types/${id}`, data);
};

export const deleteRoomType = async (id: string): Promise<{ success: boolean; message: string }> => {
  return api.delete(`/room-types/${id}`);
};
