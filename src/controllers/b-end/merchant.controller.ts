import { Request, Response, NextFunction } from 'express';
import { MerchantService } from '../../services/merchant.service';
import { ProductCategoryService } from '../../services/product-category.service';
import { ProductService } from '../../services/product.service';
import { OrderService } from '../../services/order.service';
import { MerchantJwtPayload } from '../../types/express';
import { AppError } from '../../middlewares/error.middleware';

export class BEndMerchantController {
  private merchantService = new MerchantService();
  private categoryService = new ProductCategoryService();
  private productService = new ProductService();
  private orderService = new OrderService();

  // ==========================================
  // Profile (Self)
  // ==========================================
  public getMyProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { merchantId } = req.user as unknown as MerchantJwtPayload;
      const merchant = await this.merchantService.getMerchantById(merchantId);
      
      if (!merchant) throw new AppError('Merchant profile not found', 404);

      res.status(200).json({ success: true, data: merchant });
    } catch (error) {
      next(error);
    }
  };

  public updateMyProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { merchantId } = req.user as unknown as MerchantJwtPayload;
      // Strip out ID or sensitive fields just in case
      const { id, ...updateData } = req.body;
      
      const updatedMerchant = await this.merchantService.updateMerchant(merchantId, updateData);

      res.status(200).json({ success: true, data: updatedMerchant });
    } catch (error) {
      next(error);
    }
  };

  // ==========================================
  // Product Categories
  // ==========================================
  public getMyCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { merchantId } = req.user as unknown as MerchantJwtPayload;
      const categories = await this.categoryService.getCategoriesByMerchantId(merchantId);
      res.status(200).json({ success: true, data: categories });
    } catch (error) {
      next(error);
    }
  };

  public createCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { merchantId } = req.user as unknown as MerchantJwtPayload;
      const category = await this.categoryService.createCategory(merchantId, req.body);
      res.status(201).json({ success: true, data: category });
    } catch (error) {
      next(error);
    }
  };

  public updateCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { merchantId } = req.user as unknown as MerchantJwtPayload;
      const id = req.params.id as string;
      
      const category = await this.categoryService.updateCategory(merchantId, id, req.body);
      res.status(200).json({ success: true, data: category });
    } catch (error) {
      next(error);
    }
  };

  public deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { merchantId } = req.user as unknown as MerchantJwtPayload;
      const id = req.params.id as string;

      await this.categoryService.deleteCategory(merchantId, id);
      res.status(200).json({ success: true, message: 'Category deleted' });
    } catch (error) {
      next(error);
    }
  };

  // ==========================================
  // Products
  // ==========================================
  public getMyProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { merchantId } = req.user as unknown as MerchantJwtPayload;
      const products = await this.productService.getProductsByMerchantId(merchantId);
      res.status(200).json({ success: true, data: products });
    } catch (error) {
      next(error);
    }
  };

  public createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { merchantId: myMerchantId } = req.user as unknown as MerchantJwtPayload;
      const { categoryId, merchantId, ...productData } = req.body; // strip out malicious merchantId
      
      const product = await this.productService.createProduct(myMerchantId, categoryId, productData);
      res.status(201).json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  };

  public updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { merchantId } = req.user as unknown as MerchantJwtPayload;
      const id = req.params.id as string;
      
      const product = await this.productService.updateProduct(merchantId, id, req.body);
      res.status(200).json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  };

  public deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { merchantId } = req.user as unknown as MerchantJwtPayload;
      const id = req.params.id as string;

      await this.productService.deleteProduct(merchantId, id);
      res.status(200).json({ success: true, message: 'Product deleted' });
    } catch (error) {
      next(error);
    }
  };

  // ==========================================
  // Orders
  // ==========================================
  public getMyOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { merchantId } = req.user as unknown as MerchantJwtPayload;
      // Force filter by tenant
      const filters = { ...req.query, merchantId };
      const orders = await this.orderService.getAllOrders(filters);
      res.status(200).json({ success: true, data: orders });
    } catch (error) {
      next(error);
    }
  };

  public getOrderById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { merchantId } = req.user as unknown as MerchantJwtPayload;
      const id = req.params.id as string;
      const order = await this.orderService.getOrderById(id);

      if (!order || order.merchantId !== merchantId) {
        throw new AppError('Order not found or access denied', 404);
      }

      res.status(200).json({ success: true, data: order });
    } catch (error) {
      next(error);
    }
  };

  public performOrderAction = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { merchantId } = req.user as unknown as MerchantJwtPayload;
      const { id, action } = req.params;

      // Verify ownership before action
      const order = await this.orderService.getOrderById(id as string);
      if (!order || order.merchantId !== merchantId) {
        throw new AppError('Order not found or access denied', 404);
      }

      const updatedOrder = await this.orderService.performOrderAction(id as string, action as string);
      res.status(200).json({ success: true, data: updatedOrder });
    } catch (error: any) {
      if (error instanceof AppError) return next(error);
      next(new AppError(error.message, 400));
    }
  };
}
