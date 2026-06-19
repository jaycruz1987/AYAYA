export interface ProductCategory {
  id: string;
  merchantId: string;
  name: string;
  sortOrder: number;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  merchantId: string;
  categoryId: string | null;
  name: string;
  description: string | null;
  imageUrl: string | null;
  price: string | number;
  stock: number;
  status: 'ON_SHELF' | 'OFF_SHELF';
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  category?: ProductCategory;
}
