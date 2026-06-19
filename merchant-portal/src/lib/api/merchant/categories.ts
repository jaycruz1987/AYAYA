import api from '../axios';
import { ProductCategory } from '@/types/product-category';

export const merchantCategoriesApi = {
  getAll: () => api.get<{ success: boolean; data: ProductCategory[] }>('/b-end/merchant/categories'),
  create: (data: Partial<ProductCategory>) => api.post<{ success: boolean; data: ProductCategory }>('/b-end/merchant/categories', data),
  update: (id: string, data: Partial<ProductCategory>) => api.patch<{ success: boolean; data: ProductCategory }>(`/b-end/merchant/categories/${id}`, data),
  delete: (id: string) => api.delete<{ success: boolean; message: string }>(`/b-end/merchant/categories/${id}`),
};
