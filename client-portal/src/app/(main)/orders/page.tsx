'use client';

import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useClientOrders } from '@/hooks/client/useClientOrders';
import Link from 'next/link';
import { ShoppingBag, ChevronRight, Clock, CheckCircle, BedDouble } from 'lucide-react';
import dayjs from 'dayjs';
import AuthGuard from '@/components/auth/AuthGuard';

export default function OrdersPage() {
  const { orders, isLoading } = useClientOrders();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'text-orange-500 bg-orange-50 border border-orange-200';
      case 'PROCESSING': return 'text-brand-orange bg-brand-orange-light border border-brand-orange/30';
      case 'RESOLVED':
      case 'COMPLETED': return 'text-green-600 bg-green-50 border border-green-200';
      case 'CLOSED':
      case 'CANCELLED': return 'text-brand-text-accent bg-brand-gray border border-brand-text-accent/20';
      default: return 'text-brand-text-accent bg-brand-gray';
    }
  };

  return (
    <AuthGuard>
      <MainLayout>
      <div className="bg-linear-to-r from-brand-orange to-brand-accent px-4 py-4 sticky top-0 z-20 pt-safe-top text-white shadow-sm">
        <h1 className="text-xl font-bold text-white">My Orders</h1>
      </div>

      <div className="p-4 flex flex-col gap-4">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-orange"></div>
          </div>
        ) : (Array.isArray(orders) ? orders : []).length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 bg-brand-gray border border-brand-text-accent/10 rounded-full flex items-center justify-center mb-6">
              <ShoppingBag size={40} className="text-brand-text-accent/70" />
            </div>
            <h2 className="text-lg font-bold text-brand-charcoal mb-2">No orders yet</h2>
            <p className="text-brand-text-accent mb-6 text-sm">When you place an order, it will appear here.</p>
            <Link href="/food" className="text-brand-orange font-bold border border-brand-orange px-6 py-2 rounded-full">
              Explore Restaurants
            </Link>
          </div>
        ) : (
          (Array.isArray(orders) ? orders : []).map((order: any) => (
            <Link href={`/orders/${order.id}`} key={order.id}>
              <div className="bg-brand-surface rounded-2xl p-4 shadow-sm border border-brand-text-accent/10 hover:border-brand-orange-light transition-colors">
                <div className="flex justify-between items-start mb-3 border-b border-brand-text-accent/5 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-gray border border-brand-text-accent/10 rounded-lg flex items-center justify-center overflow-hidden">
                      {order.hotel ? (
                        order.hotel.coverImageUrl ? (
                          <img src={order.hotel.coverImageUrl} alt="hotel logo" className="w-full h-full object-cover" />
                        ) : (
                          <BedDouble size={20} className="text-brand-text-accent/70" />
                        )
                      ) : order.merchant?.logoUrl ? (
                        <img src={order.merchant.logoUrl} alt="merchant logo" className="w-full h-full object-cover" />
                      ) : (
                        <ShoppingBag size={20} className="text-brand-text-accent/70" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-brand-charcoal text-sm">
                        {order.hotel?.name || order.merchant?.name || 'Store'}
                      </h3>
                      <div className="text-xs text-brand-text-accent mt-0.5">
                        {dayjs(order.createdAt).format('MMM D, YYYY h:mm A')}
                      </div>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded text-[10px] font-bold ${getStatusColor(order.orderStatus)}`}>
                    {order.orderStatus}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-sm text-brand-text-accent line-clamp-1 flex-1 pr-4">
                    {order.orderType === 'HOTEL_BOOKING' 
                      ? `${dayjs(order.checkInDate).format('MMM D')} - ${dayjs(order.checkOutDate).format('MMM D')}` 
                      : order.items?.map((i: any) => `${i.quantity}x ${i.productName || i.product?.name}`).join(', ')
                    }
                  </div>
                  <div className="font-bold text-brand-charcoal">
                    ${Number(order.totalAmount).toFixed(2)}
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </MainLayout>
    </AuthGuard>
  );
}