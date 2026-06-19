import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { merchantProductsApi } from '@/lib/api/merchant/products';
import { Product } from '@/types/product';
import { message } from 'antd';

export function useMerchantProducts(categoryId?: string) {
  const queryClient = useQueryClient();

  const productsQuery = useQuery({
    queryKey: ['merchantProducts', categoryId],
    queryFn: async () => {
      const response = await merchantProductsApi.getAll(categoryId);
      return response.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: merchantProductsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['merchantProducts'] });
      message.success('Product created successfully');
    },
    onError: (error: any) => {
      message.error(error.message || 'Failed to create product');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Product> }) => 
      merchantProductsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['merchantProducts'] });
      message.success('Product updated successfully');
    },
    onError: (error: any) => {
      message.error(error.message || 'Failed to update product');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: merchantProductsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['merchantProducts'] });
      message.success('Product deleted successfully');
    },
    onError: (error: any) => {
      message.error(error.message || 'Failed to delete product');
    },
  });

  return {
    products: productsQuery.data || [],
    isLoading: productsQuery.isLoading,
    createProduct: createMutation.mutateAsync,
    updateProduct: updateMutation.mutateAsync,
    deleteProduct: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
  };
}
