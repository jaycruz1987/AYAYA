export interface ProductCategory {
  id: string;
  merchantId: string;
  name: string;
  sortOrder: number;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}
