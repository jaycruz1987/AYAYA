import { Request, Response, NextFunction } from 'express';
import { ProductCategoryService } from '../services/product-category.service';
import { AppError } from '../middlewares/error.middleware';

export class ProductCategoryController {
  private service: ProductCategoryService;

  constructor() {
    this.service = new ProductCategoryService();
  }

  public getByMerchant = async (req: Request<{ merchantId: string }>, res: Response, next: NextFunction) => {
    try {
      const merchantId = req.params.merchantId; // from /merchants/:merchantId/product-categories
      const categories = await this.service.getCategoriesByMerchantId(merchantId);
      res.status(200).json({ success: true, data: categories });
    } catch (error) {
      next(error);
    }
  };

  public create = async (req: Request<{ merchantId: string }>, res: Response, next: NextFunction) => {
    try {
      const merchantId = req.params.merchantId; // from /merchants/:merchantId/product-categories
      const newCategory = await this.service.createCategory(merchantId, req.body);
      res.status(201).json({ success: true, data: newCategory });
    } catch (error) {
      next(error);
    }
  };

  public update = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id; // from /product-categories/:id
      // Since this is Admin API, we bypass merchant check by passing the existing merchantId
      const existing = await this.service.getCategoryById(id);
      if (!existing) throw new AppError('Not found', 404);

      const updated = await this.service.updateCategory(existing.merchantId, id, req.body);
      res.status(200).json({ success: true, data: updated });
    } catch (error) {
      next(error);
    }
  };

  public delete = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id; // from /product-categories/:id
      const existing = await this.service.getCategoryById(id);
      if (!existing) throw new AppError('Not found', 404);

      await this.service.deleteCategory(existing.merchantId, id);
      res.status(200).json({ success: true, data: null });
    } catch (error) {
      next(error);
    }
  };
}