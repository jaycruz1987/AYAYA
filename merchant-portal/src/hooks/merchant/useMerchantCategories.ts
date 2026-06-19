import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { merchantCategoriesApi } from '@/lib/api/merchant/categories';
import { ProductCategory } from '@/types/product-category';
import { message } from 'antd';

export function useMerchantCategories() {
  const queryClient = useQueryClient();

  const categoriesQuery = useQuery({
    queryKey: ['merchantCategories'],
    queryFn: async () => {
      const response = await merchantCategoriesApi.getAll();
      return response.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: merchantCategoriesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['merchantCategories'] });
      message.success('Category created successfully');
    },
    onError: (error: any) => {
      message.error(error.message || 'Failed to create category');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ProductCategory> }) => 
      merchantCategoriesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['merchantCategories'] });
      message.success('Category updated successfully');
    },
    onError: (error: any) => {
      message.error(error.message || 'Failed to update category');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: merchantCategoriesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['merchantCategories'] });
      message.success('Category deleted successfully');
    },
    onError: (error: any) => {
      message.error(error.message || 'Failed to delete category');
    },
  });

  return {
    categories: categoriesQuery.data || [],
    isLoading: categoriesQuery.isLoading,
    createCategory: createMutation.mutateAsync,
    updateCategory: updateMutation.mutateAsync,
    deleteCategory: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
  };
}
