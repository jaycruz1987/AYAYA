import { Router } from 'express';
import { BEndHotelController } from '../../controllers/b-end/hotel.controller';
import { requireHotelAuth } from '../../middlewares/tenant-auth.middleware';

const router = Router();
const controller = new BEndHotelController();

// Apply strict tenant isolation middleware to ALL routes in this file
router.use(requireHotelAuth);

// Profile
router.get('/profile', controller.getMyProfile);
router.patch('/profile', controller.updateMyProfile);

// Room Types
router.get('/room-types', controller.getMyRoomTypes);
router.post('/room-types', controller.createRoomType);
router.patch('/room-types/:id', controller.updateRoomType);
router.delete('/room-types/:id', controller.deleteRoomType);

// Service Requests (Hotel's view of bookings/requests)
router.get('/service-requests', controller.getMyServiceRequests);
router.get('/service-requests/:id', controller.getServiceRequestById);
router.patch('/service-requests/:id/notes', controller.updateNotes);

export const bEndHotelRoutes = router;
