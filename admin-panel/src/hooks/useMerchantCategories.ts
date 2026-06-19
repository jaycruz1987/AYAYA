import { useQuery } from '@tanstack/react-query';
import { getMerchantCategories } from '@/lib/api/merchant-categories';

export const useMerchantCategories = () => {
  return useQuery({
    queryKey: ['merchant-categories'],
    queryFn: getMerchantCategories,
  });
};
