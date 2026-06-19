import { RoomType, Prisma } from '@prisma/client';
import { prisma } from '../config/database';
import { IBaseRepository } from './base.repository';

export class RoomTypeRepository {
  async findById(id: string): Promise<RoomType | null> {
    return prisma.roomType.findUnique({
      where: { id },
    });
  }

  async findByHotelId(hotelId: string): Promise<RoomType[]> {
    return prisma.roomType.findMany({
      where: {
        hotelId,
        deletedAt: null,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(hotelId: string, data: Omit<Prisma.RoomTypeCreateInput, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'hotel'>): Promise<RoomType> {
    return prisma.roomType.create({
      data: {
        ...data,
        hotel: { connect: { id: hotelId } },
        status: data.status || 'ACTIVE'
      },
      include: {
        hotel: true,
      },
    });
  }

  async update(id: string, data: Prisma.RoomTypeUpdateInput): Promise<RoomType> {
    return prisma.roomType.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<boolean> {
    await prisma.roomType.update({
      where: { id },
      data: { deletedAt: new Date(), status: 'INACTIVE' },
    });
    return true;
  }
}