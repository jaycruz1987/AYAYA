'use client';

import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useClientHotels } from '@/hooks/client/useClientHotels';
import { Star, MapPin, Search, Building2, Coffee, Wifi, Car, ChevronLeft, Target, ChevronDown, Calendar as CalendarIcon, Users, Plus, Minus, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import { DatePicker } from 'antd';

const { RangePicker } = DatePicker;

export default function HotelsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('overseas');
  const [location, setLocation] = useState('Chiang Mai');
  const [country, setCountry] = useState('Thailand');
  
  // Date State
  const [checkInDate, setCheckInDate] = useState(dayjs().add(1, 'day'));
  const [checkOutDate, setCheckOutDate] = useState(dayjs().add(3, 'day'));
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [pickerDates, setPickerDates] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([checkInDate, checkOutDate]);

  // Guest State
  const [rooms, setRooms] = useState(1);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [isGuestPickerOpen, setIsGuestPickerOpen] = useState(false);

  // Carousel State
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  const router = useRouter();
  const { data: hotels, isLoading } = useClientHotels();

  // Mock Ads Data
  const ads = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80",
      title: "SUMMER ESCAPE",
      subtitle: "Up to 20% Off Overseas Hotels"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&q=80",
      title: "ISLAND RESORTS",
      subtitle: "Book now, pay later"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800&q=80",
      title: "CITY STAYS",
      subtitle: "Free breakfast included"
    }
  ];

  // Auto-play Carousel
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % ads.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [ads.length]);

  // Handle Tab Change with Mock Data switch to show it's "working"
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    if (tabId === 'domestic') {
      setLocation('Yangon');
      setCountry('Myanmar');
    } else if (tabId === 'overseas') {
      setLocation('Chiang Mai');
      setCountry('Thailand');
    } else if (tabId === 'homestay') {
      setLocation('Bagan');
      setCountry('Myanmar');
    } else {
      setLocation('Mandalay');
      setCountry('Myanmar');
    }
  };

  const filteredHotels = (Array.isArray(hotels) ? hotels : [])?.filter((h: any) => 
    h.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (h.city && h.city.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  return (
    <MainLayout>
      <div className="bg-[#F1F6FA] min-h-screen">
        {/* Ctrip-style Hero Header with Ad Banner */}
        <div className="relative pt-safe-top min-h-[300px] bg-[#F1F6FA] overflow-hidden">
        {/* Ad Banner Carousel */}
        <div className="absolute inset-0 z-0 flex transition-transform duration-700 ease-in-out pointer-events-none" style={{ transform: `translateX(-${currentAdIndex * 100}%)` }}>
          {ads.map((ad, idx) => (
            <div key={ad.id} className="relative w-full h-full flex-shrink-0">
              <img 
                src={ad.image} 
                alt={ad.title} 
                className="w-full h-[240px] object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-[#F1F6FA] h-[260px]"></div>
            </div>
          ))}
        </div>

        {/* Top Nav Actions */}
        <div className="relative z-10 flex items-center justify-between px-4 py-2">
          <button onClick={() => router.back()} className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-white backdrop-blur-md">
            <ChevronLeft size={20} />
          </button>
          
          {/* Ad/Promo Badges (like Ctrip's top right icons) */}
          <div className="flex items-center gap-2">
            <div className="bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center shadow-sm">
              <Star size={10} className="mr-1 fill-white" /> Special Offer
            </div>
          </div>
        </div>

        {/* Decorative Ad Text */}
        <div className="relative z-10 px-6 pt-2 pb-10 text-white text-shadow-sm min-h-[90px]">
          <h1 
            key={ads[currentAdIndex].title}
            className="text-4xl font-black italic tracking-wider mb-1 animate-in slide-in-from-right-4 fade-in duration-500" 
            style={{ textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}
          >
            {ads[currentAdIndex].title}
          </h1>
          <p 
            key={ads[currentAdIndex].subtitle}
            className="text-sm font-bold bg-white/20 backdrop-blur-sm inline-block px-3 py-1 rounded-full animate-in slide-in-from-left-4 fade-in duration-500 delay-100" 
            style={{ textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}
          >
            {ads[currentAdIndex].subtitle}
          </p>
          
          {/* Carousel Indicators */}
          <div className="absolute right-6 bottom-8 flex gap-1.5">
            {ads.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentAdIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/50'}`}
              />
            ))}
          </div>
        </div>

        {/* Search & Booking Card */}
        <div className="relative z-20 -mt-2 px-4">
          
          {/* Bookmark Tabs Container */}
          <div className="flex items-end relative z-10 w-full">
            {[
              { id: 'domestic', label: 'Domestic' },
              { id: 'overseas', label: 'Overseas' },
              { id: 'homestay', label: 'Homestay' },
              { id: 'hourly', label: 'Hourly' }
            ].map((tab, index, array) => {
              const isActive = activeTab === tab.id;
              const isFirst = index === 0;
              const isLast = index === array.length - 1;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`
                    relative flex-1 text-center transition-all duration-300 flex flex-col justify-center items-center
                    ${isActive 
                      ? 'h-[48px] font-black text-[#2D68FF] bg-white z-20 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]' 
                      : 'h-[40px] font-medium text-brand-charcoal/80 bg-white/70 hover:bg-white/90 backdrop-blur-md z-0'
                    }
                  `}
                  style={{
                    borderTopLeftRadius: isFirst ? '16px' : isActive ? '16px' : '10px',
                    borderTopRightRadius: isLast ? '16px' : isActive ? '16px' : '10px',
                  }}
                >
                  <span className={`text-[15px] ${isActive ? 'mb-1' : ''}`}>{tab.label}</span>
                  {/* Active Indicator line */}
                  {isActive && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-[3px] bg-[#2D68FF] rounded-t-full"></div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Main Card Body */}
          <div className="bg-white shadow-[0_8px_30px_rgba(0,0,0,0.08)] relative z-10 px-4 py-3 rounded-b-2xl rounded-t-none -mt-[1px] mb-6">
              {/* Location Row */}
              <div className="flex items-center gap-3 border-b border-gray-100 pb-3 mb-3 cursor-pointer hover:bg-gray-50/50 transition-colors">
                <div className="flex flex-col flex-1">
                  <span className="text-[11px] text-gray-400 font-semibold mb-0.5 tracking-wide">{country}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[26px] font-black text-brand-charcoal tracking-tight">{location}</span>
                    <ChevronDown size={18} className="text-gray-400 mt-1" strokeWidth={2.5} />
                  </div>
                </div>
                
                <div className="w-[1px] h-10 bg-gray-200"></div>
                
                <div className="flex items-center gap-1.5 pl-3">
                  <div className="w-8 h-8 rounded-full bg-[#F0F6FF] flex items-center justify-center">
                    <Target size={18} className="text-[#2D68FF]" strokeWidth={2.5} />
                  </div>
                  <span className="text-[13px] font-bold text-[#2D68FF]">My<br/>Location</span>
                </div>
              </div>

              {/* Dates Row with Inline Dropdown */}
              <div className="relative">
                <div 
                  className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3 cursor-pointer hover:bg-gray-50/50 transition-colors"
                  onClick={() => {
                    setPickerDates([checkInDate, checkOutDate]);
                    setIsDatePickerOpen(!isDatePickerOpen);
                    setIsGuestPickerOpen(false);
                  }}
                >
                  <div className="flex flex-col">
                    <span className="text-[11px] text-gray-400 font-semibold mb-0.5 tracking-wide">Check In</span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-[22px] font-black text-brand-charcoal">{checkInDate.format('MMM DD')}</span>
                      <span className="text-xs text-brand-charcoal font-bold">{checkInDate.format('ddd')}</span>
                    </div>
                  </div>
                  
                  <div className="px-3 py-0.5 rounded-full border border-gray-200 text-[11px] text-brand-charcoal font-bold bg-gray-50 flex items-center gap-1">
                  {Math.max(1, checkOutDate.diff(checkInDate, 'day'))} Nights
                  <ChevronDown size={12} className={`transition-transform duration-200 ${isDatePickerOpen ? 'rotate-180' : ''}`} />
                </div>

                  <div className="flex flex-col items-end">
                    <span className="text-[11px] text-gray-400 font-semibold mb-0.5 tracking-wide">Check Out</span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-[22px] font-black text-brand-charcoal">{checkOutDate.format('MMM DD')}</span>
                      <span className="text-xs text-brand-charcoal font-bold">{checkOutDate.format('ddd')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Guests Row with Inline Dropdown */}
              <div className="relative">
                <div 
                  className="flex items-center justify-between pb-1 cursor-pointer hover:bg-gray-50/50 transition-colors"
                  onClick={() => {
                    setIsGuestPickerOpen(!isGuestPickerOpen);
                    setIsDatePickerOpen(false);
                  }}
                >
                  <div className="flex items-center gap-1.5">
                    {activeTab === 'hourly' ? (
                      <span className="text-[16px] font-bold text-brand-charcoal">2 Hours, {adults} Adult</span>
                    ) : (
                      <span className="text-[16px] font-bold text-brand-charcoal">{rooms} Room, {adults} Adult, {children} Child</span>
                    )}
                    <ChevronDown size={18} className={`text-gray-400 transition-transform duration-200 ${isGuestPickerOpen ? 'rotate-180' : ''}`} strokeWidth={2.5} />
                  </div>
                  <div className="text-[14px] font-semibold text-gray-400 flex items-center gap-1">
                    Price/Star <ChevronDown size={14} strokeWidth={2.5} />
                  </div>
                </div>
              </div>

              {/* Search Button */}
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  router.push(`/hotels/search?location=${encodeURIComponent(location)}`);
                }}
                className="w-full mt-1 bg-gradient-to-r from-[#FF8C69] to-[#F15A4A] text-white font-bold text-lg py-3 rounded-xl shadow-lg shadow-orange-500/30 active:scale-[0.98] transition-transform"
              >
                Search
              </button>
            </div>
          </div>
        </div>

      {/* Popular Hotels Section */}
      <div className="px-4 pb-4 bg-[#F1F6FA] relative z-10 -mt-2">
        <h2 className="font-bold text-lg mb-4 text-brand-charcoal">Popular Hotels in Chiang Mai</h2>

        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-orange"></div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filteredHotels.map((hotel: any) => (
              <Link href={`/hotels/${hotel.id}`} key={hotel.id}>
                <div className="bg-brand-surface rounded-2xl overflow-hidden shadow-brand border border-transparent hover:border-brand-orange/30 transition-colors">
                  <div className="h-40 bg-brand-gray relative">
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
                    <div className="absolute top-2 right-2 bg-brand-surface px-2 py-1 rounded-full flex items-center gap-1 text-xs font-bold shadow-sm">
                      <Star size={12} className="text-brand-text-accent fill-brand-accent" />
                      4.9
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-brand-charcoal text-lg line-clamp-1 flex-1 pr-2">{hotel.name}</h3>
                      {hotel.roomTypes && hotel.roomTypes.length > 0 && (
                        <div className="text-right shrink-0">
                          <span className="text-xs text-brand-text-accent">from</span>
                          <div className="font-bold text-brand-orange">
                            ${Math.min(...hotel.roomTypes.map((rt: any) => Number(rt.basePrice)))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-1 text-brand-text-accent text-sm mb-3">
                      <MapPin size={14} />
                      <span className="line-clamp-1">{hotel.addressLine} {hotel.city ? `, ${hotel.city}` : ''}</span>
                    </div>

                    <div className="flex gap-3 text-brand-text-accent/70">
                      <div className="w-8 h-8 rounded-full bg-brand-gray flex items-center justify-center">
                        <Wifi size={14} />
                      </div>
                      <div className="w-8 h-8 rounded-full bg-brand-gray flex items-center justify-center">
                        <Coffee size={14} />
                      </div>
                      <div className="w-8 h-8 rounded-full bg-brand-gray flex items-center justify-center">
                        <Car size={14} />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
            
            {filteredHotels.length === 0 && !isLoading && (
              <div className="text-center py-10 text-brand-text-accent flex flex-col items-center">
                <Building2 size={48} className="text-brand-text-accent/30 mb-4" />
                <p>No hotels found matching your search.</p>
              </div>
            )}
          </div>
        )}
      </div>
      </div>
      {/* Bottom Modals for Selection (Refactored to Drawer-style for better mobile UX) */}
      
      {/* Date Picker Overlay */}
      {isDatePickerOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-end items-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setIsDatePickerOpen(false)}>
          <div className="bg-white w-full max-w-md rounded-t-3xl overflow-hidden animate-in slide-in-from-bottom-8 duration-300 relative pb-safe" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-white sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <h3 className="font-bold text-lg text-brand-charcoal">Select Dates</h3>
                {pickerDates[0] && (
                  <span className="text-[11px] font-bold text-[#2D68FF] bg-[#F0F6FF] px-2 py-0.5 rounded-full border border-[#2D68FF]/20 animate-in fade-in duration-200">
                    {pickerDates[0].format('MMM DD')} 
                    {pickerDates[1] ? ` - ${pickerDates[1].format('MMM DD')}` : ''}
                  </span>
                )}
              </div>
              <button onClick={() => setIsDatePickerOpen(false)} className="p-1 rounded-full bg-gray-100 text-gray-500">
                <X size={20} />
              </button>
            </div>
            
            {/* Scrollable calendar container */}
            <div className="max-h-[60vh] overflow-y-auto px-4 pb-4">
              <div className="relative w-full flex justify-center pt-2">
                <RangePicker 
                  open={true}
                  value={pickerDates as any}
                  onCalendarChange={(dates, dateStrings, info) => {
                    // Cyclical 3-click selection flow
                    if (pickerDates[0] && pickerDates[1]) {
                      // If both dates are already selected and user clicks a third time,
                      // we completely reset and start a new selection with just the clicked date.
                      
                      // In Ant Design, when both dates are selected and you click again,
                      // the `info.range` tells us which end of the range was modified.
                      // The new value will be in `dates` at that corresponding index.
                      const newDate = info.range === 'start' ? dates?.[0] : dates?.[1];
                      
                      setPickerDates([newDate || null, null]);
                    } else {
                      setPickerDates(dates as any);
                    }
                  }}
                  disabledDate={(current) => current && current < dayjs().startOf('day')}
                  getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
                  className="absolute opacity-0 pointer-events-none" 
                  classNames={{ popup: '!z-[100] custom-range-picker !static !shadow-none' }}
                  style={{ width: 0, height: 0, overflow: 'hidden' }}
                />
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-100 bg-white flex items-center justify-between gap-3">
              <button 
                onClick={() => {
                  if (pickerDates[0] && pickerDates[1]) {
                    // Ensure checkOut is strictly after checkIn
                    const diff = pickerDates[1].diff(pickerDates[0], 'day');
                    if (diff <= 0) {
                      setCheckInDate(pickerDates[0]);
                      setCheckOutDate(pickerDates[0].add(1, 'day'));
                    } else {
                      setCheckInDate(pickerDates[0]);
                      setCheckOutDate(pickerDates[1]);
                    }
                    setIsDatePickerOpen(false);
                  } else if (pickerDates[0]) {
                    // If they only picked one date and clicked confirm, auto-set checkout to next day
                    setCheckInDate(pickerDates[0]);
                    setCheckOutDate(pickerDates[0].add(1, 'day'));
                    setIsDatePickerOpen(false);
                  }
                }}
                className={`w-full text-white font-bold py-3.5 rounded-xl text-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 ${
                  pickerDates[0] ? 'bg-[#2D68FF] shadow-[0_4px_14px_rgba(45,104,255,0.4)]' : 'bg-gray-300 pointer-events-none'
                }`}
              >
                <span>{(!pickerDates[0] || !pickerDates[1] || pickerDates[1].diff(pickerDates[0], 'day') <= 0) ? 'Select Checkout Date' : 'Confirm Dates'}</span>
                {pickerDates[0] && pickerDates[1] && pickerDates[1].diff(pickerDates[0], 'day') > 0 && (
                  <span className="text-[13px] font-black bg-white/90 text-[#2D68FF] px-2.5 py-0.5 rounded shadow-sm backdrop-blur-md tracking-wide">
                    {pickerDates[1].diff(pickerDates[0], 'day')} Nights
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Guest Picker Overlay */}
      {isGuestPickerOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-end items-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setIsGuestPickerOpen(false)}>
          <div className="bg-white w-full max-w-md rounded-t-3xl overflow-hidden animate-in slide-in-from-bottom-8 duration-300 relative pb-safe" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center p-4 border-b border-gray-100">
              <h3 className="font-bold text-lg text-brand-charcoal">Guests & Rooms</h3>
              <button onClick={() => setIsGuestPickerOpen(false)} className="p-1 rounded-full bg-gray-100 text-gray-500">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-5 flex flex-col gap-6">
              {/* Rooms */}
              {activeTab !== 'hourly' && (
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-brand-charcoal text-base">Rooms</h4>
                  </div>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setRooms(Math.max(1, rooms - 1))}
                      className={`w-8 h-8 rounded-full border flex items-center justify-center ${rooms <= 1 ? 'border-gray-200 text-gray-300' : 'border-[#2D68FF] text-[#2D68FF]'}`}
                    >
                      <Minus size={16} />
                    </button>
                    <span className="font-bold text-lg w-4 text-center">{rooms}</span>
                    <button 
                      onClick={() => setRooms(rooms + 1)}
                      className="w-8 h-8 rounded-full border border-[#2D68FF] text-[#2D68FF] flex items-center justify-center"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* Adults */}
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-brand-charcoal text-base">Adults</h4>
                  <p className="text-xs text-gray-400 mt-0.5">12+ years</p>
                </div>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setAdults(Math.max(1, adults - 1))}
                    className={`w-8 h-8 rounded-full border flex items-center justify-center ${adults <= 1 ? 'border-gray-200 text-gray-300' : 'border-[#2D68FF] text-[#2D68FF]'}`}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="font-bold text-lg w-4 text-center">{adults}</span>
                  <button 
                    onClick={() => setAdults(adults + 1)}
                    className="w-8 h-8 rounded-full border border-[#2D68FF] text-[#2D68FF] flex items-center justify-center"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Children */}
              {activeTab !== 'hourly' && (
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-brand-charcoal text-base">Children</h4>
                    <p className="text-xs text-gray-400 mt-0.5">0-11 years</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setChildren(Math.max(0, children - 1))}
                      className={`w-8 h-8 rounded-full border flex items-center justify-center ${children <= 0 ? 'border-gray-200 text-gray-300' : 'border-[#2D68FF] text-[#2D68FF]'}`}
                    >
                      <Minus size={16} />
                    </button>
                    <span className="font-bold text-lg w-4 text-center">{children}</span>
                    <button 
                      onClick={() => setChildren(children + 1)}
                      className="w-8 h-8 rounded-full border border-[#2D68FF] text-[#2D68FF] flex items-center justify-center"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-100">
              <button 
                onClick={() => setIsGuestPickerOpen(false)}
                className="w-full bg-[#2D68FF] text-white font-bold py-3.5 rounded-xl text-lg shadow-[0_4px_14px_rgba(45,104,255,0.4)] active:scale-[0.98] transition-transform"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

    </MainLayout>
  );
}