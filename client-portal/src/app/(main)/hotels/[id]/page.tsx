'use client';

import React, { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// import { useClientHotelDetails } from '@/hooks/client/useClientHotels'; // Temporarily disabled to avoid API errors
import { ChevronLeft, Star, MapPin, Building2, Users, BedDouble, Expand, Wifi, Coffee, Phone, X, Wind, Monitor, Bath } from 'lucide-react';
import Link from 'next/link';

export default function HotelDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  // const { data: hotel, isLoading } = useClientHotelDetails(resolvedParams.id);
  
  // Mock Data logic for testing UI
  const [hotel, setHotel] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch delay
    const timer = setTimeout(() => {
      setHotel({
        id: resolvedParams.id,
        name: 'Grand Horizon Resort & Spa',
        city: 'Chiang Mai',
        addressLine: '123 Beachfront Avenue, Coastal District',
        coverImageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
        contactPhone: '+1234567890',
        roomTypes: [
          {
            id: 'rt-1',
            name: 'Ocean View Suite',
            basePrice: 185,
            maxOccupancy: 2,
            bedType: '1 King Bed',
            roomSizeSqm: 45,
            description: 'Enjoy panoramic ocean views from your private balcony. Features luxury amenities and premium bedding.',
            coverImageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80'
          },
          {
            id: 'rt-2',
            name: 'Family Garden Villa',
            basePrice: 250,
            maxOccupancy: 4,
            bedType: '2 Queen Beds',
            roomSizeSqm: 65,
            description: 'Spacious villa with direct garden access, perfect for families. Includes a small kitchenette.',
            coverImageUrl: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&q=80'
          }
        ]
      });
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [resolvedParams.id]);

  const [selectedRoom, setSelectedRoom] = useState<any>(null);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-gray flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-orange"></div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="min-h-screen bg-brand-gray flex flex-col justify-center items-center p-4">
        <h2 className="text-xl font-bold mb-4">Hotel not found</h2>
        <button onClick={() => router.back()} className="text-brand-orange bg-brand-orange-light px-4 py-2 rounded-full">
          Go Back
        </button>
      </div>
    );
  }

  const roomTypes: any[] = (hotel as any).roomTypes || [];

  return (
    <div className="min-h-screen bg-brand-gray pb-24">
      {/* Header Image */}
      <div className="relative h-64 bg-brand-gray border border-brand-text-accent/20">
        {(hotel as any).coverImageUrl ? (
          <img 
            src={(hotel as any).coverImageUrl} 
            alt={(hotel as any).name} 
            className="w-full h-full object-cover" 
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-brand-text-accent/70">
            <Building2 size={48} />
          </div>
        )}
        <div className="absolute top-0 left-0 right-0 p-4 pt-safe-top flex justify-between items-center bg-linear-to-b from-black/50 to-transparent">
          <button onClick={() => router.back()} className="w-10 h-10 bg-brand-surface/20 backdrop-blur-md rounded-full flex items-center justify-center text-white">
            <ChevronLeft size={24} />
          </button>
        </div>
      </div>

      {/* Hotel Info */}
      <div className="bg-brand-surface px-4 py-5 -mt-6 rounded-t-3xl relative z-10 shadow-sm">
        <div className="flex justify-between items-start mb-2">
          <h1 className="text-2xl font-bold text-brand-charcoal flex-1 pr-4">{(hotel as any).name}</h1>
          <div className="bg-brand-orange-light text-brand-orange px-2 py-1 rounded-lg flex items-center gap-1 font-bold text-sm shrink-0">
            <Star size={14} className="fill-brand-accent" /> 4.9
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-brand-text-accent text-sm mb-4">
          <MapPin size={16} className="text-brand-text-accent/70 shrink-0" />
          <span>{(hotel as any).addressLine} {(hotel as any).city ? `, ${(hotel as any).city}` : ''}</span>
        </div>

        <div className="flex gap-4 border-t border-brand-text-accent/10 pt-4">
          <div className="flex flex-col items-center gap-1 flex-1">
            <div className="w-10 h-10 rounded-full bg-brand-gray flex items-center justify-center text-brand-text-accent">
              <Wifi size={18} />
            </div>
            <span className="text-xs text-brand-text-accent font-medium">Free WiFi</span>
          </div>
          <div className="flex flex-col items-center gap-1 flex-1">
            <div className="w-10 h-10 rounded-full bg-brand-gray flex items-center justify-center text-brand-text-accent">
              <Coffee size={18} />
            </div>
            <span className="text-xs text-brand-text-accent font-medium">Breakfast</span>
          </div>
          <a href={`tel:${(hotel as any).contactPhone}`} className="flex flex-col items-center gap-1 flex-1">
            <div className="w-10 h-10 rounded-full bg-brand-orange-light flex items-center justify-center text-brand-orange">
              <Phone size={18} />
            </div>
            <span className="text-xs text-brand-orange font-medium">Call</span>
          </a>
        </div>
      </div>

      {/* Room Types */}
      <div className="p-4">
        <h2 className="font-bold text-lg mb-4 text-brand-charcoal">Available Rooms</h2>
        
        <div className="flex flex-col gap-4">
          {roomTypes.map((room) => (
            <div 
              key={room.id} 
              className="bg-brand-surface rounded-2xl overflow-hidden shadow-sm border border-brand-text-accent/10 cursor-pointer active:scale-[0.98] transition-transform"
              onClick={() => setSelectedRoom(room)}
            >
              <div className="flex p-3 gap-3">
                <div className="w-28 h-32 bg-brand-gray border border-brand-text-accent/10 rounded-xl overflow-hidden shrink-0 relative">
                  {room.coverImageUrl ? (
                    <img 
                      src={room.coverImageUrl} 
                      alt={room.name} 
                      className="w-full h-full object-cover" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=500&q=80';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-brand-text-accent/70">
                      <BedDouble size={24} />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <h3 className="font-bold text-brand-charcoal text-base leading-tight mb-1">{room.name}</h3>
                    
                    <div className="flex flex-wrap gap-2 mb-2">
                      <div className="flex items-center gap-1 text-xs text-brand-text-accent bg-brand-gray px-2 py-0.5 rounded">
                        <Users size={12} /> {room.maxOccupancy} Guests
                      </div>
                      {room.bedType && (
                        <div className="flex items-center gap-1 text-xs text-brand-text-accent bg-brand-gray px-2 py-0.5 rounded">
                          <BedDouble size={12} /> {room.bedType}
                        </div>
                      )}
                      {room.roomSizeSqm && (
                        <div className="flex items-center gap-1 text-xs text-brand-text-accent bg-brand-gray px-2 py-0.5 rounded">
                          <Expand size={12} /> {room.roomSizeSqm}m²
                        </div>
                      )}
                    </div>
                    
                    {room.description && (
                      <p className="text-brand-text-accent text-xs line-clamp-2">{room.description}</p>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-end mt-2">
                    <div>
                      <span className="font-bold text-lg text-brand-orange">${Number(room.basePrice).toFixed(0)}</span>
                      <span className="text-xs text-brand-text-accent/70">/night</span>
                    </div>
                    <Link 
                      href={`/hotels/${(hotel as any).id}/book?roomId=${room.id}`}
                      className="bg-brand-charcoal text-white text-xs font-bold px-4 py-2 rounded-full"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {roomTypes.length === 0 && (
            <div className="text-center py-8 text-brand-text-accent">
              No rooms currently available.
            </div>
          )}
        </div>
      </div>

      {/* Room Details Modal/Drawer */}
      {selectedRoom && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-end items-center bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-brand-surface w-full max-w-md max-h-[90vh] h-auto flex flex-col rounded-t-[2.5rem] overflow-hidden animate-in slide-in-from-bottom-8 duration-500 ease-out shadow-[0_-10px_40px_rgba(0,0,0,0.3)] relative">
            
            {/* Minimalist Drag Handle */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-white/40 rounded-full z-20"></div>

            {/* Modal Header with Close Button */}
            <div className="absolute top-6 right-6 z-20">
              <button 
                onClick={() => setSelectedRoom(null)}
                className="w-10 h-10 bg-black/20 hover:bg-black/40 backdrop-blur-xl rounded-full flex items-center justify-center text-white border border-white/30 transition-colors shadow-lg"
              >
                <X size={18} strokeWidth={2.5} />
              </button>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto">
              {/* Room Large Image - Cinema Style */}
              <div className="w-full h-[40vh] min-h-[300px] bg-brand-charcoal relative shrink-0">
                {selectedRoom.coverImageUrl ? (
                  <img 
                    src={selectedRoom.coverImageUrl} 
                    alt={selectedRoom.name} 
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/30">
                    <BedDouble size={64} strokeWidth={1} />
                  </div>
                )}
                {/* Premium Multi-layer Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal via-brand-charcoal/40 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent"></div>
                
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold tracking-wider uppercase border border-white/10">Premium</span>
                    {selectedRoom.roomSizeSqm && <span className="bg-brand-orange/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold tracking-wider uppercase">{selectedRoom.roomSizeSqm}m²</span>}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold mb-2 leading-tight tracking-tight drop-shadow-md line-clamp-2">{selectedRoom.name}</h2>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm font-medium text-white/80">
                    <span className="flex items-center gap-1.5"><Users size={16} className="text-brand-orange" /> Up to {selectedRoom.maxOccupancy} Guests</span>
                    {selectedRoom.bedType && <span className="flex items-center gap-1.5"><BedDouble size={16} className="text-brand-orange" /> {selectedRoom.bedType}</span>}
                  </div>
                </div>
              </div>

              {/* Room Content Details */}
              <div className="px-6 pt-8 pb-32 bg-brand-surface relative">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                <div className="mb-8 relative z-10">
                  <h3 className="text-xs font-bold text-brand-text-accent tracking-widest uppercase mb-4">Amenities</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-brand-gray flex items-center justify-center text-brand-charcoal shrink-0">
                        <Wifi size={16} strokeWidth={2} />
                      </div>
                      <span className="text-[13px] font-medium text-brand-charcoal">High-Speed WiFi</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-brand-gray flex items-center justify-center text-brand-charcoal shrink-0">
                        <Coffee size={16} strokeWidth={2} />
                      </div>
                      <span className="text-[13px] font-medium text-brand-charcoal">Morning Breakfast</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-brand-gray flex items-center justify-center text-brand-charcoal shrink-0">
                        <Wind size={16} strokeWidth={2} />
                      </div>
                      <span className="text-[13px] font-medium text-brand-charcoal">Air Conditioning</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-brand-gray flex items-center justify-center text-brand-charcoal shrink-0">
                        <Monitor size={16} strokeWidth={2} />
                      </div>
                      <span className="text-[13px] font-medium text-brand-charcoal">Flat-screen TV</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-brand-gray flex items-center justify-center text-brand-charcoal shrink-0">
                        <Bath size={16} strokeWidth={2} />
                      </div>
                      <span className="text-[13px] font-medium text-brand-charcoal">En-suite Bathroom</span>
                    </div>
                  </div>
                </div>

                <div className="relative z-10 mb-8">
                  <h3 className="text-xs font-bold text-brand-text-accent tracking-widest uppercase mb-4">About this room</h3>
                  <div className="text-brand-charcoal/80 leading-loose font-light text-[14px] text-justify space-y-4">
                    <p>
                      {selectedRoom.description || 'Experience unparalleled comfort in our thoughtfully designed space. This room offers a perfect blend of modern luxury and elegant aesthetics, creating a tranquil sanctuary for your stay. Floor-to-ceiling windows provide abundant natural light, while our signature bedding ensures a restful night\'s sleep.'}
                    </p>
                    <p>
                      Enjoy complimentary access to our wellness facilities and personalized concierge services throughout your visit. Every detail has been meticulously crafted to elevate your experience.
                    </p>
                  </div>
                </div>

                {/* Additional Room Gallery */}
                <div className="relative z-10 flex flex-col gap-4">
                  <h3 className="text-xs font-bold text-brand-text-accent tracking-widest uppercase mb-1">Gallery</h3>
                  <div className="w-full h-56 rounded-2xl overflow-hidden bg-brand-gray relative">
                    <img 
                      src="https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800&q=80" 
                      alt="Room View 1" 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="w-full h-56 rounded-2xl overflow-hidden bg-brand-gray relative">
                    <img 
                      src="https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&q=80" 
                      alt="Room View 2" 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="w-full h-56 rounded-2xl overflow-hidden bg-brand-gray relative">
                    <img 
                      src="https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&q=80" 
                      alt="Bathroom" 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Fixed Bottom Booking Bar - Floating Style */}
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 pb-safe-bottom bg-gradient-to-t from-brand-surface via-brand-surface to-transparent pointer-events-none">
              <div className="bg-brand-charcoal rounded-[2rem] p-2 pl-5 sm:pl-6 pr-2 flex justify-between items-center w-full max-w-md mx-auto shadow-2xl pointer-events-auto border border-white/10 backdrop-blur-xl">
                <div className="flex flex-col">
                  <span className="text-[10px] sm:text-xs text-white/60 font-medium tracking-wide">Per Night</span>
                  <div className="flex items-baseline gap-1">
                    <span className="font-serif font-bold text-xl sm:text-2xl text-white">${Number(selectedRoom.basePrice).toFixed(0)}</span>
                  </div>
                </div>
                <Link 
                  href={`/hotels/${(hotel as any).id}/book?roomId=${selectedRoom.id}`}
                  className="bg-brand-orange text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-full font-bold shadow-lg hover:bg-brand-orange-dark active:scale-95 transition-all inline-flex items-center gap-2 text-sm sm:text-base"
                  onClick={(e) => e.stopPropagation()}
                >
                  Reserve <ChevronLeft size={16} className="rotate-180" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}