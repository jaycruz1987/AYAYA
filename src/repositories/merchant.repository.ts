import { Merchant, Prisma } from '@prisma/client';
import { prisma } from '../config/database';
import { IBaseRepository } from './base.repository';

export class MerchantRepository implements IBaseRepository<Merchant, Prisma.MerchantCreateInput, Prisma.MerchantUpdateInput> {
  async findById(id: string): Promise<Merchant | null> {
    return prisma.merchant.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });
  }

  async findAll(filter?: Prisma.MerchantWhereInput): Promise<Merchant[]> {
    return prisma.merchant.findMany({
      where: {
        ...filter,
        deletedAt: null, // Global soft delete filter
      },
      include: {
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: Prisma.MerchantCreateInput): Promise<Merchant> {
    return prisma.merchant.create({
      data,
    });
  }

  async update(id: string, data: Prisma.MerchantUpdateInput): Promise<Merchant> {
    return prisma.merchant.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<boolean> {
    await prisma.merchant.update({
      where: { id },
      data: { deletedAt: new Date(), status: 'SUSPENDED' },
    });
    return true;
  }
}