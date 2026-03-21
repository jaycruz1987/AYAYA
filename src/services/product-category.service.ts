import { ProductCategory, Prisma } from '@prisma/client';
import { ProductCategoryRepository } from '../repositories/product-category.repository';

export class ProductCategoryService {
  private repository: ProductCategoryRepository;

  constructor() {
    this.repository = new ProductCategoryRepository();
  }

  async getCategoriesByMerchantId(merchantId: string): Promise<ProductCategory[]> {
    return this.repository.findAll({ merchantId, status: 'ACTIVE' });
  }

  async createCategory(merchantId: string, data: Omit<Prisma.ProductCategoryCreateInput, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'merchant'>): Promise<ProductCategory> {
    return this.repository.create({
      ...data,
      merchant: { connect: { id: merchantId } },
      status: data.status || 'ACTIVE',
    });
  }

  async updateCategory(id: string, data: Partial<Prisma.ProductCategoryUpdateInput>): Promise<ProductCategory> {
    return this.repository.update(id, data);
  }

  async deleteCategory(id: string): Promise<boolean> {
    return this.repository.delete(id);
  }
}