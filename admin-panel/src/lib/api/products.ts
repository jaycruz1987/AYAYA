import api from './axios';
import { Product, ProductCategory } from '@/types/product';
import { PaginatedResponse } from '@/types/merchant';

// ==========================================
// Products
// ==========================================

export const getProductsByMerchant = async (merchantId: string): Promise<PaginatedResponse<Product[]>> => {
  return api.get(`/merchants/${merchantId}/products`);
};

export const createProduct = async (merchantId: string, data: Partial<Product>): Promise<{ success: boolean; data: Product }> => {
  return api.post(`/merchants/${merchantId}/products`, data);
};

export const updateProduct = async (id: string, data: Partial<Product>): Promise<{ success: boolean; data: Product }> => {
  return api.patch(`/products/${id}`, data);
};

export const deleteProduct = async (id: string): Promise<{ success: boolean; message: string }> => {
  return api.delete(`/products/${id}`);
};

// ==========================================
// Product Categories
// ==========================================

export const getProductCategoriesByMerchant = async (merchantId: string): Promise<PaginatedResponse<ProductCategory[]>> => {
  return api.get(`/merchants/${merchantId}/product-categories`);
};

export const createProductCategory = async (merchantId: string, data: Partial<ProductCategory>): Promise<{ success: boolean; data: ProductCategory }> => {
  return api.post(`/merchants/${merchantId}/product-categories`, data);
};

export const updateProductCategory = async (id: string, data: Partial<ProductCategory>): Promise<{ success: boolean; data: ProductCategory }> => {
  return api.patch(`/product-categories/${id}`, data);
};

export const deleteProductCategory = async (id: string): Promise<{ success: boolean; message: string }> => {
  return api.delete(`/product-categories/${id}`);
};
