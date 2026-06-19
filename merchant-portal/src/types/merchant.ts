export interface MerchantCategory {
  id: string;
  name: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface Merchant {
  id: string;
  categoryId: string | null;
  name: string;
  description: string | null;
  logoUrl: string | null;
  coverImageUrl: string | null;
  contactName: string | null;
  contactPhone: string | null;
  addressLine: string | null;
  city: string | null;
  township: string | null;
  landmark: string | null;
  buildingName: string | null;
  latitude: number | null;
  longitude: number | null;
  serviceMode: 'DELIVERY' | 'PICKUP' | 'DINE_IN';
  minimumOrderAmount: number;
  deliveryRadiusKm: number | null;
  operatingStatus: 'OPEN' | 'CLOSED' | 'TEMPORARILY_CLOSED';
  isFeatured: boolean;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  category?: MerchantCategory;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T;
  // If your backend adds pagination later, you can add meta here
  meta?: {
    total: number;
    page: number;
    limit: number;
  }
}
