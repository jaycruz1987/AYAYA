import { Router } from 'express';
import { UploadController } from '../controllers/upload.controller';
import { upload } from '../middlewares/upload.middleware';
import { requireAdmin } from '../middlewares/auth.middleware';

const router = Router();
const uploadController = new UploadController();

// Only admins can upload files in this phase
// For C-end users, we might open a different route later for avatars, etc.

router.post(
  '/image',
  requireAdmin,
  upload.single('file'), // 'file' is the field name expected in form-data
  uploadController.uploadImage
);

router.post(
  '/images',
  requireAdmin,
  upload.array('files', 10), // 'files' is the field name, max 10 files
  uploadController.uploadMultipleImages
);

export const uploadRoutes = router;
