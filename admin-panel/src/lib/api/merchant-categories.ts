import api from './axios';
import { MerchantCategory, PaginatedResponse } from '@/types/merchant';

// Although these are product categories technically tied to merchants, 
// for global categorizations or if there are generic merchant categories we fetch them here.
// Let's assume you have a global endpoint for categories or we are using product-categories.
// If you meant "merchant categories" as in the type of the merchant (e.g. Thai Food, Fast Food)
// Let's implement the generic fetch based on your backend design.
// From previous context, product_categories is tied to a specific merchant.
// Wait, in schema, does merchant have a categoryId? Yes, `categoryId` in `merchants` table points to a global `merchant_categories` table.

export const getMerchantCategories = async (): Promise<PaginatedResponse<MerchantCategory[]>> => {
  return api.get('/merchant-categories'); // Adjust this endpoint if your backend route is different
};
