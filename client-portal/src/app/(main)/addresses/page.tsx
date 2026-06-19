'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Plus, Edit2, Trash2, MapPin } from 'lucide-react';
import { useClientAddresses } from '@/hooks/client/useClientAddresses';
import { Modal, Form, Input, Switch, message } from 'antd';
import { UserAddress } from '@/types/address';

import AuthGuard from '@/components/auth/AuthGuard';

export default function AddressesPage() {
  const router = useRouter();
  const { addresses, isLoading, createAddress, updateAddress, deleteAddress } = useClientAddresses();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm();

  const handleAdd = () => {
    setEditingId(null);
    form.resetFields();
    form.setFieldsValue({ isDefault: false });
    setIsModalOpen(true);
  };

  const handleEdit = (address: UserAddress) => {
    setEditingId(address.id);
    form.setFieldsValue(address);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAddress(id);
    } catch (error) {
      console.error(error);
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingId) {
        await updateAddress({ id: editingId, data: values });
      } else {
        await createAddress(values);
      }
      setIsModalOpen(false);
    } catch (error: any) {
      if (error.errorFields) {
        // Validation error from Ant Design Form
        console.log('Validation failed:', error);
      } else {
        // API error
        console.error('API error:', error);
        message.error(error?.message || 'Failed to save address');
      }
    }
  };

  const addressesList = Array.isArray(addresses) ? addresses : [];

  return (
    <AuthGuard>
      <div className="min-h-screen bg-brand-gray pb-20">
      <div className="bg-brand-surface px-4 py-3 flex items-center border-b border-brand-text-accent/10 sticky top-0 z-20 pt-safe-top">
        <button onClick={() => router.back()} className="p-2 -ml-2">
          <ChevronLeft size={24} className="text-brand-charcoal" />
        </button>
        <h1 className="text-lg font-bold text-brand-charcoal ml-2">My Addresses</h1>
      </div>

      <div className="p-4 flex flex-col gap-3">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-orange"></div>
          </div>
        ) : addressesList.length === 0 ? (
          <div className="text-center py-10">
            <div className="w-20 h-20 bg-brand-gray border border-brand-text-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin size={32} className="text-brand-text-accent/70" />
            </div>
            <p className="text-brand-text-accent mb-4">No addresses saved yet</p>
          </div>
        ) : (
          addressesList.map((address: UserAddress) => (
            <div key={address.id} className="bg-brand-surface p-4 rounded-xl shadow-sm border border-brand-text-accent/10 relative">
              {address.isDefault && (
                <div className="absolute top-4 right-4 bg-brand-orange-light text-brand-orange text-xs px-2 py-0.5 rounded font-bold">
                  Default
                </div>
              )}
              <h3 className="font-bold text-brand-charcoal mb-1">{address.contactName} • {address.contactPhone}</h3>
              <p className="text-brand-text-accent text-sm mb-1">{address.addressLine}</p>
              <p className="text-brand-text-accent text-xs mb-3">
                {[address.buildingName, address.floor, address.roomNo, address.city].filter(Boolean).join(', ')}
              </p>
              
              <div className="flex gap-4 border-t border-brand-text-accent/10 pt-3 mt-1">
                <button 
                  onClick={() => handleEdit(address)}
                  className="text-brand-orange text-sm font-medium flex items-center gap-1"
                >
                  <Edit2 size={14} /> Edit
                </button>
                <button 
                  onClick={() => handleDelete(address.id)}
                  className="text-red-500 text-sm font-medium flex items-center gap-1"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          ))
        )}

        <button 
          onClick={handleAdd}
          className="mt-4 bg-brand-surface border-2 border-dashed border-brand-orange-light text-brand-orange rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-brand-orange-light transition-colors"
        >
          <Plus size={24} />
          <span className="font-bold">Add New Address</span>
        </button>
      </div>

      <Modal
        title={editingId ? "Edit Address" : "Add Address"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        destroyOnHidden
        okText="Save"
        forceRender
      >
        <Form form={form} layout="vertical" className="mt-4" onFinish={handleOk}>
          <Form.Item name="contactName" label="Contact Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="contactPhone" label="Phone Number" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="addressLine" label="Street Address" rules={[{ required: true }]}>
            <Input.TextArea rows={2} />
          </Form.Item>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="buildingName" label="Building">
              <Input />
            </Form.Item>
            <Form.Item name="city" label="City" rules={[{ required: true, message: 'City is required by backend' }]}>
              <Input />
            </Form.Item>
          </div>
          <Form.Item name="isDefault" valuePropName="checked">
            <Switch checkedChildren="Default" unCheckedChildren="Not Default" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
    </AuthGuard>
  );
}