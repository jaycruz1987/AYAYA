import { ProductCategory, Prisma } from '@prisma/client';
import { ProductCategoryRepository } from '../repositories/product-category.repository';

export class ProductCategoryService {
  private categoryRepository: ProductCategoryRepository;

  constructor() {
    this.categoryRepository = new ProductCategoryRepository();
  }

  async getCategoriesByMerchantId(merchantId: string): Promise<ProductCategory[]> {
    return this.categoryRepository.findByMerchantId(merchantId);
  }

  async getCategoryById(id: string): Promise<ProductCategory | null> {
    return this.categoryRepository.findById(id);
  }

  async createCategory(merchantId: string, data: Omit<Prisma.ProductCategoryCreateInput, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'merchant'>): Promise<ProductCategory> {
    return this.categoryRepository.createCategory(merchantId, data);
  }

  async updateCategory(merchantId: string, id: string, data: Partial<Prisma.ProductCategoryUpdateInput>): Promise<ProductCategory> {
    const existing = await this.getCategoryById(id);
    if (!existing || existing.merchantId !== merchantId) {
      throw new Error('Category not found or access denied');
    }
    return this.categoryRepository.update(id, data);
  }

  async deleteCategory(merchantId: string, id: string): Promise<boolean> {
    const existing = await this.getCategoryById(id);
    if (!existing || existing.merchantId !== merchantId) {
      throw new Error('Category not found or access denied');
    }
    return this.categoryRepository.delete(id);
  }
}