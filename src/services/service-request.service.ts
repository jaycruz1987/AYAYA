import { ServiceRequestRepository } from '../repositories/service-request.repository';
import { ServiceRequest } from '@prisma/client';

export class ServiceRequestService {
  private repository: ServiceRequestRepository;

  constructor() {
    this.repository = new ServiceRequestRepository();
  }

  async getAllRequests(filters?: {
    status?: string;
    type?: string;
    referenceNo?: string;
    assignedAdminUserId?: string;
    hotelId?: string;
  }): Promise<ServiceRequest[]> {
    return this.repository.findAll(filters);
  }

  async getRequestById(id: string): Promise<ServiceRequest | null> {
    return this.repository.findById(id);
  }

  async assignAdmin(id: string, adminId: string): Promise<ServiceRequest> {
    const request = await this.getRequestById(id);
    if (!request) throw new Error('Service Request not found');
    if (request.status !== 'PENDING' && request.status !== 'PROCESSING') {
      throw new Error('Can only assign admin to PENDING or PROCESSING requests');
    }

    return this.repository.update(id, {
      assignedAdmin: { connect: { id: adminId } },
      status: request.status === 'PENDING' ? 'PROCESSING' : undefined,
      processedAt: request.processedAt ? undefined : new Date()
    });
  }

  async updateNotes(id: string, adminNotes: string): Promise<ServiceRequest> {
    const request = await this.getRequestById(id);
    if (!request) throw new Error('Service Request not found');

    return this.repository.update(id, {
      adminNotes
    });
  }

  async closeRequest(id: string, adminNotes?: string): Promise<ServiceRequest> {
    const request = await this.getRequestById(id);
    if (!request) throw new Error('Service Request not found');
    if (request.status === 'CLOSED') {
      throw new Error('Request is already closed');
    }

    return this.repository.update(id, {
      status: 'CLOSED',
      closedAt: new Date(),
      adminNotes: adminNotes !== undefined ? adminNotes : request.adminNotes
    });
  }
}
