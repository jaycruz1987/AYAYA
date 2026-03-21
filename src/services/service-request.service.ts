import { ServiceRequest, Prisma } from '@prisma/client';
import { ServiceRequestRepository } from '../repositories/service-request.repository';

export class ServiceRequestService {
  private repository: ServiceRequestRepository;

  constructor() {
    this.repository = new ServiceRequestRepository();
  }

  /**
   * Submit a new service request (e.g. Hotel Booking, Flight Inquiry)
   */
  async submitRequest(data: {
    type: string;
    requestChannel?: string;
    submittedByType?: string;
    userId?: string;
    city?: string;
    priority?: string;
    hotelId?: string;
    roomTypeId?: string;
    contactName: string;
    contactPhone: string;
    requestData: any; // JSONB content
  }): Promise<ServiceRequest> {
    
    // Generate unique reference number (e.g. SR-20231015-XXXX)
    const referenceNo = `SR-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(Math.random() * 10000)}`;

    const createData: Prisma.ServiceRequestCreateInput = {
      referenceNo,
      type: data.type,
      requestChannel: data.requestChannel ?? null,
      submittedByType: data.submittedByType ?? null,
      city: data.city ?? null,
      priority: data.priority || 'NORMAL',
      contactName: data.contactName,
      contactPhone: data.contactPhone,
      requestData: data.requestData,
      status: 'PENDING', // Default CRM contract status
    };

    // Connect optional relations
    if (data.userId) {
      createData.user = { connect: { id: data.userId } };
    }
    if (data.hotelId) {
      createData.hotel = { connect: { id: data.hotelId } };
    }
    if (data.roomTypeId) {
      createData.roomType = { connect: { id: data.roomTypeId } };
    }

    return this.repository.create(createData);
  }

  /**
   * Admin updates request status (CRM loop)
   */
  async updateStatus(
    id: string, 
    status: 'PENDING' | 'PROCESSING' | 'RESOLVED' | 'CLOSED', 
    adminId: string, 
    notes?: string
  ): Promise<ServiceRequest> {
    
    const updateData: Prisma.ServiceRequestUpdateInput = {
      status,
      assignedAdmin: { connect: { id: adminId } },
      adminNotes: notes ?? null
    };

    // Auto-fill processing and closing timestamps based on status
    if (status === 'PROCESSING') {
      updateData.processedAt = new Date();
    } else if (status === 'RESOLVED' || status === 'CLOSED') {
      updateData.closedAt = new Date();
    }

    return this.repository.update(id, updateData);
  }
}