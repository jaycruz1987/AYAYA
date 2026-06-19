import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../../middlewares/error.middleware';

const prisma = new PrismaClient();

export class ClientAddressController {
  
  public getMyAddresses = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) throw new AppError('Unauthorized', 401);

      const addresses = await prisma.userAddress.findMany({
        where: { userId },
        orderBy: [
          { isDefault: 'desc' },
          { createdAt: 'desc' }
        ]
      });

      res.status(200).json({
        success: true,
        data: addresses
      });
    } catch (error) {
      next(error);
    }
  };

  public createAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) throw new AppError('Unauthorized', 401);

      const { isDefault, ...addressData } = req.body;

      // If this is the first address or set as default, update others
      if (isDefault) {
        await prisma.userAddress.updateMany({
          where: { userId },
          data: { isDefault: false }
        });
      }

      // Check if user has no addresses yet
      const count = await prisma.userAddress.count({ where: { userId } });
      const shouldBeDefault = isDefault || count === 0;

      const newAddress = await prisma.userAddress.create({
        data: {
          ...addressData,
          userId,
          isDefault: shouldBeDefault
        }
      });

      res.status(201).json({
        success: true,
        data: newAddress
      });
    } catch (error) {
      next(error);
    }
  };

  public updateAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) throw new AppError('Unauthorized', 401);
      
      const id = req.params.id as string;
      const { isDefault, ...addressData } = req.body;

      const address = await prisma.userAddress.findFirst({
        where: { id, userId }
      });

      if (!address) throw new AppError('Address not found', 404);

      if (isDefault && !address.isDefault) {
        await prisma.userAddress.updateMany({
          where: { userId },
          data: { isDefault: false }
        });
      }

      const updatedAddress = await prisma.userAddress.update({
        where: { id },
        data: {
          ...addressData,
          isDefault: isDefault !== undefined ? isDefault : address.isDefault
        }
      });

      res.status(200).json({
        success: true,
        data: updatedAddress
      });
    } catch (error) {
      next(error);
    }
  };

  public deleteAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) throw new AppError('Unauthorized', 401);
      
      const id = req.params.id as string;

      const address = await prisma.userAddress.findFirst({
        where: { id, userId }
      });

      if (!address) throw new AppError('Address not found', 404);

      await prisma.userAddress.delete({
        where: { id }
      });

      // If we deleted the default address, make the most recent one default
      if (address.isDefault) {
        const nextAddress = await prisma.userAddress.findFirst({
          where: { userId },
          orderBy: { createdAt: 'desc' }
        });

        if (nextAddress) {
          await prisma.userAddress.update({
            where: { id: nextAddress.id },
            data: { isDefault: true }
          });
        }
      }

      res.status(200).json({
        success: true,
        message: 'Address deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  };
}

export const clientAddressController = new ClientAddressController();