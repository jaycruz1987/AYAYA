import { Request, Response, NextFunction } from 'express';
import { verifyToken, TokenPayload } from '../utils/jwt.util';
import { AppError } from './error.middleware';

// The Express Request interface is extended in src/types/express.d.ts

const extractToken = (req: Request): string | null => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    return req.headers.authorization.split(' ')[1];
  }
  return null;
};

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = extractToken(req);

    if (!token) {
      throw new AppError('Authentication required. Please log in.', 401);
    }

    const decoded = verifyToken(token);
    req.user = decoded;
    
    next();
  } catch (error) {
    next(new AppError('Invalid or expired token', 401));
  }
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    requireAuth(req, res, () => {
      if (req.user?.type !== 'admin') {
        throw new AppError('Access denied. Admin privileges required.', 403);
      }
      next();
    });
  } catch (error) {
    next(error);
  }
};
