import { Router } from 'express';
import { RoomTypeController } from '../controllers/room-type.controller';

const router = Router();
const controller = new RoomTypeController();

router.patch('/:id', controller.update);
router.delete('/:id', controller.delete);

export const roomTypeRoutes = router;