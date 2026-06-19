'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, User, FileText, Edit2, Trash2 } from 'lucide-react';
import AuthGuard from '@/components/auth/AuthGuard';

export default function PassengersPage() {
  const router = useRouter();
  // Using mock data for UI visualization. Later this will be fetched from API.
  const [passengers, setPassengers] = useState([
    {
      id: '1',
      firstName: 'Jay',
      lastName: 'Cruz',
      documentType: 'PASSPORT',
      documentNumber: 'E12345678',
      nationality: 'Myanmar',
      isDefault: true
    },
    {
      id: '2',
      firstName: 'Jane',
      lastName: 'Doe',
      documentType: 'NATIONAL_ID',
      documentNumber: '12/MGT(N)123456',
      nationality: 'Myanmar',
      isDefault: false
    }
  ]);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-brand-gray pb-20">
        {/* Header */}
        <div className="bg-brand-surface sticky top-0 z-20 px-4 pt-safe-top pb-4 flex items-center justify-between shadow-sm">
          <button onClick={() => router.back()} className="p-2 -ml-2 text-brand-charcoal">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-bold text-brand-charcoal">Passenger Info</h1>
          <div className="w-8"></div> {/* Spacer for centering */}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col gap-4">
          <p className="text-sm text-brand-text-accent mb-2">
            Manage your travel companions' details for faster bookings.
          </p>

          {passengers.map((passenger) => (
            <div key={passenger.id} className="bg-brand-surface rounded-2xl p-4 shadow-sm border border-brand-text-accent/5 relative overflow-hidden">
              {passenger.isDefault && (
                <div className="absolute top-0 right-0 bg-brand-orange text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg">
                  DEFAULT
                </div>
              )}
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-brand-gray rounded-full flex items-center justify-center text-brand-text-accent shrink-0">
                  <User size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-brand-charcoal text-lg">
                    {passenger.lastName}, {passenger.firstName}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-brand-text-accent mt-1">
                    <FileText size={14} />
                    <span>{passenger.documentType === 'PASSPORT' ? 'Passport' : 'National ID'}</span>
                    <span className="w-1 h-1 bg-brand-text-accent/30 rounded-full mx-1"></span>
                    <span className="font-mono">{passenger.documentNumber}</span>
                  </div>
                  <div className="text-xs text-brand-text-accent/70 mt-1">
                    Nationality: {passenger.nationality}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-4 pt-3 border-t border-brand-text-accent/5">
                <button className="flex items-center gap-1.5 text-sm font-medium text-brand-text-accent hover:text-brand-charcoal transition-colors">
                  <Edit2 size={16} /> Edit
                </button>
                <button className="flex items-center gap-1.5 text-sm font-medium text-rose-500 hover:text-rose-600 transition-colors">
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))}

          {/* Add New Button */}
          <button className="mt-4 w-full bg-white border-2 border-dashed border-brand-orange/30 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 text-brand-orange hover:bg-brand-orange/5 transition-colors">
            <div className="w-10 h-10 bg-brand-orange/10 rounded-full flex items-center justify-center">
              <Plus size={24} />
            </div>
            <span className="font-bold">Add New Passenger</span>
          </button>
        </div>
      </div>
    </AuthGuard>
  );
}