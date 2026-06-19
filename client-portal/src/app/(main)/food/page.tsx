'use client';

import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useClientMerchants } from '@/hooks/client/useClientMerchants';
import { Star, Clock, MapPin, Search } from 'lucide-react';
import Link from 'next/link';

export default function FoodPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: merchants, isLoading } = useClientMerchants();

  const filteredMerchants = (Array.isArray(merchants) ? merchants : [])?.filter((m: any) => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <MainLayout>
      <div className="bg-linear-to-r from-brand-orange to-brand-accent sticky top-0 z-10 px-4 pt-safe-top text-white shadow-sm">
        <div className="py-3">
          <h1 className="text-xl font-bold text-white mb-3">Food Delivery</h1>
          <div className="bg-white/20 rounded-xl flex items-center px-4 py-2.5 border border-white/10">
            <Search size={18} className="text-white mr-2" />
            <input 
              type="text" 
              placeholder="Search restaurants or dishes..." 
              className="flex-1 bg-transparent outline-none text-white text-sm placeholder:text-white/70"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
          {['All', 'Fast Food', 'Asian', 'Desserts', 'Healthy'].map((cat, i) => (
            <button 
              key={cat}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                i === 0 ? 'bg-brand-orange text-white' : 'bg-brand-surface text-brand-text-accent border border-brand-text-accent/20 hover:border-brand-orange/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <h2 className="font-bold text-lg mb-4 text-brand-charcoal">All Restaurants</h2>

        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-orange"></div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filteredMerchants.map((merchant: any) => (
              <Link href={`/food/${merchant.id}`} key={merchant.id}>
                <div className="bg-brand-surface rounded-2xl overflow-hidden shadow-brand border border-transparent hover:border-brand-orange/30 transition-colors">
                  <div className="h-32 bg-brand-gray relative">
                    {merchant.coverImageUrl ? (
                      <img 
                        src={merchant.coverImageUrl} 
                        alt={merchant.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-brand-text-accent/70">No Image</div>
                    )}
                    <div className="absolute top-2 right-2 bg-brand-surface px-2 py-1 rounded-full flex items-center gap-1 text-xs font-bold shadow-sm">
                      <Star size={12} className="text-brand-text-accent fill-brand-accent" />
                      4.8
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-bold text-brand-charcoal text-base mb-1">{merchant.name}</h3>
                    <p className="text-brand-text-accent text-xs mb-2 line-clamp-1">{merchant.category?.name || 'Restaurant'}</p>
                    <div className="flex items-center gap-4 text-xs text-brand-text-accent">
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        20-30 min
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin size={14} />
                        {merchant.deliveryRadiusKm || 5} km
                      </div>
                      {merchant.minimumOrderAmount > 0 && (
                        <div className="flex items-center gap-1 text-brand-text-accent/70">
                          Min ${merchant.minimumOrderAmount}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
            
            {filteredMerchants.length === 0 && !isLoading && (
              <div className="text-center py-10 text-brand-text-accent">
                No restaurants found.
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
}