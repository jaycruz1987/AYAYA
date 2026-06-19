import { ProductCategory, Prisma } from '@prisma/client';
import { prisma } from '../config/database';
import { IBaseRepository } from './base.repository';

export class ProductCategoryRepository {
  async findById(id: string): Promise<ProductCategory | null> {
    return prisma.productCategory.findUnique({
      where: { id },
    });
  }

  async findByMerchantId(merchantId: string): Promise<ProductCategory[]> {
    return prisma.productCategory.findMany({
      where: {
        merchantId,
        deletedAt: null,
      },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async createCategory(merchantId: string, data: Omit<Prisma.ProductCategoryCreateInput, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'merchant'>): Promise<ProductCategory> {
    return prisma.productCategory.create({
      data: {
        ...data,
        merchant: { connect: { id: merchantId } },
        status: data.status || 'ACTIVE'
      },
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