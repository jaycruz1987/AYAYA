import { Router } from 'express';
import { BEndMerchantController } from '../../controllers/b-end/merchant.controller';
import { requireMerchantAuth } from '../../middlewares/tenant-auth.middleware';

const router = Router();
const controller = new BEndMerchantController();

// Apply strict tenant isolation middleware to ALL routes in this file
router.use(requireMerchantAuth);

// Profile
router.get('/profile', controller.getMyProfile);
router.patch('/profile', controller.updateMyProfile);

// Product Categories
router.get('/categories', controller.getMyCategories);
router.post('/categories', controller.createCategory);
router.patch('/categories/:id', controller.updateCategory);
router.delete('/categories/:id', controller.deleteCategory);

// Products
router.get('/products', controller.getMyProducts);
router.post('/products', controller.createProduct);
router.patch('/products/:id', controller.updateProduct);
router.delete('/products/:id', controller.deleteProduct);

// Orders
router.get('/orders', controller.getMyOrders);
router.get('/orders/:id', controller.getOrderById);
router.post('/orders/:id/:action', controller.performOrderAction);

export const bEndMerchantRoutes = router;
