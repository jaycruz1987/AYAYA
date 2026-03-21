import { RoomType, Prisma } from '@prisma/client';
import { RoomTypeRepository } from '../repositories/room-type.repository';

export class RoomTypeService {
  private repository: RoomTypeRepository;

  constructor() {
    this.repository = new RoomTypeRepository();
  }

  async getRoomTypesByHotelId(hotelId: string): Promise<RoomType[]> {
    return this.repository.findAll({ hotelId, status: 'ACTIVE' });
  }

  async createRoomType(hotelId: string, data: Omit<Prisma.RoomTypeCreateInput, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'hotel'>): Promise<RoomType> {
    return this.repository.create({
      ...data,
      hotel: { connect: { id: hotelId } },
      status: data.status || 'ACTIVE',
    });
  }

  async updateRoomType(id: string, data: Partial<Prisma.RoomTypeUpdateInput>): Promise<RoomType> {
    return this.repository.update(id, data);
  }

  async deleteRoomType(id: string): Promise<boolean> {
    return this.repository.delete(id);
  }
}