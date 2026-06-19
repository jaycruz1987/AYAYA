import { Router } from 'express';
import { clientAddressController } from '../../controllers/c-end/address.controller';
import { requireAuth } from '../../middlewares/auth.middleware';

const router = Router();

router.use(requireAuth);

router.get('/', clientAddressController.getMyAddresses);
router.post('/', clientAddressController.createAddress);
router.patch('/:id', clientAddressController.updateAddress);
router.delete('/:id', clientAddressController.deleteAddress);

export const cEndAddressRoutes = router;
