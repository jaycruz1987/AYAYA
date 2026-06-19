'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Search, ShoppingBag, User, Plane } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Orders', path: '/orders', icon: ShoppingBag },
    { label: 'Trips', path: '/trips', icon: Plane },
    { label: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-brand-surface border-t border-brand-text-accent/5 shadow-[0_-8px_30px_rgba(0,0,0,0.06)] px-6 py-2 flex justify-between items-center z-50 pb-safe rounded-t-3xl">
      {navItems.map((item) => {
        const Icon = item.icon;
        // Avoid hydration mismatch by not calculating isActive until mounted
        const isActive = mounted && (pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path)));
        
        return (
          <button
            key={item.path}
            onClick={() => router.push(item.path)}
            className={`flex flex-col items-center justify-center w-16 h-14 relative transition-all duration-300 ease-out group ${
              isActive ? '-translate-y-2' : 'hover:-translate-y-1'
            }`}
          >
            {/* Active Indicator Dot */}
            <div 
              className={`absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-brand-orange transition-all duration-300 ${
                isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
              }`}
            />
            
            {/* Icon Container */}
            <div className={`p-2.5 rounded-2xl transition-all duration-300 ${
              isActive 
                ? 'bg-linear-to-tr from-brand-orange to-brand-accent text-white shadow-lg shadow-brand-orange/30 scale-110' 
                : 'bg-transparent text-brand-text-accent group-hover:text-brand-charcoal'
            }`}>
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'animate-pulse-once' : ''} />
            </div>
            
            {/* Label (Hidden when active to save space, or shown tiny) */}
            <span className={`text-[10px] font-bold mt-1 transition-all duration-300 ${
              isActive 
                ? 'text-brand-orange opacity-100 transform translate-y-0' 
                : 'text-brand-text-accent opacity-70 transform translate-y-0'
            }`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}