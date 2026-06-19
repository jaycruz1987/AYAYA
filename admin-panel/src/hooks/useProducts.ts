import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getProductsByMerchant, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  getProductCategoriesByMerchant,
  createProductCategory,
  updateProductCategory,
  deleteProductCategory
} from '@/lib/api/products';
import { Product, ProductCategory } from '@/types/product';
import { message } from 'antd';

// ==========================================
// Products
// ==========================================

export const useProductsByMerchant = (merchantId: string) => {
  return useQuery({
    queryKey: ['products', merchantId],
    queryFn: () => getProductsByMerchant(merchantId),
    enabled: !!merchantId,
  });
};

export const useCreateProduct = (merchantId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Product>) => createProduct(merchantId, data),
    onSuccess: () => {
      message.success('Product created successfully');
      queryClient.invalidateQueries({ queryKey: ['products', merchantId] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.error?.message || 'Failed to create product');
    },
  });
};

export const useUpdateProduct = (merchantId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Product> }) => updateProduct(id, data),
    onSuccess: () => {
      message.success('Product updated successfully');
      queryClient.invalidateQueries({ queryKey: ['products', merchantId] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.error?.message || 'Failed to update product');
    },
  });
};

export const useDeleteProduct = (merchantId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => {
      message.success('Product deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['products', merchantId] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.error?.message || 'Failed to delete product');
    },
  });
};

// ==========================================
// Product Categories
// ==========================================

export const useProductCategoriesByMerchant = (merchantId: string) => {
  return useQuery({
    queryKey: ['product-categories', merchantId],
    queryFn: () => getProductCategoriesByMerchant(merchantId),
    enabled: !!merchantId,
  });
};

export const useCreateProductCategory = (merchantId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ProductCategory>) => createProductCategory(merchantId, data),
    onSuccess: () => {
      message.success('Category created successfully');
      queryClient.invalidateQueries({ queryKey: ['product-categories', merchantId] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.error?.message || 'Failed to create category');
    },
  });
};

export const useUpdateProductCategory = (merchantId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ProductCategory> }) => updateProductCategory(id, data),
    onSuccess: () => {
      message.success('Category updated successfully');
      queryClient.invalidateQueries({ queryKey: ['product-categories', merchantId] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.error?.message || 'Failed to update category');
    },
  });
};

export const useDeleteProductCategory = (merchantId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteProductCategory(id),
    onSuccess: () => {
      message.success('Category deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['product-categories', merchantId] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.error?.message || 'Failed to delete category');
    },
  });
};
