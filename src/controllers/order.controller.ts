import { Request, Response, NextFunction } from 'express';
import { OrderService } from '../services/order.service';
import { AppError } from '../middlewares/error.middleware';

export class OrderController {
  private orderService: OrderService;

  constructor() {
    this.orderService = new OrderService();
  }

  public getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { orderStatus, paymentStatus, fulfillmentStatus, merchantId, orderNo } = req.query;
      
      const filters = {
        orderStatus: orderStatus as string,
        paymentStatus: paymentStatus as string,
        fulfillmentStatus: fulfillmentStatus as string,
        merchantId: merchantId as string,
        orderNo: orderNo as string,
      };

      const orders = await this.orderService.getAllOrders(filters);

      res.status(200).json({
        success: true,
        data: orders,
      });
    } catch (error) {
      next(error);
    }
  };

  public getOrderById = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const order = await this.orderService.getOrderById(id);

      if (!order) {
        throw new AppError('Order not found', 404);
      }

      res.status(200).json({
        success: true,
        data: order,
      });
    } catch (error) {
      next(error);
    }
  };

  public performOrderAction = async (req: Request<{ id: string, action: string }>, res: Response, next: NextFunction) => {
    try {
      const { id, action } = req.params;
      
      const updatedOrder = await this.orderService.performOrderAction(id, action);

      res.status(200).json({
        success: true,
        data: updatedOrder,
      });
    } catch (error: any) {
      next(new AppError(error.message, 400));
    }
  };
}
