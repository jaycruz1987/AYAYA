export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  createdAt: string;
}

export interface Order {
  id: string;
  orderNo: string;
  userId: string;
  merchantId: string;
  orderType: 'DELIVERY' | 'PICKUP' | 'DINE_IN';
  totalAmount: number;
  orderStatus: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED' | 'COMPLETED';
  paymentStatus: 'UNPAID' | 'PAID' | 'REFUNDED';
  fulfillmentStatus: 'PENDING' | 'PROCESSING' | 'READY_FOR_PICKUP' | 'DELIVERING' | 'COMPLETED';
  paymentMethod: string | null;
  deliveryAddressSnapshot: any | null; // JSON
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;

  // Relations
  merchant?: { name: string };
  user?: { name: string; email: string; phone: string | null };
  items?: OrderItem[];
}
