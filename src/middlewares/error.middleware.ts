import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';

// Custom Application Error Class
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let errorCode = 'INTERNAL_ERROR';

  // 1. Handle Custom App Errors
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errorCode = 'APP_ERROR';
  } 
  // 2. Handle Prisma Known Request Errors
  else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    statusCode = 400; // Bad Request for DB constraints usually
    errorCode = err.code;
    
    switch (err.code) {
      case 'P2002':
        message = `Unique constraint failed on the fields: ${(err.meta?.target as string[])?.join(', ')}`;
        statusCode = 409; // Conflict
        break;
      case 'P2025':
        message = 'Record not found for the given operation.';
        statusCode = 404; // Not Found
        break;
      case 'P2003':
        message = 'Foreign key constraint failed.';
        break;
      default:
        message = `Database Error: ${err.message}`;
    }
  } 
  // 3. Handle Prisma Validation Errors
  else if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    errorCode = 'DB_VALIDATION_ERROR';
    message = 'Invalid data provided to the database.';
  }
  // 4. Handle generic errors
  else {
    message = err.message;
  }

  // Log error in development or if it's not an operational error
  if (process.env.NODE_ENV === 'development' || statusCode === 500) {
    console.error(`[Error] ${req.method} ${req.url} >>`, err);
  }

  res.status(statusCode).json({
    success: false,
    error: {
      code: errorCode,
      message: message,
      // Include stack trace only in development
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
};