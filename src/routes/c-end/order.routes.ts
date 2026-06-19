import { Router } from 'express';
import { clientOrderController } from '../../controllers/c-end/order.controller';
import { requireAuth } from '../../middlewares/auth.middleware';

const router = Router();

// These routes assume the user is authenticated as a client/consumer
router.post('/', requireAuth, clientOrderController.createOrder);
router.get('/', requireAuth, clientOrderController.getMyOrders);
router.get('/:id', requireAuth, clientOrderController.getOrderById);
router.post('/:id/cancel', requireAuth, clientOrderController.cancelOrder);

export const cEndOrderRoutes = router;
