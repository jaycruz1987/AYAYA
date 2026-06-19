import { OrderRepository } from '../repositories/order.repository';
import { Order } from '@prisma/client';

export class OrderService {
  private orderRepository: OrderRepository;

  constructor() {
    this.orderRepository = new OrderRepository();
  }

  async getAllOrders(filters?: {
    orderStatus?: string;
    paymentStatus?: string;
    fulfillmentStatus?: string;
    merchantId?: string;
    orderNo?: string;
  }): Promise<Order[]> {
    return this.orderRepository.findAll(filters);
  }

  async getOrderById(id: string): Promise<Order | null> {
    return this.orderRepository.findById(id);
  }

  // Helper method to ensure strict state transitions
  async performOrderAction(id: string, action: string): Promise<Order> {
    const order = await this.getOrderById(id);
    if (!order) {
      throw new Error('Order not found');
    }

    const updates: { orderStatus?: string; paymentStatus?: string; fulfillmentStatus?: string } = {};

    switch (action) {
      case 'confirm':
        if (order.orderStatus !== 'PENDING') throw new Error('Order must be PENDING to confirm');
        updates.orderStatus = 'ACCEPTED';
        break;
      case 'start-preparing':
        if (order.orderStatus !== 'ACCEPTED') throw new Error('Order must be ACCEPTED to prepare');
        updates.fulfillmentStatus = 'PROCESSING';
        break;
      case 'start-delivery':
        if (order.fulfillmentStatus !== 'PROCESSING') throw new Error('Order must be PROCESSING to deliver');
        updates.fulfillmentStatus = 'DELIVERING';
        break;
      case 'complete':
        if (order.fulfillmentStatus !== 'DELIVERING') throw new Error('Order must be DELIVERING to complete');
        updates.orderStatus = 'COMPLETED';
        updates.fulfillmentStatus = 'COMPLETED';
        break;
      case 'cancel':
        if (order.orderStatus === 'COMPLETED' || order.orderStatus === 'CANCELLED') {
          throw new Error('Cannot cancel a completed or already cancelled order');
        }
        updates.orderStatus = 'CANCELLED';
        break;
      case 'mark-paid':
        if (order.paymentStatus === 'PAID') throw new Error('Order is already paid');
        updates.paymentStatus = 'PAID';
        break;
      default:
        throw new Error('Invalid order action');
    }

    return this.orderRepository.updateStatus(id, updates);
  }
}
