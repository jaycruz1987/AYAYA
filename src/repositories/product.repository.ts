import { Product, Prisma } from '@prisma/client';
import { prisma } from '../config/database';
import { IBaseRepository } from './base.repository';

export class ProductRepository implements IBaseRepository<Product, Prisma.ProductCreateInput, Prisma.ProductUpdateInput> {
  async findById(id: string): Promise<Product | null> {
    return prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });
  }

  async findAll(filter?: Prisma.ProductWhereInput): Promise<Product[]> {
    return prisma.product.findMany({
      where: {
        ...filter,
        deletedAt: null,
      },
      include: {
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: Prisma.ProductCreateInput): Promise<Product> {
    return prisma.product.create({
      data,
    });
  }

  async update(id: string, data: Prisma.ProductUpdateInput): Promise<Product> {
    return prisma.product.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<boolean> {
    await prisma.product.update({
      where: { id },
      data: { deletedAt: new Date(), status: 'OFF_SHELF' },
    });
    return true;
  }
}