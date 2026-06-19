import { PrismaClient, Order, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export class OrderRepository {
  async findAll(filters?: {
    orderStatus?: string;
    paymentStatus?: string;
    fulfillmentStatus?: string;
    merchantId?: string;
    orderNo?: string;
  }): Promise<Order[]> {
    const where: Prisma.OrderWhereInput = {
      deletedAt: null,
    };

    if (filters?.orderStatus) where.orderStatus = filters.orderStatus;
    if (filters?.paymentStatus) where.paymentStatus = filters.paymentStatus;
    if (filters?.fulfillmentStatus) where.fulfillmentStatus = filters.fulfillmentStatus;
    if (filters?.merchantId) where.merchantId = filters.merchantId;
    if (filters?.orderNo) {
      where.orderNo = {
        contains: filters.orderNo,
        mode: 'insensitive'
      };
    }

    return prisma.order.findMany({
      where,
      include: {
        merchant: {
          select: { name: true }
        },
        user: {
          select: { nickname: true, email: true, phone: true }
        },
        orderItems: true
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string): Promise<Order | null> {
    return prisma.order.findFirst({
      where: { id, deletedAt: null },
      include: {
        merchant: true,
        user: true,
        orderItems: true
      },
    });
  }

  async updateStatus(
    id: string, 
    data: {
      orderStatus?: string;
      paymentStatus?: string;
      fulfillmentStatus?: string;
    }
  ): Promise<Order> {
    return prisma.order.update({
      where: { id },
      data,
      include: {
        merchant: {
          select: { name: true }
        },
        user: {
          select: { nickname: true, email: true, phone: true }
        },
        orderItems: true
      }
    });
  }
}
