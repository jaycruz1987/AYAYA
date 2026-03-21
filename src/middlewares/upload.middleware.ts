import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import { AppError } from './error.middleware';

// Define the storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // In Phase 1, we use local storage. In Phase 2, this will be replaced by AWS S3 or similar.
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Generate a unique filename to prevent collisions
    const uniqueSuffix = crypto.randomBytes(16).toString('hex');
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

// Define file filter (only allow images for now)
const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('Invalid file type. Only JPEG, PNG, WEBP, and GIF are allowed.', 400));
  }
};

// Create the multer instance
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});
