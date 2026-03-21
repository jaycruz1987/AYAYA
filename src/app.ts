import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { errorHandler } from './middlewares/error.middleware';
import path from 'path';
import { healthRoutes } from './routes/health.routes';
import { merchantRoutes } from './routes/merchant.routes';
import { hotelRoutes } from './routes/hotel.routes';
import { productCategoryRoutes } from './routes/product-category.routes';
import { productRoutes } from './routes/product.routes';
import { roomTypeRoutes } from './routes/room-type.routes';
import { authRoutes } from './routes/auth.routes';
import { uploadRoutes } from './routes/upload.routes';

// Load environment variables
dotenv.config();

const app: Application = express();

// Global Middlewares
app.use(helmet()); // Security headers
app.use(cors()); // CORS configuration
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(morgan('dev')); // HTTP request logger

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API Routes
const API_PREFIX = '/api/v1';
app.use('/health', healthRoutes);

// Auth routes
app.use(`${API_PREFIX}/auth`, authRoutes);

// Upload routes
app.use(`${API_PREFIX}/upload`, uploadRoutes);

// Base routes for updating/deleting nested entities directly
app.use(`${API_PREFIX}/product-categories`, productCategoryRoutes);
app.use(`${API_PREFIX}/products`, productRoutes);
app.use(`${API_PREFIX}/room-types`, roomTypeRoutes);

// Merchants routes (includes nested product and product-categories)
app.use(`${API_PREFIX}/merchants`, merchantRoutes);

// Hotels routes (includes nested room-types)
app.use(`${API_PREFIX}/hotels`, hotelRoutes);

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Global Error Handler (Must be last)
app.use(errorHandler);

export default app;