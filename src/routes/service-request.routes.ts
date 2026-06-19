import { Router } from 'express';
import { ServiceRequestController } from '../controllers/service-request.controller';
import { requireAdmin } from '../middlewares/auth.middleware';

const router = Router();
const controller = new ServiceRequestController();

// Admin Routes (Protected)
router.get('/', requireAdmin, controller.getAllRequests);
router.get('/:id', requireAdmin, controller.getRequestById);

// Controlled Action Routes
router.post('/:id/assign', requireAdmin, controller.assignAdmin);
router.patch('/:id/notes', requireAdmin, controller.updateNotes);
router.post('/:id/close', requireAdmin, controller.closeRequest);

export const serviceRequestRoutes = router;
