import { Product, Prisma } from '@prisma/client';
import { prisma } from '../config/database';
import { IBaseRepository } from './base.repository';

export class ProductRepository {
  async findById(id: string): Promise<Product | null> {
    return prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });
  }

  async findByMerchantId(merchantId: string, filters?: any): Promise<Product[]> {
    const where: Prisma.ProductWhereInput = { merchantId, status: 'ON_SHELF' };
    if (filters?.categoryId) where.categoryId = filters.categoryId;
    
    return prisma.product.findMany({
      where,
      include: {
        category: true,
      },
    });
  }

  async create(merchantId: string, categoryId: string, data: Omit<Prisma.ProductCreateInput, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'merchant' | 'category'>): Promise<Product> {
    return prisma.product.create({
      data: {
        ...data,
        merchant: { connect: { id: merchantId } },
        category: { connect: { id: categoryId } },
        status: data.status || 'ON_SHELF',
        stock: data.stock ?? -1,
      },
      include: {
        merchant: true,
        category: true,
      },
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