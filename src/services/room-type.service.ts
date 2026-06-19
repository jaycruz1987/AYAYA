import { RoomType, Prisma } from '@prisma/client';
import { RoomTypeRepository } from '../repositories/room-type.repository';
import { AppError } from '../middlewares/error.middleware';

export class RoomTypeService {
  private roomTypeRepository: RoomTypeRepository;

  constructor() {
    this.roomTypeRepository = new RoomTypeRepository();
  }

  async getRoomTypesByHotelId(hotelId: string): Promise<RoomType[]> {
    return this.roomTypeRepository.findByHotelId(hotelId);
  }

  async getRoomTypeById(id: string): Promise<RoomType | null> {
    return this.roomTypeRepository.findById(id);
  }

  async createRoomType(hotelId: string, data: Omit<Prisma.RoomTypeCreateInput, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'hotel'>): Promise<RoomType> {
    return this.roomTypeRepository.create(hotelId, data);
  }

  async updateRoomType(hotelId: string, id: string, data: Partial<Prisma.RoomTypeUpdateInput>): Promise<RoomType> {
    const existing = await this.getRoomTypeById(id);
    if (!existing || existing.hotelId !== hotelId) {
      throw new AppError('RoomType not found or access denied', 404);
    }
    return this.roomTypeRepository.update(id, data);
  }

  async deleteRoomType(hotelId: string, id: string): Promise<boolean> {
    const existing = await this.getRoomTypeById(id);
    if (!existing || existing.hotelId !== hotelId) {
      throw new AppError('RoomType not found or access denied', 404);
    }
    return this.roomTypeRepository.delete(id);
  }
}