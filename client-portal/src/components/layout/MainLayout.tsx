import React from 'react';
import BottomNav from './BottomNav';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-brand-gray pb-20">
      {children}
      <BottomNav />
    </div>
  );
}