import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';
import { requireAdmin } from '../middlewares/auth.middleware';

const router = Router();
const orderController = new OrderController();

// Admin Routes (Protected)
router.get('/', requireAdmin, orderController.getAllOrders);
router.get('/:id', requireAdmin, orderController.getOrderById);
router.post('/:id/:action', requireAdmin, orderController.performOrderAction);

export const orderRoutes = router;
