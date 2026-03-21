import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';

const router = Router();
const controller = new ProductController();

router.patch('/:id', controller.update);
router.delete('/:id', controller.delete);

export const productRoutes = router;