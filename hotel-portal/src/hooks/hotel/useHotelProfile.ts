import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { hotelApi } from '@/lib/api/hotel/profile';
import { Hotel } from '@/types/hotel';
import { message } from 'antd';

export function useHotelProfile() {
  const queryClient = useQueryClient();

  const profileQuery = useQuery({
    queryKey: ['hotelProfile'],
    queryFn: async () => {
      const response = await hotelApi.getProfile();
      return response.data;
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: Partial<Hotel>) => {
      const response = await hotelApi.updateProfile(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotelProfile'] });
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
