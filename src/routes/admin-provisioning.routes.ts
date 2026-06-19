import { Router } from 'express';
import { createMerchantAccount, createHotelAccount } from '../controllers/admin-provisioning.controller';
import { requireAdmin } from '../middlewares/auth.middleware';

const router = Router();

// Only Admins can provision these B-end accounts
router.post('/merchant', requireAdmin, createMerchantAccount);
router.post('/hotel', requireAdmin, createHotelAccount);

export const adminProvisioningRoutes = router;
