import { create } from 'zustand';
import { Product } from '@/types/product';
import { Merchant } from '@/types/merchant';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartStore {
  merchant: Merchant | null;
  items: CartItem[];
  addItem: (product: Product, merchant: Merchant) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  merchant: null,
  items: [],
  
  addItem: (product, merchant) => {
    set((state) => {
      // If adding item from a different merchant, clear the cart first
      if (state.merchant && state.merchant.id !== merchant.id) {
        return {
          merchant,
          items: [{ product, quantity: 1 }],
        };
      }

      const existingItem = state.items.find(item => item.product.id === product.id);
      
      if (existingItem) {
        return {
          merchant,
          items: state.items.map(item => 
            item.product.id === product.id 
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }

      return {
        merchant,
        items: [...state.items, { product, quantity: 1 }],
      };
    });
  },

  removeItem: (productId) => {
    set((state) => {
      const newItems = state.items.filter(item => item.product.id !== productId);
      return {
        items: newItems,
        merchant: newItems.length === 0 ? null : state.merchant,
      };
    });
  },

  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(productId);
      return;
    }

    set((state) => ({
      items: state.items.map(item => 
        item.product.id === productId 
          ? { ...item, quantity }
          : item
      ),
    }));
  },

  clearCart: () => set({ merchant: null, items: [] }),

  getTotalItems: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },

  getTotalPrice: () => {
    return get().items.reduce((total, item) => total + (Number(item.product.price) * item.quantity), 0);
  },
}));