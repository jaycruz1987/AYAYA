import api from '../axios';
import { Product } from '@/types/product';

export const merchantProductsApi = {
  getAll: (categoryId?: string) => {
    const url = categoryId ? `/b-end/merchant/products?categoryId=${categoryId}` : '/b-end/merchant/products';
    return api.get<{ success: boolean; data: Product[] }>(url);
  },
  create: (data: Partial<Product>) => api.post<{ success: boolean; data: Product }>('/b-end/merchant/products', data),
  update: (id: string, data: Partial<Product>) => api.patch<{ success: boolean; data: Product }>(`/b-end/merchant/products/${id}`, data),
  delete: (id: string) => api.delete<{ success: boolean; message: string }>(`/b-end/merchant/products/${id}`),
};
