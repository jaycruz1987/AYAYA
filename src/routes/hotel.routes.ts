import { Router } from 'express';
import { HotelController } from '../controllers/hotel.controller';
import { RoomTypeController } from '../controllers/room-type.controller';
import { requireAdmin } from '../middlewares/auth.middleware';

const router = Router();
const hotelController = new HotelController();
const roomTypeController = new RoomTypeController();

// --- Hotel Routes ---
// Public Routes
router.get('/', hotelController.getAllHotels);

// --- Nested Room Type Routes ---
router.get('/:hotelId/room-types', roomTypeController.getByHotel);
router.post('/:hotelId/room-types', roomTypeController.create);

router.get('/:id', hotelController.getHotelById);

// Admin Routes (Protected)
router.post('/', requireAdmin, hotelController.createHotel);
router.patch('/:id', requireAdmin, hotelController.updateHotel);
router.delete('/:id', requireAdmin, hotelController.deleteHotel);

export const hotelRoutes = router;