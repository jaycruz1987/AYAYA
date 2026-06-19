'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, MapPin, ChevronRight, CreditCard, Clock } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useClientAddresses } from '@/hooks/client/useClientAddresses';
import { useClientOrders } from '@/hooks/client/useClientOrders';
import { message } from 'antd';
import Link from 'next/link';
import AuthGuard from '@/components/auth/AuthGuard';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, merchant, getTotalPrice, clearCart } = useCartStore();
  const { addresses, isLoading: loadingAddresses } = useClientAddresses();
  const { createOrder, isCreating } = useClientOrders();

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

  const addressesList = Array.isArray(addresses) ? addresses : [];

  // Set default address on load
  React.useEffect(() => {
    if (addressesList.length > 0 && !selectedAddressId) {
      const defaultAddr: any = addressesList.find((a: any) => a.isDefault) || addressesList[0];
      setSelectedAddressId(defaultAddr.id);
    }
  }, [addressesList, selectedAddressId]);

  if (items.length === 0 || !merchant) {
    return (
      <div className="min-h-screen bg-brand-gray flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold text-brand-charcoal mb-2">No items to checkout</h2>
        <button onClick={() => router.push('/food')} className="text-brand-orange bg-brand-orange-light px-6 py-2 rounded-full font-bold">
          Go to Food
        </button>
      </div>
    );
  }

  const subtotal = getTotalPrice();
  const deliveryFee = 2.99;
  const totalAmount = subtotal + deliveryFee;

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      message.error('Please select a delivery address');
      return;
    }

    const selectedAddress: any = addressesList.find((a: any) => a.id === selectedAddressId);
    
    try {
      const orderPayload = {
        merchantId: merchant.id,
        items: items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          // priceAtTime is no longer sent; the backend calculates it from the database
        })),
        deliveryAddressSnapshot: {
          contact_name: selectedAddress?.contactName,
          contact_phone: selectedAddress?.contactPhone,
          address_line: selectedAddress?.addressLine,
          city: selectedAddress?.city,
          building_name: selectedAddress?.buildingName,
          floor: selectedAddress?.floor,
          room_no: selectedAddress?.roomNo,
        },
        deliveryFee,
        totalAmount,
      };

      await createOrder(orderPayload);
      clearCart();
      // Router push is handled in the hook's onSuccess
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-brand-gray pb-32">
        <div className="bg-brand-surface px-4 py-3 flex items-center border-b border-brand-text-accent/10 sticky top-0 z-20 pt-safe-top">
          <button onClick={() => router.back()} className="p-2 -ml-2">
            <ChevronLeft size={24} className="text-brand-charcoal" />
          </button>
          <h1 className="text-lg font-bold text-brand-charcoal ml-2">Checkout</h1>
        </div>

        <div className="p-4 flex flex-col gap-4">
          {/* Delivery Address */}
          <div className="bg-brand-surface rounded-2xl p-4 shadow-brand">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-bold text-brand-charcoal flex items-center gap-2">
                <MapPin size={18} className="text-brand-orange" />
                Delivery Address
              </h2>
              <Link href="/addresses" className="text-brand-orange text-sm font-medium">Add New</Link>
            </div>
            
            {loadingAddresses ? (
              <div className="py-4 text-center text-brand-text-accent/70 text-sm">Loading addresses...</div>
            ) : addressesList.length === 0 ? (
              <Link href="/addresses" className="block py-4 text-center border-2 border-dashed border-brand-orange/30 rounded-xl text-brand-orange font-medium">
                + Add your delivery address
              </Link>
            ) : (
              <div className="flex flex-col gap-3">
                {addressesList.map((addr: any) => (
                  <div 
                    key={addr.id}
                    onClick={() => setSelectedAddressId(addr.id)}
                    className={`border rounded-xl p-3 flex gap-3 transition-colors ${
                      selectedAddressId === addr.id ? 'border-brand-orange bg-brand-orange-light' : 'border-brand-text-accent/20 bg-brand-surface'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                      selectedAddressId === addr.id ? 'border-brand-orange' : 'border-brand-text-accent/30'
                    }`}>
                      {selectedAddressId === addr.id && <div className="w-3 h-3 bg-brand-orange rounded-full" />}
                    </div>
                    <div>
                      <div className="font-bold text-brand-charcoal text-sm">{addr.contactName} • {addr.contactPhone}</div>
                      <div className="text-brand-text-accent text-xs mt-1">{addr.addressLine}, {addr.buildingName}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="bg-brand-surface rounded-2xl p-4 shadow-brand">
            <h2 className="font-bold text-brand-charcoal mb-3 border-b border-brand-text-accent/10 pb-3">
              {merchant.name}
            </h2>
            
            <div className="flex flex-col gap-3 mb-4">
              {items.map((item) => (
                <div key={item.product.id} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-brand-gray rounded flex items-center justify-center text-xs font-bold text-brand-text-accent">
                      {item.quantity}x
                    </div>
                    <span className="text-brand-charcoal">{item.product.name}</span>
                  </div>
                  <span className="font-medium text-brand-charcoal">
                    ${(Number(item.product.price) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-brand-text-accent/10 pt-3 flex flex-col gap-2 text-sm">
              <div className="flex justify-between text-brand-text-accent">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-brand-text-accent">
                <span>Delivery Fee</span>
                <span>${deliveryFee.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-brand-surface rounded-2xl p-4 shadow-brand flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                <CreditCard size={20} />
              </div>
              <div>
                <div className="font-bold text-brand-charcoal text-sm">Cash on Delivery</div>
                <div className="text-brand-text-accent text-xs">Pay when you receive</div>
              </div>
            </div>
            <ChevronRight size={20} className="text-brand-text-accent/70" />
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-brand-surface shadow-[0_-8px_30px_rgba(0,0,0,0.04)] border-t border-brand-text-accent/5 p-4 pb-safe z-50">
          <div className="flex justify-between items-center mb-3">
            <span className="text-brand-text-accent font-medium">Total to pay</span>
            <span className="text-xl font-bold text-brand-charcoal">${totalAmount.toFixed(2)}</span>
          </div>
          <button 
            onClick={handlePlaceOrder}
            disabled={!selectedAddressId || isCreating}
            className={`w-full text-white rounded-full py-3.5 font-bold text-center block shadow-sm transition-colors ${
              !selectedAddressId || isCreating ? 'bg-brand-text-accent/30' : 'bg-brand-orange hover:bg-brand-orange-dark'
            }`}
          >
            {isCreating ? 'Placing Order...' : 'Place Order'}
          </button>
        </div>
      </div>
    </AuthGuard>
  );
}