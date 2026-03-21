import { Request, Response, NextFunction } from 'express';
import { ProductCategoryService } from '../services/product-category.service';

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
      const updated = await this.service.updateCategory(id, req.body);
      res.status(200).json({ success: true, data: updated });
    } catch (error) {
      next(error);
    }
  };

  public delete = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id; // from /product-categories/:id
      await this.service.deleteCategory(id);
      res.status(200).json({ success: true, message: 'Category deleted' });
    } catch (error) {
      next(error);
    }
  };
}