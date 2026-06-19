'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, MapPin, CreditCard, HelpCircle, LogOut, ChevronRight, Settings, Plane, Users } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import AuthGuard from '@/components/auth/AuthGuard';
import Link from 'next/link';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userInfo = localStorage.getItem('client_info');
    if (userInfo) {
      try {
        setUser(JSON.parse(userInfo));
      } catch (e) {
        console.error('Failed to parse user info');
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('client_token');
    localStorage.removeItem('client_info');
    router.push('/login');
  };

  const menuItems = [
    { icon: Plane, label: 'My Trips', path: '/trips' },
    { icon: Users, label: 'Passenger Info', path: '/passengers' },
    { icon: MapPin, label: 'My Addresses', path: '/addresses' },
    { icon: CreditCard, label: 'Payment Methods', path: '#' },
    { icon: HelpCircle, label: 'Help & Support', path: '#' },
    { icon: Settings, label: 'Settings', path: '#' },
  ];

  return (
    <AuthGuard>
      <MainLayout>
        {/* Header Section */}
        <div className="bg-linear-to-r from-brand-orange to-brand-accent px-4 pt-safe-top pb-8 text-white relative">
          <h1 className="text-xl font-bold mb-6 text-center">My Profile</h1>
          
          <div className="flex items-center gap-4 bg-white/20 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
            <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center text-brand-orange shadow-inner">
              <User size={32} />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold">{user?.name || 'Guest User'}</h2>
              <p className="text-white/80 text-sm">{user?.email || 'Please complete your profile'}</p>
              {user?.phone && (
                <p className="text-white/80 text-xs mt-1">{user.phone}</p>
              )}
            </div>
          </div>
        </div>

        <div className="px-4 py-6 -mt-4 bg-brand-gray min-h-screen rounded-t-3xl relative z-10">
          
          {/* Menu Items */}
          <div className="bg-brand-surface rounded-2xl p-2 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-brand-text-accent/5 mb-6">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <Link 
                  key={index} 
                  href={item.path}
                  className={`flex items-center justify-between p-4 ${
                    index !== menuItems.length - 1 ? 'border-b border-brand-text-accent/5' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-gray rounded-full flex items-center justify-center text-brand-text-accent group-hover:bg-brand-orange-light group-hover:text-brand-orange transition-colors">
                      <Icon size={20} />
                    </div>
                    <span className="font-medium text-brand-charcoal">{item.label}</span>
                  </div>
                  <ChevronRight size={18} className="text-brand-text-accent/50" />
                </Link>
              );
            })}
          </div>

          {/* Logout Button */}
          <button 
            onClick={handleLogout}
            className="w-full bg-brand-surface rounded-2xl p-4 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-brand-text-accent/5 flex items-center justify-center gap-2 text-rose-500 font-bold hover:bg-rose-50 transition-colors"
          >
            <LogOut size={20} />
            Log Out
          </button>
          
          <div className="text-center mt-8 pb-20">
            <p className="text-xs text-brand-text-accent/50">Citylink App v1.0.0</p>
          </div>
        </div>
      </MainLayout>
    </AuthGuard>
  );
}