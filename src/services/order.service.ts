import { Order, Prisma } from '@prisma/client';
import { OrderRepository } from '../repositories/order.repository';
import { prisma } from '../config/database';

export class OrderService {
  private repository: OrderRepository;

  constructor() {
    this.repository = new OrderRepository();
  }

  /**
   * Core logic for creating a new order following MVP rules:
   * 1. Total amount must be calculated from database prices (simulated here for brevity, in real app fetch product prices)
   * 2. Default statuses: PENDING, UNPAID, PENDING
   * 3. Delivery address validation based on orderType
   */
  async createOrder(data: {
    userId: string;
    merchantId: string;
    orderType: string; // DELIVERY, PICKUP, DINE_IN
    paymentMethod: string;
    items: { productId: string; quantity: number }[];
    deliveryAddressSnapshot?: any;
    remarks?: string;
  }): Promise<Order> {
    
    // Rule 1: Validate Delivery Address requirement
    if (data.orderType === 'DELIVERY' && !data.deliveryAddressSnapshot) {
      throw new Error('Delivery address is required for DELIVERY orders');
    }

    // Generate business-friendly order number (e.g. FD20231015-XXXX)
    const orderNo = `FD${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(Math.random() * 10000)}`;

    // Note: In a real implementation, we MUST fetch actual product prices from DB here
    // to calculate the true totalAmount to prevent frontend tampering.
    // For this boilerplate, we assume a calculated total.
    let calculatedTotal = new Prisma.Decimal(0); 

    // We use Prisma transaction to ensure order and items are created together
    return prisma.$transaction(async (tx) => {
      
      // Fetch products to calculate real prices
      let orderItemsData = [];
      for (const item of data.items) {
        const product = await tx.product.findUnique({ where: { id: item.productId } });
        if (!product) throw new Error(`Product ${item.productId} not found`);
        
        const itemTotal = Number(product.price) * item.quantity;
        calculatedTotal = new Prisma.Decimal(Number(calculatedTotal) + itemTotal);

        orderItemsData.push({
          productId: product.id,
          productName: product.name, // Snapshot name
          unitPrice: product.price,  // Snapshot price
          quantity: item.quantity,
          totalPrice: itemTotal
        });
      }

      // Rule 2: Enforce default status constraints
      return tx.order.create({
        data: {
          orderNo,
          user: { connect: { id: data.userId } },
          merchant: { connect: { id: data.merchantId } },
          orderType: data.orderType,
          totalAmount: calculatedTotal,
          
          // Enforced Defaults (Contract)
          orderStatus: 'PENDING',
          paymentStatus: 'UNPAID',
          fulfillmentStatus: 'PENDING',
          
          paymentMethod: data.paymentMethod,
          deliveryAddressSnapshot: data.deliveryAddressSnapshot ?? null,
          remarks: data.remarks ?? null,

          orderItems: {
            create: orderItemsData
          }
        },
        include: {
          orderItems: true
        }
      });
    });
  }

  async getOrderById(id: string): Promise<Order | null> {
    return this.repository.findById(id);
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    return this.repository.findByUserId(userId);
  }
}