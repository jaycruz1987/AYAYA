import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validateRequest } from '../middlewares/validate.middleware';
import { requireAuth } from '../middlewares/auth.middleware';
import { 
  registerUserSchema, 
  loginUserSchema, 
  registerAdminSchema, 
  loginAdminSchema 
} from '../dtos/auth.dto';

const router = Router();
const authController = new AuthController();

// C-End User Routes
router.post('/user/register', validateRequest(registerUserSchema), authController.registerUser);
router.post('/user/login', validateRequest(loginUserSchema), authController.loginUser);

// B-End Admin Routes
router.post('/admin/register', validateRequest(registerAdminSchema), authController.registerAdmin);
router.post('/admin/login', validateRequest(loginAdminSchema), authController.loginAdmin);

// Profile Route (Protected)
router.get('/profile', requireAuth, authController.getProfile);

export const authRoutes = router;
