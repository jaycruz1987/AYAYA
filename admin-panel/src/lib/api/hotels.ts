import api from './axios';
import { Hotel, PaginatedResponse } from '@/types/hotel';

export const getHotels = async (filters?: any): Promise<PaginatedResponse<Hotel[]>> => {
  return api.get('/hotels', { params: filters });
};

export const getHotelById = async (id: string): Promise<{ success: boolean; data: Hotel }> => {
  return api.get(`/hotels/${id}`);
};

export const createHotel = async (data: Partial<Hotel>): Promise<{ success: boolean; data: Hotel }> => {
  return api.post('/hotels', data);
};

export const updateHotel = async (id: string, data: Partial<Hotel>): Promise<{ success: boolean; data: Hotel }> => {
  return api.patch(`/hotels/${id}`, data);
};

export const deleteHotel = async (id: string): Promise<{ success: boolean; message: string }> => {
  return api.delete(`/hotels/${id}`);
};
