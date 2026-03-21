import { Hotel, Prisma } from '@prisma/client';
import { prisma } from '../config/database';
import { IBaseRepository } from './base.repository';

export class HotelRepository implements IBaseRepository<Hotel, Prisma.HotelCreateInput, Prisma.HotelUpdateInput> {
  async findById(id: string): Promise<Hotel | null> {
    return prisma.hotel.findUnique({
      where: { id },
      include: {
        roomTypes: {
          where: { deletedAt: null, status: 'ACTIVE' },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });
  }

  async findAll(filter?: Prisma.HotelWhereInput): Promise<Hotel[]> {
    return prisma.hotel.findMany({
      where: {
        ...filter,
        deletedAt: null, // Global soft delete filter
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: Prisma.HotelCreateInput): Promise<Hotel> {
    return prisma.hotel.create({
      data,
    });
  }

  async update(id: string, data: Prisma.HotelUpdateInput): Promise<Hotel> {
    return prisma.hotel.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<boolean> {
    await prisma.hotel.update({
      where: { id },
      data: { deletedAt: new Date(), status: 'INACTIVE' },
    });
    return true;
  }
}