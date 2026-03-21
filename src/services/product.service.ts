import { Product, Prisma } from '@prisma/client';
import { ProductRepository } from '../repositories/product.repository';

export class ProductService {
  private repository: ProductRepository;

  constructor() {
    this.repository = new ProductRepository();
  }

  async getProductsByMerchantId(merchantId: string, categoryId?: string): Promise<Product[]> {
    const filter: Prisma.ProductWhereInput = { merchantId, status: 'ON_SHELF' };
    if (categoryId) filter.categoryId = categoryId;
    return this.repository.findAll(filter);
  }

  async createProduct(merchantId: string, categoryId: string, data: Omit<Prisma.ProductCreateInput, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'merchant' | 'category'>): Promise<Product> {
    return this.repository.create({
      ...data,
      merchant: { connect: { id: merchantId } },
      category: { connect: { id: categoryId } },
      status: data.status || 'ON_SHELF',
      stock: data.stock ?? -1, // Contract: -1 means unlimited
    });
  }

  async updateProduct(id: string, data: Partial<Prisma.ProductUpdateInput>): Promise<Product> {
    return this.repository.update(id, data);
  }

  async deleteProduct(id: string): Promise<boolean> {
    return this.repository.delete(id);
  }
}