import { Router } from 'express';
import { clientServiceRequestController } from '../../controllers/c-end/service-request.controller';
import { requireAuth } from '../../middlewares/auth.middleware';

const router = Router();

// Protect all client service request routes
router.use(requireAuth);

router.post('/', clientServiceRequestController.createServiceRequest);
router.get('/', clientServiceRequestController.getMyRequests);

export const cEndServiceRequestRoutes = router;