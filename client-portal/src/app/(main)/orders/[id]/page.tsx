'use client';

import React, { use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ChevronLeft, MapPin, Phone, Receipt, Store, CheckCircle, Clock, UtensilsCrossed, Package, Truck, CheckCircle2, AlertCircle, Loader2, Building2 } from 'lucide-react';
import { useClientOrderDetails } from '@/hooks/client/useClientOrders';
import dayjs from 'dayjs';
import AuthGuard from '@/components/auth/AuthGuard';

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const { data: order, isLoading } = useClientOrderDetails(resolvedParams.id);

  const renderFulfillmentBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <div className="flex items-center gap-2 px-4 py-1.5 bg-gray-100/80 text-gray-700 rounded-lg font-semibold text-xs tracking-wide shadow-inner border border-gray-200">
            <Loader2 size={18} className="animate-spin" />
            <span className="uppercase">Awaiting Confirmation</span>
          </div>
        );
      case 'PREPARING':
        return (
          <div className="flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-indigo-700 rounded-lg font-semibold text-xs tracking-wide border border-indigo-200 shadow-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-white/40 blur-sm"></div>
            <UtensilsCrossed size={18} className="animate-bounce relative z-10" />
            <span className="uppercase relative z-10">Kitchen Preparing</span>
          </div>
        );
      case 'DELIVERING':
        return (
          <div className="flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-brand-orange/10 to-orange-500/10 text-brand-orange-dark rounded-lg font-semibold text-xs tracking-wide border border-brand-orange/30 shadow-sm">
            <Truck size={18} className="animate-pulse" />
            <span className="uppercase">Out for Delivery</span>
          </div>
        );
      case 'DELIVERED':
      case 'COMPLETED':
        return (
          <div className="flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 text-emerald-700 rounded-lg font-semibold text-xs tracking-wide border border-emerald-200 shadow-sm">
            <Package size={18} />
            <span className="uppercase">Order Delivered</span>
          </div>
        );
      case 'CANCELLED':
        return (
          <div className="flex items-center gap-2 px-4 py-1.5 bg-rose-50 text-rose-600 rounded-lg font-semibold text-xs tracking-wide border border-rose-100">
            <AlertCircle size={18} />
            <span className="uppercase">Cancelled</span>
          </div>
        );
      default:
        return <span className="font-bold text-sm text-gray-500">{status}</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-gray flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-orange"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-brand-gray flex flex-col justify-center items-center p-4">
        <h2 className="text-xl font-bold mb-4">Order not found</h2>
        <button onClick={() => router.back()} className="text-brand-orange bg-brand-orange-light px-4 py-2 rounded-full">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-brand-gray pb-10">
      <div className="bg-brand-surface px-4 py-3 flex items-center border-b border-brand-text-accent/10 sticky top-0 z-20 pt-safe-top">
        <button onClick={() => router.back()} className="p-2 -ml-2">
          <ChevronLeft size={24} className="text-brand-charcoal" />
        </button>
        <h1 className="text-lg font-bold text-brand-charcoal ml-2">Order Details</h1>
      </div>

      {/* Status Header */}
      <div className={`p-6 text-center shadow-md transition-colors duration-300 ${
        (order as any).orderStatus === 'ACCEPTED' ? 'bg-green-500 text-white' : 
        (order as any).orderStatus === 'PENDING' ? 'bg-brand-orange text-white' :
        (order as any).orderStatus === 'CANCELLED' ? 'bg-red-500 text-white' :
        'bg-brand-orange text-white'
      }`}>
        <div className="flex justify-center mb-2">
          {(order as any).orderStatus === 'ACCEPTED' && <CheckCircle size={32} className="text-white" />}
          {(order as any).orderStatus === 'PENDING' && <Clock size={32} className="text-white animate-pulse" />}
        </div>
        <h2 className="text-2xl font-bold mb-1">{(order as any).orderStatus}</h2>
        <p className="opacity-90 text-sm">Order No: {(order as any).orderNo}</p>
        <div className="mt-4 inline-block bg-black/10 px-4 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm">
          {dayjs((order as any).createdAt).format('MMM D, YYYY h:mm A')}
        </div>
      </div>

      <div className="p-4 flex flex-col gap-4 -mt-4 relative z-10">
        {/* Merchant/Hotel Info */}
        <div className="bg-brand-surface rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            {(order as any).orderType === 'HOTEL_BOOKING' ? (
              <Building2 size={20} className="text-brand-text-accent/70" />
            ) : (
              <Store size={20} className="text-brand-text-accent/70" />
            )}
            <h3 className="font-bold text-brand-charcoal">
              {(order as any).hotel?.name || (order as any).merchant?.name}
            </h3>
          </div>
          <div className="flex justify-between items-center border-t border-brand-text-accent/5 pt-3">
            <span className="text-brand-text-accent text-sm">Payment Status</span>
            <span className={`font-bold text-sm ${(order as any).paymentStatus === 'PAID' ? 'text-green-600' : 'text-orange-500'}`}>
              {(order as any).paymentStatus}
            </span>
          </div>
          <div className="flex justify-between items-center mt-3">
            <span className="text-brand-text-accent text-sm">Fulfillment Status</span>
            {renderFulfillmentBadge((order as any).fulfillmentStatus)}
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-brand-surface rounded-2xl p-4 shadow-sm">
          <h3 className="font-bold text-brand-charcoal mb-4 flex items-center gap-2">
            <Receipt size={18} className="text-brand-text-accent/70" />
            Items Summary
          </h3>
          <div className="flex flex-col gap-4">
            {(order as any).items?.map((item: any) => (
              <div key={item.id} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-3">
                  {/* Product Thumbnail */}
                  <div className="w-12 h-12 bg-brand-gray rounded-lg overflow-hidden shrink-0 border border-brand-text-accent/10 relative">
                    {item.product?.imageUrl ? (
                      <img 
                        src={item.product.imageUrl} 
                        alt={item.productName || item.product?.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-brand-text-accent/50">
                        <UtensilsCrossed size={16} />
                      </div>
                    )}
                  </div>
                  
                  {/* Product Info */}
                  <div className="flex flex-col">
                    <span className="text-brand-charcoal font-medium">{item.productName || item.product?.name || 'Unknown Item'}</span>
                    <span className="text-brand-text-accent text-xs">Qty: {item.quantity}</span>
                  </div>
                </div>
                <span className="font-bold text-brand-charcoal">
                  ${(Number(item.totalPrice || item.unitPrice || item.priceAtTime || 0)).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          
          <div className="border-t border-brand-text-accent/10 pt-4 mt-5 flex flex-col gap-2 text-sm">
            <div className="flex justify-between text-brand-text-accent">
              <span>Delivery Fee</span>
              <span>${Number((order as any).deliveryFee || 5).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-brand-charcoal text-base mt-1">
              <span>Total Amount</span>
              <span>${Number((order as any).totalAmount || 0).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Delivery Info */}
        <div className="bg-brand-surface rounded-2xl p-4 shadow-sm">
          <h3 className="font-bold text-brand-charcoal mb-3 flex items-center gap-2">
            <MapPin size={18} className="text-brand-text-accent/70" />
            Delivery Details
          </h3>
          <div className="bg-brand-gray p-3 rounded-xl text-sm">
            <div className="font-bold text-brand-charcoal mb-1">
              {(order as any).deliveryAddressSnapshot?.contactName}
            </div>
            <div className="text-brand-text-accent mb-2 flex items-center gap-1">
              <Phone size={12} /> {(order as any).deliveryAddressSnapshot?.contactPhone}
            </div>
            <div className="text-brand-text-accent">
              {(order as any).deliveryAddressSnapshot?.addressLine}, {(order as any).deliveryAddressSnapshot?.buildingName}
            </div>
            {(order as any).deliveryAddressSnapshot?.city && (
              <div className="text-brand-text-accent mt-1">{(order as any).deliveryAddressSnapshot.city}</div>
            )}
          </div>
        </div>
      </div>
    </div>
    </AuthGuard>
  );
}