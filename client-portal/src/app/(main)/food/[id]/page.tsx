'use client';

import React, { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useClientMerchantDetails } from '@/hooks/client/useClientMerchants';
import { ChevronLeft, Star, Clock, MapPin, Search, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';

export default function MerchantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const { data: merchant, isLoading } = useClientMerchantDetails(resolvedParams.id);
  
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  const { items, addItem, updateQuantity, getTotalItems, getTotalPrice } = useCartStore();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-gray flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-orange"></div>
      </div>
    );
  }

  if (!merchant) {
    return (
      <div className="min-h-screen bg-brand-gray flex flex-col justify-center items-center p-4">
        <h2 className="text-xl font-bold mb-4 text-brand-charcoal">Restaurant not found</h2>
        <button onClick={() => router.back()} className="text-brand-orange bg-brand-orange-light px-4 py-2 rounded-full">
          Go Back
        </button>
      </div>
    );
  }

  // Extract unique categories from products
  const products: any[] = (merchant as any).products || [];
  const categories = products.length > 0 ? 
    Array.from(new Set(products.map(p => p.category?.name).filter(Boolean))) : [];

  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(p => p.category?.name === activeCategory);

  return (
    <div className="min-h-screen bg-brand-gray pb-24">
      {/* Header Image */}
      <div className="relative h-48 bg-brand-gray border border-brand-text-accent/20">
        {(merchant as any).coverImageUrl ? (
          <img 
            src={(merchant as any).coverImageUrl} 
            alt={(merchant as any).name} 
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-brand-text-accent/70">No Image</div>
        )}
        <div className="absolute top-0 left-0 right-0 p-4 pt-safe-top flex justify-between items-center bg-linear-to-b from-black/50 to-transparent">
          <button onClick={() => router.back()} className="w-10 h-10 bg-brand-surface/20 backdrop-blur-md rounded-full flex items-center justify-center text-white">
            <ChevronLeft size={24} />
          </button>
          <button className="w-10 h-10 bg-brand-surface/20 backdrop-blur-md rounded-full flex items-center justify-center text-white">
            <Search size={20} />
          </button>
        </div>
      </div>

      {/* Merchant Info */}
      <div className="bg-brand-surface px-4 py-5 -mt-6 rounded-t-3xl relative z-10 shadow-sm">
        <h1 className="text-2xl font-bold text-brand-charcoal mb-1">{(merchant as any).name}</h1>
        <p className="text-brand-text-accent text-sm mb-3">{(merchant as any).category?.name || 'Restaurant'} • {(merchant as any).addressLine}</p>
        
        <div className="flex items-center gap-4 text-sm font-medium">
          <div className="flex items-center gap-1 text-brand-charcoal">
            <Star size={16} className="text-brand-text-accent fill-brand-accent" />
            4.8 (100+ ratings)
          </div>
          <div className="flex items-center gap-1 text-brand-charcoal">
            <Clock size={16} className="text-brand-orange" />
            20-30 min
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-brand-surface mt-2 sticky top-0 z-20 border-b border-brand-text-accent/10">
        <div className="flex gap-4 overflow-x-auto p-4 scrollbar-hide">
          <button 
            onClick={() => setActiveCategory('all')}
            className={`whitespace-nowrap text-sm font-bold pb-1 border-b-2 transition-colors ${
              activeCategory === 'all' ? 'border-brand-orange text-brand-orange' : 'border-transparent text-brand-text-accent'
            }`}
          >
            All Items
          </button>
          {categories.map((cat: any) => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap text-sm font-bold pb-1 border-b-2 transition-colors ${
                activeCategory === cat ? 'border-brand-orange text-brand-orange' : 'border-transparent text-brand-text-accent'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products List */}
      <div className="p-4 flex flex-col gap-4">
        {filteredProducts?.map((product: any) => {
          const cartItem = items.find(item => item.product.id === product.id);
          const quantity = cartItem?.quantity || 0;

          return (
            <div key={product.id} className="bg-brand-surface p-3 rounded-xl flex gap-3 shadow-brand border border-transparent">
              <div className="w-24 h-24 bg-brand-gray rounded-lg overflow-hidden shrink-0 relative">
                {product.imageUrl ? (
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to a placeholder if the image fails to load
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-brand-text-accent/70 text-xs">No img</div>
                )}
              </div>
              <div className="flex-1 flex flex-col justify-between py-1">
                <div>
                  <h3 className="font-bold text-brand-charcoal text-sm leading-tight">{product.name}</h3>
                  {product.description && (
                    <p className="text-brand-text-accent text-xs mt-1 line-clamp-2">{product.description}</p>
                  )}
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="font-bold text-brand-charcoal">${Number(product.price).toFixed(2)}</span>
                  
                  {quantity > 0 ? (
                    <div className="flex items-center gap-3 bg-brand-gray rounded-full px-2 py-1">
                      <button 
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="w-6 h-6 bg-brand-surface rounded-full flex items-center justify-center text-brand-orange shadow-sm"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="font-bold text-sm w-4 text-center">{quantity}</span>
                      <button 
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="w-6 h-6 bg-brand-orange rounded-full flex items-center justify-center text-white shadow-sm"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => addItem(product, merchant as any)}
                      className="w-8 h-8 bg-brand-orange-light rounded-full flex items-center justify-center text-brand-orange transition-colors hover:bg-brand-orange hover:text-white"
                    >
                      <Plus size={18} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Cart Button */}
      {getTotalItems() > 0 && (
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 pb-safe z-50 bg-brand-surface shadow-[0_-8px_30px_rgba(0,0,0,0.04)] border-t border-brand-text-accent/5">
          <button 
            onClick={() => router.push('/cart')}
            className="w-full bg-brand-charcoal text-white rounded-full p-4 flex items-center justify-between shadow-lg"
          >
            <div className="flex items-center gap-3">
              <div className="bg-brand-surface/20 w-8 h-8 rounded-full flex items-center justify-center font-bold">
                {getTotalItems()}
              </div>
              <span className="font-bold">View Cart</span>
            </div>
            <span className="font-bold text-lg">${getTotalPrice().toFixed(2)}</span>
          </button>
        </div>
      )}
    </div>
  );
}