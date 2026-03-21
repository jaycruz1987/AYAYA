import { Request, Response, NextFunction } from 'express';
import { MerchantService } from '../services/merchant.service';
import { AppError } from '../middlewares/error.middleware';

export class MerchantController {
  private merchantService: MerchantService;

  constructor() {
    this.merchantService = new MerchantService();
  }

  // Bind methods to preserve 'this' context when used as Express callbacks
  public getAllMerchants = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { city, categoryId, isFeatured } = req.query;
      
      const filters = {
        city: city as string,
        categoryId: categoryId as string,
        isFeatured: isFeatured === 'true' ? true : isFeatured === 'false' ? false : undefined,
      };

      const merchants = await this.merchantService.getAllMerchants(filters);

      res.status(200).json({
        success: true,
        data: merchants,
      });
    } catch (error) {
      next(error);
    }
  };

  public getMerchantById = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const merchant = await this.merchantService.getMerchantById(id);

      if (!merchant) {
        throw new AppError('Merchant not found', 404);
      }

      res.status(200).json({
        success: true,
        data: merchant,
      });
    } catch (error) {
      next(error);
    }
  };

  public createMerchant = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Note: In Phase 2, we will add DTO validation (e.g. using Zod or Joi) here.
      // For now, we trust the body matches Prisma.MerchantCreateInput
      const newMerchant = await this.merchantService.createMerchant(req.body);

      res.status(201).json({
        success: true,
        data: newMerchant,
      });
    } catch (error) {
      next(error);
    }
  };

  public updateMerchant = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const updatedMerchant = await this.merchantService.updateMerchant(id, req.body);

      res.status(200).json({
        success: true,
        data: updatedMerchant,
      });
    } catch (error) {
      next(error);
    }
  };

  public deleteMerchant = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      await this.merchantService.deleteMerchant(id);

      res.status(200).json({
        success: true,
        message: 'Merchant successfully deleted',
      });
    } catch (error) {
      next(error);
    }
  };
}