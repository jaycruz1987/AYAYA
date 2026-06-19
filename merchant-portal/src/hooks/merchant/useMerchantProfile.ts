import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { merchantApi } from '@/lib/api/merchant/profile';
import { Merchant } from '@/types/merchant';
import { message } from 'antd';

export function useMerchantProfile() {
  const queryClient = useQueryClient();

  const profileQuery = useQuery({
    queryKey: ['merchantProfile'],
    queryFn: async () => {
      const response = await merchantApi.getProfile();
      return response.data;
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: Partial<Merchant>) => {
      const response = await merchantApi.updateProfile(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['merchantProfile'] });
      message.success('Profile updated successfully');
    },
    onError: (error: any) => {
      message.error(error.message || 'Failed to update profile');
    },
  });

  return {
    profile: profileQuery.data,
    isLoading: profileQuery.isLoading,
    updateProfile: updateProfileMutation.mutateAsync,
    isUpdating: updateProfileMutation.isPending,
  };
}
