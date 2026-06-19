'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, Calendar, Plane, Building2, ChevronRight, Clock, Search, SlidersHorizontal } from 'lucide-react';
import AuthGuard from '@/components/auth/AuthGuard';

export default function TripsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'unpaid' | 'refund' | 'review'>('upcoming');

  // Mock data for UI
  const mockTrips = {
    upcoming: [
      {
        id: 'TRP-101',
        type: 'FLIGHT',
        title: 'Yangon to Mandalay',
        date: 'Oct 15, 2026',
        status: 'CONFIRMED',
        airline: 'Myanmar National Airlines',
        flightNumber: 'UB-102',
        imageUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=500&q=80'
      },
      {
        id: 'TRP-102',
        type: 'HOTEL',
        title: 'Lotte Hotel Yangon',
        date: 'Nov 12 - Nov 15, 2026',
        status: 'BOOKED',
        roomInfo: '1x Deluxe Room, 2 Guests',
        location: 'Yangon, Myanmar',
        imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&q=80'
      }
    ],
    past: [
      {
        id: 'TRP-098',
        type: 'HOTEL',
        title: 'Aureum Palace Hotel & Resort',
        date: 'Jan 5 - Jan 8, 2026',
        status: 'COMPLETED',
        roomInfo: '1x Island Villa',
        location: 'Bagan, Myanmar',
        imageUrl: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=500&q=80'
      }
    ],
    unpaid: [],
    refund: [],
    review: []
  };

  const currentTrips = mockTrips[activeTab];

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#F5F5F7] pb-20 relative overflow-hidden">
        {/* Decorative ambient gradient for premium feel */}
        <div className="fixed top-0 left-0 right-0 h-full bg-gradient-to-b from-brand-orange/5 via-transparent to-brand-charcoal/5 pointer-events-none z-0"></div>

        {/* Header */}
        <div className="bg-brand-surface/90 backdrop-blur-xl sticky top-0 z-20 pt-safe-top shadow-sm border-b border-brand-text-accent/5">
          <div className="flex items-center justify-between mb-2 px-4 pt-2">
            <button onClick={() => router.back()} className="p-2 -ml-2 text-brand-charcoal">
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-lg font-bold text-brand-charcoal">My Trips</h1>
            <div className="w-8"></div> {/* Spacer */}
          </div>

          {/* Search and Filter Bar */}
          <div className="px-4 pb-2 mt-1">
            <div className="flex gap-2 items-center">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={16} className="text-brand-text-accent/60" />
                </div>
                <input 
                  type="text" 
                  placeholder="Search destination, hotel or flight..." 
                  className="w-full bg-brand-gray/50 text-brand-charcoal text-sm rounded-full pl-9 pr-4 py-2.5 outline-none focus:ring-1 focus:ring-brand-orange/50 transition-all border border-brand-text-accent/5 placeholder:text-brand-text-accent/60"
                />
              </div>
              <button className="w-10 h-10 bg-brand-gray/50 rounded-full flex items-center justify-center text-brand-charcoal border border-brand-text-accent/5 hover:bg-brand-gray transition-colors shrink-0">
                <SlidersHorizontal size={16} />
              </button>
            </div>
          </div>

          {/* Fixed Tabs Grid - Fits in one screen */}
          <div className="px-3 pb-3 mt-1">
            <div className="grid grid-cols-5 gap-1.5 bg-brand-gray/50 p-1 rounded-2xl">
              {[
                { id: 'upcoming', label: 'Up' },
                { id: 'unpaid', label: 'Unpaid' },
                { id: 'past', label: 'Past' },
                { id: 'review', label: 'Review' },
                { id: 'refund', label: 'Refund' },
              ].map((tab) => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all text-center flex items-center justify-center ${
                    activeTab === tab.id 
                      ? 'bg-white text-brand-orange shadow-sm border border-brand-text-accent/5' 
                      : 'text-brand-text-accent hover:text-brand-charcoal'
                  }`}
                >
                  <span className="line-clamp-1">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-3 flex flex-col gap-4 relative z-10 mt-2">
          {currentTrips.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-24 h-24 bg-brand-surface rounded-full flex items-center justify-center mb-6 text-brand-text-accent/30 shadow-inner">
                <Plane size={40} strokeWidth={1.5} />
              </div>
              <h2 className="text-xl font-serif font-bold text-brand-charcoal mb-2">No {activeTab} trips</h2>
              <p className="text-[15px] text-brand-text-accent mb-8 max-w-[250px] leading-relaxed">Your journey begins here. Discover amazing places to stay and fly.</p>
              <button onClick={() => router.push('/hotels')} className="bg-brand-charcoal text-white px-8 py-3.5 rounded-full font-bold text-sm shadow-[0_8px_20px_rgba(0,0,0,0.15)] active:scale-95 transition-all">
                Start Planning
              </button>
            </div>
          ) : (
            currentTrips.map((trip) => (
              <div key={trip.id} className="bg-brand-surface rounded-[20px] shadow-sm border border-brand-text-accent/5 cursor-pointer active:scale-[0.98] transition-transform relative">
                
                {/* 
                  Giant Type Icon & Corner Cutout Effect
                  We use a large absolute element positioned at top-left.
                  To create the "cutout" effect, we give it a solid background that matches the page background,
                  and then place the icon inside it. 
                */}
                <div className="absolute -top-3 -left-3 z-20 flex items-center justify-center">
                  {/* The outer circle creates the "cutout" mask matching the page background */}
                  <div className="w-16 h-16 bg-[#F5F5F7] rounded-full flex items-center justify-center">
                    {/* The inner circle is the actual icon container */}
                    <div className="w-12 h-12 bg-white shadow-md border border-brand-text-accent/10 rounded-full flex items-center justify-center text-brand-orange">
                      {trip.type === 'FLIGHT' ? <Plane size={24} /> : <Building2 size={24} />}
                    </div>
                  </div>
                </div>

                {/* Main Card Container with top-left border-radius specifically increased to accommodate the cutout visually if needed, though the absolute circle handles the visual masking */}
                <div className="overflow-hidden rounded-[20px]">
                  <div className="h-24 bg-gray-200 relative">
                    <img src={trip.imageUrl} alt={trip.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    
                    {/* Status Badge */}
                    <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                      {trip.status}
                    </div>

                    {/* Title Area (Moved slightly right to avoid overlapping with the giant icon) */}
                    <div className="absolute bottom-3 left-12 right-3 flex items-center gap-2 text-white">
                      <h3 className="font-bold text-[15px] leading-tight line-clamp-1">{trip.title}</h3>
                    </div>
                  </div>

                  <div className="p-3.5 pl-4">
                    <div className="flex justify-between items-center text-sm text-brand-charcoal">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-1.5 font-medium text-brand-orange">
                          <Calendar size={14} />
                          <span>{trip.date}</span>
                        </div>
                        <div className="text-brand-text-accent line-clamp-1 text-xs mt-0.5">
                          {trip.type === 'FLIGHT' ? (
                            <span>{(trip as any).airline} • <span className="font-mono font-bold text-brand-charcoal">{(trip as any).flightNumber}</span></span>
                          ) : (
                            <span className="flex items-center gap-1"><MapPin size={12} /> {(trip as any).location}</span>
                          )}
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-brand-text-accent shrink-0" />
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AuthGuard>
  );
}