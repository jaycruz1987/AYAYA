'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import Link from 'next/link';

export default function CartPage() {
  const router = useRouter();
  const { items, merchant, updateQuantity, clearCart, getTotalPrice } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-brand-gray flex flex-col">
        <div className="bg-brand-surface px-4 py-3 flex items-center border-b border-brand-text-accent/10 sticky top-0 pt-safe-top">
          <button onClick={() => router.back()} className="p-2 -ml-2">
            <ChevronLeft size={24} className="text-brand-charcoal" />
          </button>
          <h1 className="text-lg font-bold text-brand-charcoal ml-2">Your Cart</h1>
        </div>
        
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-32 h-32 bg-brand-surface rounded-full flex items-center justify-center mb-6 shadow-brand">
            <ShoppingBag size={48} className="text-brand-text-accent/70" />
          </div>
          <h2 className="text-xl font-bold text-brand-charcoal mb-2">Your cart is empty</h2>
          <p className="text-brand-text-accent mb-8">Looks like you haven't added anything to your cart yet.</p>
          <Link href="/food" className="bg-brand-orange text-white font-bold py-3 px-8 rounded-full shadow-sm hover:bg-brand-orange-dark transition-colors">
            Start Exploring
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = getTotalPrice();
  const deliveryFee = 2.99; // Mock fee
  const total = subtotal + deliveryFee;

  return (
    <div className="min-h-screen bg-brand-gray pb-32">
      <div className="bg-brand-surface px-4 py-3 flex items-center justify-between border-b border-brand-text-accent/10 sticky top-0 z-20 pt-safe-top">
        <div className="flex items-center">
          <button onClick={() => router.back()} className="p-2 -ml-2">
            <ChevronLeft size={24} className="text-brand-charcoal" />
          </button>
          <h1 className="text-lg font-bold text-brand-charcoal ml-2">Your Cart</h1>
        </div>
        <button onClick={clearCart} className="p-2 text-red-500">
          <Trash2 size={20} />
        </button>
      </div>

      <div className="p-4">
        <div className="bg-brand-surface rounded-2xl p-4 shadow-brand mb-4">
          <h2 className="font-bold text-brand-charcoal border-b border-brand-text-accent/10 pb-3 mb-3">
            {merchant?.name}
          </h2>
          
          <div className="flex flex-col gap-4">
            {items.map((item) => (
              <div key={item.product.id} className="flex gap-3">
                <div className="w-16 h-16 bg-brand-gray rounded-lg shrink-0 overflow-hidden">
                  {item.product.imageUrl ? (
                    <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-brand-text-accent/70 text-[10px]">No img</div>
                  )}
                </div>
                
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-brand-charcoal text-sm leading-tight pr-2">
                      {item.product.name}
                    </h3>
                    <span className="font-bold text-brand-charcoal text-sm">
                      ${(Number(item.product.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-brand-text-accent">${Number(item.product.price).toFixed(2)} each</span>
                    
                    <div className="flex items-center gap-3 bg-brand-gray rounded-full px-2 py-1">
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-6 h-6 bg-brand-surface rounded-full flex items-center justify-center text-brand-orange shadow-sm"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-6 h-6 bg-brand-orange rounded-full flex items-center justify-center text-white shadow-sm"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-brand-surface rounded-2xl p-4 shadow-brand mb-4">
          <h3 className="font-bold text-brand-charcoal mb-3">Bill Details</h3>
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between text-brand-text-accent">
              <span>Item Total</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-brand-text-accent">
              <span>Delivery Fee</span>
              <span>${deliveryFee.toFixed(2)}</span>
            </div>
            <div className="border-t border-brand-text-accent/10 pt-2 mt-1 flex justify-between font-bold text-brand-charcoal text-base">
              <span>To Pay</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-brand-surface shadow-[0_-8px_30px_rgba(0,0,0,0.04)] border-t border-brand-text-accent/5 p-4 pb-safe z-50">
        <Link 
          href="/checkout"
          className="w-full bg-brand-orange text-white rounded-full py-3.5 font-bold text-center block shadow-sm hover:bg-brand-orange-dark transition-colors"
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}