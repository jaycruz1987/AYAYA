import { Router } from 'express';
import { ProductCategoryController } from '../controllers/product-category.controller';

const router = Router();
const controller = new ProductCategoryController();

router.patch('/:id', controller.update);
router.delete('/:id', controller.delete);

export const productCategoryRoutes = router;