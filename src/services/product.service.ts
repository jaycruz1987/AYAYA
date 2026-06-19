import { Product, Prisma } from '@prisma/client';
import { ProductRepository } from '../repositories/product.repository';
import { AppError } from '../middlewares/error.middleware';

export class ProductService {
  private productRepository: ProductRepository;

  constructor() {
    this.productRepository = new ProductRepository();
  }

  async getProductsByMerchantId(merchantId: string, filters?: any): Promise<Product[]> {
    return this.productRepository.findByMerchantId(merchantId, filters);
  }

  async getProductById(id: string): Promise<Product | null> {
    return this.productRepository.findById(id);
  }

  async createProduct(merchantId: string, categoryId: string, data: Omit<Prisma.ProductCreateInput, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'merchant' | 'category'>): Promise<Product> {
    return this.productRepository.create(merchantId, categoryId, data);
  }

  async updateProduct(merchantId: string, id: string, data: Partial<Prisma.ProductUpdateInput>): Promise<Product> {
    const existing = await this.getProductById(id);
    if (!existing || existing.merchantId !== merchantId) {
      throw new AppError('Product not found or access denied', 404);
    }
    return this.productRepository.update(id, data);
  }

  async deleteProduct(merchantId: string, id: string): Promise<boolean> {
    const existing = await this.getProductById(id);
    if (!existing || existing.merchantId !== merchantId) {
      throw new AppError('Product not found or access denied', 404);
    }
    return this.productRepository.delete(id);
  }
}