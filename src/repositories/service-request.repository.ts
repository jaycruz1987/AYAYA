import { ServiceRequest, Prisma } from '@prisma/client';
import { prisma } from '../config/database';
import { IBaseRepository } from './base.repository';

export class ServiceRequestRepository implements IBaseRepository<ServiceRequest, Prisma.ServiceRequestCreateInput, Prisma.ServiceRequestUpdateInput> {
  async findById(id: string): Promise<ServiceRequest | null> {
    return prisma.serviceRequest.findUnique({
      where: { id },
    });
  }

  async findAll(filter?: Prisma.ServiceRequestWhereInput): Promise<ServiceRequest[]> {
    return prisma.serviceRequest.findMany({
      where: filter,
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: Prisma.ServiceRequestCreateInput): Promise<ServiceRequest> {
    return prisma.serviceRequest.create({
      data,
    });
  }

  async update(id: string, data: Prisma.ServiceRequestUpdateInput): Promise<ServiceRequest> {
    return prisma.serviceRequest.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<boolean> {
    // CRM Assets NO-DELETE policy
    throw new Error('Service Requests are CRM assets and cannot be deleted. Update status to CLOSED instead.');
  }
}