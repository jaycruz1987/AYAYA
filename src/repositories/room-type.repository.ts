import { RoomType, Prisma } from '@prisma/client';
import { prisma } from '../config/database';
import { IBaseRepository } from './base.repository';

export class RoomTypeRepository implements IBaseRepository<RoomType, Prisma.RoomTypeCreateInput, Prisma.RoomTypeUpdateInput> {
  async findById(id: string): Promise<RoomType | null> {
    return prisma.roomType.findUnique({
      where: { id },
    });
  }

  async findAll(filter?: Prisma.RoomTypeWhereInput): Promise<RoomType[]> {
    return prisma.roomType.findMany({
      where: {
        ...filter,
        deletedAt: null,
      },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async create(data: Prisma.RoomTypeCreateInput): Promise<RoomType> {
    return prisma.roomType.create({
      data,
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