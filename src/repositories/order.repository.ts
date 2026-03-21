import { Order, Prisma } from '@prisma/client';
import { prisma } from '../config/database';
import { IBaseRepository } from './base.repository';

export class OrderRepository implements IBaseRepository<Order, Prisma.OrderCreateInput, Prisma.OrderUpdateInput> {
  async findById(id: string): Promise<Order | null> {
    return prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: true,
      },
    });
  }

  async findAll(filter?: Prisma.OrderWhereInput): Promise<Order[]> {
    return prisma.order.findMany({
      where: {
        ...filter,
        deletedAt: null, // Always apply soft delete filter by default
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: Prisma.OrderCreateInput): Promise<Order> {
    return prisma.order.create({
      data,
      include: {
        orderItems: true,
      },
    });
  }

  async update(id: string, data: Prisma.OrderUpdateInput): Promise<Order> {
    return prisma.order.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<boolean> {
    // Soft delete implementation
    await prisma.order.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return true;
  }

  // Domain specific queries
  async findByUserId(userId: string): Promise<Order[]> {
    return this.findAll({ userId });
  }

  async findByMerchantId(merchantId: string): Promise<Order[]> {
    return this.findAll({ merchantId });
  }
}