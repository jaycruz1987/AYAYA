import { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/product.service';

export class ProductController {
  private service: ProductService;

  constructor() {
    this.service = new ProductService();
  }

  public getByMerchant = async (req: Request<{ merchantId: string }>, res: Response, next: NextFunction) => {
    try {
      const merchantId = req.params.merchantId;
      const { categoryId } = req.query;
      const products = await this.service.getProductsByMerchantId(merchantId, categoryId as string);
      res.status(200).json({ success: true, data: products });
    } catch (error) {
      next(error);
    }
  };

  public create = async (req: Request<{ merchantId: string }>, res: Response, next: NextFunction) => {
    try {
      const merchantId = req.params.merchantId;
      const { categoryId, ...productData } = req.body;
      
      if (!categoryId) {
        return res.status(400).json({ success: false, message: 'categoryId is required in body' });
      }

      const newProduct = await this.service.createProduct(merchantId, categoryId, productData);
      res.status(201).json({ success: true, data: newProduct });
    } catch (error) {
      next(error);
    }
  };

  public update = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const updated = await this.service.updateProduct(id, req.body);
      res.status(200).json({ success: true, data: updated });
    } catch (error) {
      next(error);
    }
  };

  public delete = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      await this.service.deleteProduct(id);
      res.status(200).json({ success: true, message: 'Product deleted' });
    } catch (error) {
      next(error);
    }
  };
}