import { Merchant, Prisma } from '@prisma/client';
import { MerchantRepository } from '../repositories/merchant.repository';

export class MerchantService {
  private repository: MerchantRepository;

  constructor() {
    this.repository = new MerchantRepository();
  }

  async getAllMerchants(filters: { city?: string; categoryId?: string; isFeatured?: boolean }): Promise<Merchant[]> {
    const whereClause: Prisma.MerchantWhereInput = {
      status: 'ACTIVE', // Only fetch active merchants for listing
    };

    if (filters.city) whereClause.city = filters.city;
    if (filters.categoryId) whereClause.categoryId = filters.categoryId;
    if (filters.isFeatured !== undefined) whereClause.isFeatured = filters.isFeatured;

    return this.repository.findAll(whereClause);
  }

  async getMerchantById(id: string): Promise<Merchant | null> {
    return this.repository.findById(id);
  }

  async createMerchant(data: Omit<Prisma.MerchantCreateInput, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>): Promise<Merchant> {
    // Admin entry logic - can set default status
    return this.repository.create({
      ...data,
      status: data.status || 'ACTIVE',
    });
  }

  async updateMerchant(id: string, data: Partial<Prisma.MerchantUpdateInput>): Promise<Merchant> {
    return this.repository.update(id, data);
  }

  async deleteMerchant(id: string): Promise<boolean> {
    return this.repository.delete(id);
  }
}