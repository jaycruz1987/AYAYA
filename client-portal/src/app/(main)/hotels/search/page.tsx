'use client';

import React, { Suspense } from 'react';
import MainLayout from '@/components/layout/MainLayout';
// import { useClientHotels } from '@/hooks/client/useClientHotels'; // Temporarily disabled to fix require error
import { Star, MapPin, Building2, Wifi, Coffee, Car, ChevronLeft, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

function HotelSearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const locationParam = searchParams.get('location') || 'Chiang Mai';
  
  // const { data: hotels, isLoading } = useClientHotels(); // Temporarily disabled
  const isLoading = false;
  const hotels: any[] = [];

  // MOCK DATA for testing when real API data is empty or missing
  const mockHotels = [
    {
      id: 'mock-1',
      name: 'Grand Horizon Resort & Spa',
      city: locationParam,
      addressLine: '123 Beachfront Avenue, Coastal District',
      coverImageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
      rating: 4.9,
      reviews: 1284,
      roomTypes: [{ basePrice: 185 }]
    },
    {
      id: 'mock-2',
      name: 'The Artisan Boutique Hotel',
      city: locationParam,
      addressLine: '88 Heritage Street, Old Town',
      coverImageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80',
      rating: 4.7,
      reviews: 856,
      roomTypes: [{ basePrice: 120 }]
    },
    {
      id: 'mock-3',
      name: 'Skyline City Suites',
      city: locationParam,
      addressLine: '500 Downtown Boulevard',
      coverImageUrl: 'https://images.unsplash.com/photo-1551882547-ff40c0d5b5df?w=800&q=80',
      rating: 4.5,
      reviews: 432,
      roomTypes: [{ basePrice: 95 }]
    }
  ];

  const apiHotels = (Array.isArray(hotels) ? hotels : [])?.filter((h: any) => 
    h.city?.toLowerCase().includes(locationParam.toLowerCase()) ||
    h.name?.toLowerCase().includes(locationParam.toLowerCase())
  );

  // Use API data if available, otherwise fall back to mock data for testing
  const filteredHotels = apiHotels.length > 0 ? apiHotels : mockHotels;

  return (
    <MainLayout>
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-100 pb-2">
        <div className="flex items-center justify-between px-4 pt-safe-top pb-2 h-14">
          <button onClick={() => router.back()} className="w-8 h-8 flex items-center justify-center -ml-2 text-brand-charcoal">
            <ChevronLeft size={24} />
          </button>
          
          <div className="flex-1 px-4">
            <div className="bg-gray-100 rounded-full px-4 py-2 text-center shadow-inner">
              <span className="text-[15px] font-bold text-brand-charcoal">{locationParam}</span>
              <span className="text-[11px] text-gray-500 block mt-0.5 font-medium">Mar 25 - Mar 27 • 1 Room, 1 Adult</span>
            </div>
          </div>

          <div className="w-8"></div> {/* Spacer for centering */}
        </div>

        {/* Filter/Sort Bar */}
        <div className="flex items-center justify-between px-6 py-2">
          <div className="flex gap-6">
            <button className="flex items-center gap-1 text-[13px] font-bold text-brand-charcoal">
              Sort <ArrowUpDown size={14} className="text-gray-400" />
            </button>
            <button className="flex items-center gap-1 text-[13px] font-bold text-brand-charcoal">
              Price/Star <ArrowUpDown size={14} className="text-gray-400" />
            </button>
          </div>
          <button className="flex items-center gap-1.5 text-[13px] font-bold text-brand-charcoal">
            <SlidersHorizontal size={14} /> Filter
          </button>
        </div>
      </div>

      {/* List Container */}
      <div className="p-4 bg-[#F1F6FA] min-h-screen">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-orange"></div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <h2 className="font-bold text-brand-charcoal mb-1">
              {filteredHotels.length} {filteredHotels.length === 1 ? 'Hotel' : 'Hotels'} found
            </h2>

            {filteredHotels.map((hotel: any) => (
              <div 
                key={hotel.id}
                onClick={() => router.push(`/hotels/${hotel.id}`)}
                className="bg-brand-surface rounded-2xl overflow-hidden shadow-sm border border-transparent hover:border-brand-orange/30 transition-colors cursor-pointer"
              >
                <div className="h-44 bg-brand-gray relative">
                    {hotel.coverImageUrl ? (
                      <img 
                        src={hotel.coverImageUrl} 
                        alt={hotel.name} 
                        className="w-full h-full object-cover" 
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-brand-text-accent/70">
                        <Building2 size={32} />
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1 text-xs font-bold shadow-sm text-brand-charcoal">
                      <Star size={12} className="text-[#FF8C69] fill-[#FF8C69]" />
                      {hotel.rating || '4.9'}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-brand-charcoal text-[17px] line-clamp-1 flex-1 pr-2">{hotel.name}</h3>
                      {hotel.roomTypes && hotel.roomTypes.length > 0 && (
                        <div className="text-right shrink-0">
                          <span className="text-[11px] text-gray-400 font-medium">from</span>
                          <div className="font-black text-[18px] text-[#F15A4A]">
                            ${Math.min(...hotel.roomTypes.map((rt: any) => Number(rt.basePrice)))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-1 text-gray-500 text-[13px] mb-2">
                      <MapPin size={14} />
                      <span className="line-clamp-1">{hotel.addressLine} {hotel.city ? `, ${hotel.city}` : ''}</span>
                    </div>

                    {hotel.reviews && (
                      <div className="text-[11px] text-gray-400 font-medium mb-4">
                        <span className="text-[#2D68FF] font-bold">{hotel.reviews}</span> reviews
                      </div>
                    )}

                    <div className="flex gap-2">
                      <span className="text-[10px] font-bold px-2 py-1 bg-[#F0F6FF] text-[#2D68FF] rounded">Free Cancellation</span>
                      <span className="text-[10px] font-bold px-2 py-1 bg-green-50 text-green-600 rounded">Breakfast Included</span>
                    </div>
                  </div>
              </div>
            ))}
            
            {filteredHotels.length === 0 && (
              <div className="text-center py-20 text-brand-text-accent flex flex-col items-center bg-white rounded-2xl">
                <Building2 size={48} className="text-brand-text-accent/30 mb-4" />
                <p className="font-bold text-brand-charcoal mb-1">No hotels found</p>
                <p className="text-sm">Try changing your destination or dates.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default function HotelSearchPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-orange"></div>
      </div>
    }>
      <HotelSearchContent />
    </Suspense>
  );
}
