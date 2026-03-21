import { Hotel, Prisma } from '@prisma/client';
import { HotelRepository } from '../repositories/hotel.repository';

export class HotelService {
  private repository: HotelRepository;

  constructor() {
    this.repository = new HotelRepository();
  }

  async getAllHotels(filters: { city?: string; isFeatured?: boolean; minStarRating?: number }): Promise<Hotel[]> {
    const whereClause: Prisma.HotelWhereInput = {
      status: 'ACTIVE',
    };

    if (filters.city) whereClause.city = filters.city;
    if (filters.isFeatured !== undefined) whereClause.isFeatured = filters.isFeatured;
    if (filters.minStarRating) whereClause.starRating = { gte: filters.minStarRating };

    return this.repository.findAll(whereClause);
  }

  async getHotelById(id: string): Promise<Hotel | null> {
    return this.repository.findById(id);
  }

  async createHotel(data: Omit<Prisma.HotelCreateInput, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>): Promise<Hotel> {
    return this.repository.create({
      ...data,
      status: data.status || 'ACTIVE',
    });
  }

  async updateHotel(id: string, data: Partial<Prisma.HotelUpdateInput>): Promise<Hotel> {
    return this.repository.update(id, data);
  }

  async deleteHotel(id: string): Promise<boolean> {
    return this.repository.delete(id);
  }
}