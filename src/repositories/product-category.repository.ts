import { ProductCategory, Prisma } from '@prisma/client';
import { prisma } from '../config/database';
import { IBaseRepository } from './base.repository';

export class ProductCategoryRepository implements IBaseRepository<ProductCategory, Prisma.ProductCategoryCreateInput, Prisma.ProductCategoryUpdateInput> {
  async findById(id: string): Promise<ProductCategory | null> {
    return prisma.productCategory.findUnique({
      where: { id },
    });
  }

  async findAll(filter?: Prisma.ProductCategoryWhereInput): Promise<ProductCategory[]> {
    return prisma.productCategory.findMany({
      where: {
        ...filter,
        deletedAt: null,
      },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async create(data: Prisma.ProductCategoryCreateInput): Promise<ProductCategory> {
    return prisma.productCategory.create({
      data,
    });
  }

  async update(id: string, data: Prisma.ProductCategoryUpdateInput): Promise<ProductCategory> {
    return prisma.productCategory.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<boolean> {
    await prisma.productCategory.update({
      where: { id },
      data: { deletedAt: new Date(), status: 'INACTIVE' },
    });
    return true;
  }
}