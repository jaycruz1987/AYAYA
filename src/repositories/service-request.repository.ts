import { PrismaClient, ServiceRequest, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export class ServiceRequestRepository {
  async findAll(filters?: {
    status?: string;
    type?: string;
    referenceNo?: string;
    assignedAdminUserId?: string;
    hotelId?: string;
  }): Promise<ServiceRequest[]> {
    const where: Prisma.ServiceRequestWhereInput = {};

    if (filters?.status) where.status = filters.status;
    if (filters?.type) where.type = filters.type;
    if (filters?.assignedAdminUserId) where.assignedAdminUserId = filters.assignedAdminUserId;
    if (filters?.hotelId) where.hotelId = filters.hotelId;
    if (filters?.referenceNo) {
      where.referenceNo = {
        contains: filters.referenceNo,
        mode: 'insensitive'
      };
    }

    return prisma.serviceRequest.findMany({
      where,
      include: {
        hotel: { select: { name: true } },
        roomType: { select: { name: true } },
        assignedAdmin: { select: { name: true, email: true } },
        user: { select: { nickname: true, email: true } }
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string): Promise<ServiceRequest | null> {
    return prisma.serviceRequest.findUnique({
      where: { id },
      include: {
        hotel: true,
        roomType: true,
        assignedAdmin: { select: { id: true, name: true, email: true } },
        user: true
      },
    });
  }

  async update(id: string, data: Prisma.ServiceRequestUpdateInput): Promise<ServiceRequest> {
    return prisma.serviceRequest.update({
      where: { id },
      data,
      include: {
        hotel: { select: { name: true } },
        roomType: { select: { name: true } },
        assignedAdmin: { select: { name: true, email: true } },
        user: { select: { nickname: true, email: true } }
      }
    });
  }
}
