import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../../middlewares/error.middleware';

const prisma = new PrismaClient();

export class ClientServiceRequestController {
  
  public createServiceRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('Unauthorized', 401);
      }

      const { hotelId, type, description, requestData } = req.body;

      // Ensure the hotel exists if hotelId is provided
      if (hotelId) {
        const hotel = await prisma.hotel.findUnique({ where: { id: hotelId } });
        if (!hotel) throw new AppError('Hotel not found', 404);
      }

      const referenceNo = `SR-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      const newRequest = await prisma.serviceRequest.create({
        data: {
          referenceNo,
          userId,
          hotelId,
          type: type || 'HOTEL_BOOKING',
          status: 'PENDING',
          contactName: req.user?.name || 'Guest',
          contactPhone: req.user?.phone || 'N/A',
          requestData: requestData || { description: description || 'Structured Booking Request' }, // Store the structured JSON payload here
        }
      });

      res.status(201).json({
        success: true,
        data: newRequest
      });

    } catch (error) {
      next(error);
    }
  };

  public getMyRequests = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) throw new AppError('Unauthorized', 401);

      const requests = await prisma.serviceRequest.findMany({
        where: { userId },
        include: {
          hotel: {
            select: { name: true, coverImageUrl: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      res.status(200).json({
        success: true,
        data: requests
      });
    } catch (error) {
      next(error);
    }
  };
}

export const clientServiceRequestController = new ClientServiceRequestController();