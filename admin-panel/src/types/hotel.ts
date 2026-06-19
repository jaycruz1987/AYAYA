export interface Hotel {
  id: string;
  name: string;
  description: string | null;
  starRating: number | null;
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
  facilities: string[] | null;
  isFeatured: boolean;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
}
