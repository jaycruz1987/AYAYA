import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../../middlewares/error.middleware';

const prisma = new PrismaClient();

export class ClientOrderController {
  
  public createOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id; // from requireAuth middleware
      if (!userId) {
        throw new AppError('Unauthorized', 401);
      }

      const { merchantId, items, deliveryAddressSnapshot, deliveryFee = 5 } = req.body; // Default delivery fee for now if not provided, or could be calculated based on distance

      // 1. Verify merchant exists
      const merchant = await prisma.merchant.findUnique({
        where: { id: merchantId }
      });
      if (!merchant) throw new AppError('Merchant not found', 404);

      // 2. Fetch real products from database to calculate trusted prices
      const productIds = items.map((item: any) => item.productId);
      const products = await prisma.product.findMany({
        where: {
          id: { in: productIds },
          merchantId: merchantId // Ensure products belong to this merchant
        }
      });

      if (products.length !== productIds.length) {
        throw new AppError('One or more products are invalid or not available', 400);
      }

      // Create a map for quick lookup
      const productMap = new Map(products.map(p => [p.id, p]));

      // 3. Calculate total server side using DB prices
      let calculatedSubtotal = 0;
      const orderItemsData = items.map((item: any) => {
        const product = productMap.get(item.productId);
        if (!product) throw new AppError(`Product ${item.productId} not found`, 400);
        
        const price = Number(product.price);
        const quantity = Number(item.quantity) || 1;
        calculatedSubtotal += (price * quantity);
        
        return {
          productId: item.productId,
          productName: product.name,
          quantity: quantity,
          unitPrice: price,
          totalPrice: price * quantity
        };
      });

      const calculatedTotal = calculatedSubtotal + Number(deliveryFee);

      // 4. Create the order
      const orderNo = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      const newOrder = await prisma.order.create({
        data: {
          orderNo,
          userId,
          merchantId,
          orderStatus: 'PENDING',
          paymentStatus: 'PENDING',
          fulfillmentStatus: 'PENDING',
          totalAmount: calculatedTotal,
          deliveryAddressSnapshot,
          orderItems: {
            create: orderItemsData
          }
        },
        include: {
          merchant: true,
          orderItems: {
            include: {
              product: true
            }
          }
        }
      });

      res.status(201).json({
        success: true,
        data: newOrder
      });

    } catch (error) {
      next(error);
    }
  };

  public getMyOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) throw new AppError('Unauthorized', 401);

      const orders = await prisma.order.findMany({
        where: { userId, deletedAt: null },
        include: {
          merchant: {
            select: { name: true, logoUrl: true, coverImageUrl: true }
          },
          orderItems: {
            include: {
              product: {
                select: { name: true }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      // format the response to match the expected frontend structure
      const formattedOrders = orders.map(order => ({
        ...order,
        items: order.orderItems // map orderItems to items for the frontend
      }));

      res.status(200).json({
        success: true,
        data: formattedOrders
      });
    } catch (error) {
      next(error);
    }
  };

  public getOrderById = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      const orderId = req.params.id;

      if (!userId) throw new AppError('Unauthorized', 401);

      const order = await prisma.order.findFirst({
        where: { id: orderId, userId, deletedAt: null },
        include: {
          merchant: true,
          orderItems: {
            include: {
              product: true
            }
          }
        }
      });

      if (!order) throw new AppError('Order not found', 404);

      const formattedOrder = {
        ...order,
        items: (order as any).orderItems
      };

      res.status(200).json({
        success: true,
        data: formattedOrder
      });
    } catch (error) {
      next(error);
    }
  };

  public cancelOrder = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      const orderId = req.params.id;

      if (!userId) throw new AppError('Unauthorized', 401);

      const order = await prisma.order.findFirst({
        where: { id: orderId, userId, deletedAt: null }
      });

      if (!order) throw new AppError('Order not found', 404);

      if (order.orderStatus !== 'PENDING') {
        throw new AppError('Can only cancel PENDING orders', 400);
      }

      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: { orderStatus: 'CANCELLED' }
      });

      res.status(200).json({
        success: true,
        data: updatedOrder
      });
    } catch (error) {
      next(error);
    }
  };
}

export const clientOrderController = new ClientOrderController();
