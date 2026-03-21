import { Router } from 'express';
import { MerchantController } from '../controllers/merchant.controller';
import { ProductCategoryController } from '../controllers/product-category.controller';
import { ProductController } from '../controllers/product.controller';
import { requireAdmin } from '../middlewares/auth.middleware';

// --- Merchant Routes ---
const router = Router();
const merchantController = new MerchantController();
const productCategoryController = new ProductCategoryController();
const productController = new ProductController();

// Public Routes
router.get('/', merchantController.getAllMerchants);

// --- Nested Product Category Routes ---
router.get('/:merchantId/product-categories', productCategoryController.getByMerchant);
router.post('/:merchantId/product-categories', productCategoryController.create);

// --- Nested Product Routes ---
router.get('/:merchantId/products', productController.getByMerchant);
router.post('/:merchantId/products', productController.create);

// Public Routes
router.get('/:id', merchantController.getMerchantById);

// Admin Routes (Protected)
router.post('/', requireAdmin, merchantController.createMerchant);
router.patch('/:id', requireAdmin, merchantController.updateMerchant);
router.delete('/:id', requireAdmin, merchantController.deleteMerchant);

export const merchantRoutes = router;