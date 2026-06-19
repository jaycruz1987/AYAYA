'use client';

import React, { use, useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
// import { useClientHotelDetails } from '@/hooks/client/useClientHotels';
import { useClientCreateServiceRequest } from '@/hooks/client/useClientServiceRequests';
import { ChevronLeft, Calendar, BedDouble, FileText, User, Users, ShieldCheck, Info } from 'lucide-react';
import { Form, Input, DatePicker, message, Select, Divider } from 'antd';
import AuthGuard from '@/components/auth/AuthGuard';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

function BookRoomContent({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomId = searchParams.get('roomId');
  
  const resolvedParams = use(params);
  // const { data: hotel, isLoading: loadingHotel } = useClientHotelDetails(resolvedParams.id);
  const { createRequest, isCreating } = useClientCreateServiceRequest();
  
  const [form] = Form.useForm();
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  
  // Mock Data logic for testing UI
  const [hotel, setHotel] = useState<any>(null);
  const [loadingHotel, setLoadingHotel] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHotel({
        id: resolvedParams.id,
        name: 'Grand Horizon Resort & Spa',
        city: 'Chiang Mai',
        roomTypes: [
          {
            id: 'rt-1',
            name: 'Ocean View Suite',
            basePrice: 185,
            coverImageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80'
          },
          {
            id: 'rt-2',
            name: 'Family Garden Villa',
            basePrice: 250,
            coverImageUrl: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&q=80'
          }
        ]
      });
      setLoadingHotel(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [resolvedParams.id]);

  useEffect(() => {
    if (hotel && roomId) {
      const room = (hotel as any).roomTypes?.find((r: any) => r.id === roomId);
      setSelectedRoom(room);
    }
  }, [hotel, roomId]);

  if (loadingHotel) {
    return (
      <div className="min-h-screen bg-brand-gray flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-orange"></div>
      </div>
    );
  }

  if (!hotel || !selectedRoom) {
    return (
      <div className="min-h-screen bg-brand-gray flex flex-col justify-center items-center p-4 text-center">
        <h2 className="text-xl font-bold mb-2">Room Information Missing</h2>
        <p className="text-brand-text-accent mb-6">We couldn't load the room details.</p>
        <button onClick={() => router.back()} className="text-brand-orange bg-brand-orange-light px-6 py-2 rounded-full font-bold">
          Go Back
        </button>
      </div>
    );
  }

  const onFinish = async (values: any) => {
    // We are now assuming dates are handled globally in the hotel search flow, 
    // so we mock them here to keep the API happy.
    const checkIn = dayjs().add(1, 'day').format('YYYY-MM-DD');
    const checkOut = dayjs().add(3, 'day').format('YYYY-MM-DD');
    
    try {
      await createRequest({
        hotelId: (hotel as any).id,
        type: 'HOTEL_BOOKING',
        requestData: {
          roomTypeId: selectedRoom.id,
          roomName: selectedRoom.name,
          checkInDate: checkIn,
          checkOutDate: checkOut,
          guestCount: 2, // Assuming default for now, could add a field for this
          guestName: `${values.firstName} ${values.lastName}`,
          guestEmail: values.email,
          guestPhone: values.phone,
          specialRequests: values.specialRequests || ''
        }
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-brand-gray pb-24">
        <div className="bg-brand-surface px-4 py-3 flex items-center border-b border-brand-text-accent/10 sticky top-0 z-20 pt-safe-top">
          <button onClick={() => router.back()} className="p-2 -ml-2">
            <ChevronLeft size={24} className="text-brand-charcoal" />
          </button>
          <h1 className="text-lg font-bold text-brand-charcoal ml-2">Request to Book</h1>
        </div>

        <div className="p-4">
          {/* Summary Card */}
          <div className="bg-brand-surface rounded-2xl p-5 shadow-sm border border-brand-text-accent/10 mb-6">
            <div className="flex gap-4">
              <div className="w-24 h-28 bg-brand-gray rounded-xl overflow-hidden shrink-0 shadow-inner">
                {selectedRoom.coverImageUrl ? (
                  <img src={selectedRoom.coverImageUrl} alt="room" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-brand-text-accent/70">
                    <BedDouble size={24} />
                  </div>
                )}
              </div>
              <div className="flex flex-col justify-between py-1 flex-1">
                <div>
                  <div className="text-[11px] font-bold text-brand-orange uppercase tracking-wider mb-1">{(hotel as any).name}</div>
                  <h2 className="font-bold text-brand-charcoal text-[17px] leading-tight mb-2 line-clamp-2">{selectedRoom.name}</h2>
                </div>
                <div className="flex items-end justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 font-medium">1 Room, 2 Guests</span>
                    <span className="text-[10px] text-gray-400 font-medium">Mar 25 - Mar 27 (2 Nights)</span>
                  </div>
                </div>
              </div>
            </div>
            
            <Divider className="my-4 border-gray-100" />
            
            <div className="flex justify-between items-center">
              <span className="font-bold text-brand-charcoal">Total Amount</span>
              <div className="flex items-baseline gap-1">
                <span className="text-xs font-bold text-[#F15A4A]">USD</span>
                <span className="font-black text-2xl text-[#F15A4A]">{Number(selectedRoom.basePrice * 2).toFixed(0)}</span>
              </div>
            </div>
          </div>

          <Form 
            form={form} 
            layout="vertical" 
            onFinish={onFinish}
            className="flex flex-col gap-2 pb-10"
          >
            {/* Guest Information Card */}
            <div className="bg-brand-surface rounded-2xl p-4 shadow-sm border border-brand-text-accent/10 mb-4">
              <h3 className="font-bold text-brand-charcoal mb-4 flex items-center gap-2">
                <User size={18} className="text-brand-orange" />
                Guest Information
              </h3>
              
              <div className="grid grid-cols-2 gap-3 mb-3">
                <Form.Item 
                  name="firstName" 
                  className="mb-0"
                  rules={[{ required: true, message: 'Required' }]}
                >
                  <Input 
                    placeholder="First Name" 
                    className="h-12 rounded-xl border-brand-text-accent/20 bg-gray-50/50"
                  />
                </Form.Item>
                <Form.Item 
                  name="lastName" 
                  className="mb-0"
                  rules={[{ required: true, message: 'Required' }]}
                >
                  <Input 
                    placeholder="Last Name" 
                    className="h-12 rounded-xl border-brand-text-accent/20 bg-gray-50/50"
                  />
                </Form.Item>
              </div>

              <Form.Item 
                name="email" 
                className="mb-3"
                rules={[
                  { required: true, message: 'Required' },
                  { type: 'email', message: 'Valid email required' }
                ]}
              >
                <Input 
                  placeholder="Email Address" 
                  className="h-12 rounded-xl border-brand-text-accent/20 bg-gray-50/50"
                />
              </Form.Item>

              <Form.Item 
                name="phone" 
                className="mb-0"
                rules={[{ required: true, message: 'Required' }]}
              >
                <Input 
                  placeholder="Phone Number" 
                  className="h-12 rounded-xl border-brand-text-accent/20 bg-gray-50/50"
                />
              </Form.Item>
            </div>

            <div className="bg-brand-surface rounded-2xl p-4 shadow-sm border border-brand-text-accent/10 mb-4">
              <h3 className="font-bold text-brand-charcoal mb-4 flex items-center gap-2">
                <FileText size={18} className="text-brand-orange" />
                Special Requests
              </h3>
              <Form.Item name="specialRequests" className="mb-0">
                <Input.TextArea 
                  rows={4} 
                  placeholder="E.g. Late check-in, high floor, quiet room..." 
                  className="rounded-xl border-brand-text-accent/20"
                />
              </Form.Item>
            </div>

            <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-brand-surface shadow-[0_-8px_30px_rgba(0,0,0,0.04)] border-t border-brand-text-accent/5 p-4 pb-safe z-50">
              <div className="flex items-center gap-2 mb-3 text-[11px] text-gray-500 font-medium justify-center">
                <ShieldCheck size={14} className="text-green-500" />
                Your booking is secure and encrypted
              </div>
              <button 
                type="submit"
                onClick={() => form.submit()}
                disabled={isCreating}
                className={`w-full text-white rounded-xl py-3.5 font-bold text-center shadow-lg transition-transform active:scale-[0.98] ${
                  isCreating ? 'bg-gray-400' : 'bg-gradient-to-r from-[#FF8C69] to-[#F15A4A] shadow-orange-500/30'
                }`}
              >
                {isCreating ? 'Processing...' : 'Pay & Book Now'}
              </button>
            </div>
          </Form>
        </div>
      </div>
    </AuthGuard>
  );
}

export default function BookRoomPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-brand-gray flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-orange"></div>
      </div>
    }>
      <BookRoomContent params={params} />
    </Suspense>
  );
}