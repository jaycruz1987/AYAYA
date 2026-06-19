export interface ServiceRequest {
  id: string;
  referenceNo: string;
  type: string;
  requestChannel: string | null;
  submittedByType: string | null;
  userId: string | null;
  city: string | null;
  priority: string | null;
  hotelId: string | null;
  roomTypeId: string | null;
  contactName: string;
  contactPhone: string;
  requestData: any;
  status: 'PENDING' | 'PROCESSING' | 'CLOSED' | 'CANCELLED';
  assignedAdminUserId: string | null;
  processedAt: string | null;
  closedAt: string | null;
  adminNotes: string | null;
  createdAt: string;
  updatedAt: string;

  // Relations
  hotel?: { name: string };
  roomType?: { name: string };
  user?: { nickname: string; email: string };
  assignedAdmin?: { name: string; email: string };
}
