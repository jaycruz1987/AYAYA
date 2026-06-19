'use client';

import MainLayout from '@/components/layout/MainLayout';
import { Search, MapPin, ChevronRight, Utensils, Building2, Coffee, Ticket, Star, Clock, Plane, Train, Car, Tent, TicketPercent, Navigation, Trees, Bus, Shield } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <MainLayout>
      {/* Header / Location (Restored Theme, New Layout) */}
      <div className="bg-linear-to-r from-brand-orange to-brand-accent text-white px-4 pt-safe-top pb-6 rounded-b-3xl relative z-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between mb-2 mt-2">
          {/* Platform Logo (Left) */}
          <div className="flex items-center gap-1.5">
            <span className="text-2xl">🌍</span>
            <span className="font-bold text-xl tracking-tight">Citylink</span>
          </div>
          
          {/* Current Location (Right) */}
          <div className="flex items-center gap-2 bg-white/10 rounded-full pl-2 pr-3 py-1.5 backdrop-blur-sm border border-white/10 shadow-sm cursor-pointer hover:bg-white/20 transition-colors">
            <div className="w-6 h-6 rounded-full bg-white/20 text-white flex items-center justify-center">
              <MapPin size={12} />
            </div>
            <div className="text-xs font-bold text-white flex items-center gap-1">
              Current Location <ChevronRight size={14} className="text-white/80" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Categories Grid (Premium Version) */}
      <div className="px-3 py-4 -mt-6 relative z-20">
        <div className="bg-white rounded-2xl p-3.5 shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-brand-text-accent/5">
          {/* Top Row - Premium Gradient Cards */}
          <div className="grid grid-cols-5 gap-2 mb-3.5">
            {/* Food */}
            <Link href="/food" className="col-span-1 aspect-[3.5/4] rounded-[14px] bg-gradient-to-br from-[#FF9A44] to-[#FC6076] flex flex-col items-center justify-center text-white relative overflow-hidden group shadow-sm">
              <div className="absolute top-0 right-0 w-12 h-12 bg-white/20 rounded-full -mr-4 -mt-4 blur-xl"></div>
              <div className="mb-1.5 group-hover:scale-110 transition-transform">
                <Utensils size={28} strokeWidth={1.5} />
              </div>
              <span className="text-[11px] font-bold tracking-wide">Food</span>
            </Link>

            {/* Hotel */}
            <Link href="/hotels" className="col-span-1 aspect-[3.5/4] rounded-[14px] bg-gradient-to-br from-[#4E65FF] to-[#92EFFD] flex flex-col items-center justify-center text-white relative overflow-hidden group shadow-sm">
              <div className="absolute top-0 right-0 w-12 h-12 bg-white/20 rounded-full -mr-4 -mt-4 blur-xl"></div>
              <div className="mb-1.5 group-hover:scale-110 transition-transform">
                <Building2 size={28} strokeWidth={1.5} />
              </div>
              <span className="text-[11px] font-bold tracking-wide">Hotel</span>
            </Link>

            {/* Flight */}
            <Link href="/flights" className="col-span-1 aspect-[3.5/4] rounded-[14px] bg-gradient-to-br from-[#11998E] to-[#38EF7D] flex flex-col items-center justify-center text-white relative overflow-hidden group shadow-sm">
              <div className="absolute top-0 right-0 w-12 h-12 bg-white/20 rounded-full -mr-4 -mt-4 blur-xl"></div>
              <div className="mb-1.5 group-hover:scale-110 transition-transform">
                <Plane size={28} strokeWidth={1.5} />
              </div>
              <span className="text-[11px] font-bold tracking-wide">Flight</span>
            </Link>

            {/* Train */}
            <Link href="/trains" className="col-span-1 aspect-[3.5/4] rounded-[14px] bg-gradient-to-br from-[#B06AB3] to-[#4568DC] flex flex-col items-center justify-center text-white relative overflow-hidden group shadow-sm">
              <div className="absolute top-0 right-0 w-12 h-12 bg-white/20 rounded-full -mr-4 -mt-4 blur-xl"></div>
              <div className="mb-1.5 group-hover:scale-110 transition-transform">
                <Train size={28} strokeWidth={1.5} />
              </div>
              <span className="text-[11px] font-bold tracking-wide">Train</span>
            </Link>

            {/* Tours */}
            <Link href="/tours" className="col-span-1 aspect-[3.5/4] rounded-[14px] bg-gradient-to-br from-[#FF512F] to-[#DD2476] flex flex-col items-center justify-center text-white relative overflow-hidden group shadow-sm">
              <div className="absolute top-0 right-0 w-12 h-12 bg-white/20 rounded-full -mr-4 -mt-4 blur-xl"></div>
              <div className="mb-1.5 group-hover:scale-110 transition-transform">
                <Trees size={28} strokeWidth={1.5} />
              </div>
              <span className="text-[11px] font-bold tracking-wide">Tours</span>
            </Link>
          </div>

          {/* Bottom Row - Small Icons */}
          <div className="grid grid-cols-5 gap-2 pt-2 border-t border-brand-text-accent/5">
            <Link href="/homestay" className="flex flex-col items-center justify-center gap-1 group">
              <div className="text-[#F15A4A] group-hover:scale-110 transition-transform"><Tent size={24} /></div>
              <span className="text-[10px] text-brand-charcoal text-center leading-tight">Homestay</span>
            </Link>
            <Link href="/activities" className="flex flex-col items-center justify-center gap-1 group">
              <div className="text-[#FF9B26] group-hover:scale-110 transition-transform"><Navigation size={24} /></div>
              <span className="text-[10px] text-brand-charcoal text-center leading-tight">Activities</span>
            </Link>
            <Link href="/airport-transfer" className="flex flex-col items-center justify-center gap-1 group">
              <div className="text-[#3B7FFF] group-hover:scale-110 transition-transform"><Bus size={24} /></div>
              <span className="text-[10px] text-brand-charcoal text-center leading-tight">Transfer</span>
            </Link>
            <Link href="/car-rental" className="flex flex-col items-center justify-center gap-1 group">
              <div className="text-[#8052FF] group-hover:scale-110 transition-transform"><Car size={24} /></div>
              <span className="text-[10px] text-brand-charcoal text-center leading-tight">Car Rental</span>
            </Link>
            <Link href="/group-tour" className="flex flex-col items-center justify-center gap-1 group">
              <div className="text-[#2EAF7D] group-hover:scale-110 transition-transform"><MapPin size={24} /></div>
              <span className="text-[10px] text-brand-charcoal text-center leading-tight">Group Tour</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Search Bar (Moved above Today's Deals) */}
      <div className="px-4 mb-6">
        <div className="bg-brand-surface rounded-2xl flex items-center px-4 py-3.5 shadow-brand border border-brand-text-accent/5">
          <Search size={20} className="text-brand-text-accent/70 mr-3 shrink-0" />
          <input 
            type="text" 
            placeholder="Search food, hotels, or flights..." 
            className="flex-1 bg-transparent outline-none text-brand-charcoal placeholder-brand-text-accent/50 text-sm font-medium"
          />
        </div>
      </div>

      {/* Today's Deals (New Section) */}
      <div className="mb-8">
        <div className="flex justify-between items-end px-4 mb-4">
          <div>
            <h2 className="text-lg font-bold text-brand-charcoal">Today's Deals</h2>
            <p className="text-xs text-brand-text-accent">Limited time offers near you</p>
          </div>
          <Link href="/food" className="text-brand-orange text-xs font-bold mb-1">See All</Link>
        </div>
        
        <div className="flex gap-4 overflow-x-auto px-4 pb-2 scrollbar-hide">
          {[
            { id: 1, title: 'Signature Beef Burger', price: '$12.99', oldPrice: '$16.50', img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80' },
            { id: 2, title: 'Spicy Salmon Sushi', price: '$18.50', oldPrice: '$24.00', img: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&q=80' },
            { id: 3, title: 'Margherita Pizza', price: '$14.00', oldPrice: '$19.99', img: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=500&q=80' }
          ].map((item) => (
            <Link href="/food" key={item.id} className="w-48 shrink-0 bg-brand-surface rounded-2xl overflow-hidden shadow-brand border border-transparent group">
              <div className="h-28 bg-gray-200 relative overflow-hidden">
                <img 
                  src={item.img} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60"></div>
                <div className="absolute top-2 left-2 bg-rose-500 text-white px-2 py-1 rounded text-xs font-bold shadow-sm">
                  -20%
                </div>
              </div>
              <div className="p-3">
                <h3 className="font-bold text-brand-charcoal text-sm mb-1 truncate">{item.title}</h3>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-brand-orange text-sm">{item.price}</span>
                  <span className="text-xs text-brand-text-accent line-through">{item.oldPrice}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Hotels */}
      <div className="mb-8">
        <div className="flex justify-between items-end px-4 mb-4">
          <div>
            <h2 className="text-lg font-bold text-brand-charcoal">Featured Stays</h2>
            <p className="text-xs text-brand-text-accent">Top rated hotels and resorts</p>
          </div>
          <Link href="/hotels" className="text-brand-orange text-xs font-bold mb-1">See All</Link>
        </div>
        
        <div className="flex gap-4 overflow-x-auto px-4 pb-2 scrollbar-hide">
          {[
            { id: 1, title: 'Aureum Palace Resort', price: '$149', loc: 'Bagan, Myanmar', img: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80', rating: '4.9' },
            { id: 2, title: 'Lotte Hotel Yangon', price: '$199', loc: 'Yangon, Myanmar', img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80', rating: '4.8' }
          ].map((item) => (
            <Link href="/hotels" key={item.id} className="w-72 shrink-0 bg-brand-surface rounded-2xl overflow-hidden shadow-brand border border-transparent group">
              <div className="h-40 bg-gray-200 relative overflow-hidden">
                <img 
                  src={item.img} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 text-xs font-bold shadow-sm">
                  <Star size={12} className="text-brand-orange fill-brand-orange" />
                  {item.rating}
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-brand-charcoal text-base">{item.title}</h3>
                  <div className="text-right">
                    <span className="text-[10px] text-brand-text-accent uppercase">from</span>
                    <div className="font-bold text-brand-orange">{item.price}</div>
                  </div>
                </div>
                <p className="text-brand-text-accent text-xs mb-3 flex items-center gap-1">
                  <MapPin size={12} /> {item.loc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      {/* Recommended Restaurants */}
      <div className="mb-8">
        <div className="flex justify-between items-end px-4 mb-4">
          <div>
            <h2 className="text-lg font-bold text-brand-charcoal">Recommended For You</h2>
            <p className="text-xs text-brand-text-accent">Popular spots near your location</p>
          </div>
          <Link href="/food" className="text-brand-orange text-xs font-bold mb-1">See All</Link>
        </div>
        
        <div className="flex gap-4 overflow-x-auto px-4 pb-2 scrollbar-hide">
          {[
            { id: 1, title: 'The Golden Grill', tags: 'Steakhouse • Western', time: '20-30 min', dist: '1.2 km', rating: '4.8', img: 'https://images.unsplash.com/photo-1544025162-836829988220?w=600&q=80' },
            { id: 2, title: 'Noodle House', tags: 'Asian • Noodles', time: '15-25 min', dist: '0.8 km', rating: '4.7', img: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&q=80' },
            { id: 3, title: 'Healthy Greens', tags: 'Salads • Vegan', time: '10-20 min', dist: '0.5 km', rating: '4.9', img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80' }
          ].map((item) => (
            <Link href="/food" key={item.id} className="w-64 shrink-0 bg-brand-surface rounded-2xl overflow-hidden shadow-brand border border-transparent group">
              <div className="h-32 bg-gray-200 relative overflow-hidden">
                <img 
                  src={item.img} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-50"></div>
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 text-xs font-bold shadow-sm">
                  <Star size={12} className="text-brand-orange fill-brand-orange" />
                  {item.rating}
                </div>
              </div>
              <div className="p-3">
                <h3 className="font-bold text-brand-charcoal text-base mb-1">{item.title}</h3>
                <p className="text-brand-text-accent text-xs mb-2">{item.tags}</p>
                <div className="flex items-center gap-3 text-xs text-brand-text-accent">
                  <div className="flex items-center gap-1">
                    <Clock size={12} /> {item.time}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin size={12} /> {item.dist}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
