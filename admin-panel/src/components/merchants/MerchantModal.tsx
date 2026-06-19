'use client';

import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, InputNumber, Switch } from 'antd';
import { Merchant } from '@/types/merchant';
import { useCreateMerchant, useUpdateMerchant } from '@/hooks/useMerchants';
import { useMerchantCategories } from '@/hooks/useMerchantCategories';
import ImageUpload from '@/components/common/ImageUpload';

const { Option } = Select;
const { TextArea } = Input;

interface MerchantModalProps {
  open: boolean;
  onClose: () => void;
  editingMerchant: Merchant | null;
}

export default function MerchantModal({ open, onClose, editingMerchant }: MerchantModalProps) {
  const [form] = Form.useForm();
  const createMutation = useCreateMerchant();
  const updateMutation = useUpdateMerchant();
  const { data: categoriesResponse, isLoading: isCategoriesLoading } = useMerchantCategories();

  useEffect(() => {
    if (open) {
      if (editingMerchant) {
        form.setFieldsValue({
          ...editingMerchant,
          minimumOrderAmount: Number(editingMerchant.minimumOrderAmount),
          deliveryRadiusKm: editingMerchant.deliveryRadiusKm ? Number(editingMerchant.deliveryRadiusKm) : null,
        });
      } else {
        form.resetFields();
      }
    }
  }, [open, editingMerchant, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      // Handle Decimal conversion safely - passing as number is fine, but some APIs strict require float/string. 
      // If Prisma requires Decimal, passing a Javascript Number is generally accepted by the Prisma Client.
      // But we must make sure we don't pass `null` or `undefined` to required fields.
      const payload = {
        name: values.name,
        categoryId: values.categoryId || null,
        description: values.description || null,
        logoUrl: values.logoUrl || null,
        coverImageUrl: values.coverImageUrl || null,
        contactName: values.contactName || null,
        contactPhone: values.contactPhone || null,
        addressLine: values.addressLine || null,
        city: values.city || null,
        township: values.township || null,
        landmark: values.landmark || null,
        buildingName: values.buildingName || null,
        serviceMode: values.serviceMode || 'DELIVERY',
        minimumOrderAmount: values.minimumOrderAmount !== undefined ? Number(values.minimumOrderAmount) : 0,
        deliveryRadiusKm: values.deliveryRadiusKm !== undefined && values.deliveryRadiusKm !== null ? Number(values.deliveryRadiusKm) : null,
        operatingStatus: values.operatingStatus || 'OPEN',
        isFeatured: Boolean(values.isFeatured),
        status: values.status || 'ACTIVE',
      };
      
      if (editingMerchant) {
        await updateMutation.mutateAsync({ id: editingMerchant.id, data: payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      
      onClose();
    } catch (error: any) {
      console.error('Validation failed:', error);
      if (error.response?.data) {
        console.error('Backend Error Details:', error.response.data);
      }
    }
  };

  return (
    <Modal
      title={editingMerchant ? 'Edit Merchant' : 'Add New Merchant'}
      open={open}
      onOk={handleSubmit}
      onCancel={onClose}
      confirmLoading={createMutation.isPending || updateMutation.isPending}
      width={800}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          serviceMode: 'DELIVERY',
          operatingStatus: 'OPEN',
          status: 'ACTIVE',
          isFeatured: false,
          minimumOrderAmount: 0,
        }}
      >
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="name"
            label="Merchant Name"
            rules={[{ required: true, message: 'Please enter merchant name' }]}
            className="col-span-2"
          >
            <Input placeholder="e.g. Spicy Thai Kitchen" />
          </Form.Item>

          <Form.Item name="logoUrl" label="Logo Image">
            <ImageUpload />
          </Form.Item>

          <Form.Item name="coverImageUrl" label="Cover Image">
            <ImageUpload />
          </Form.Item>

          <Form.Item name="categoryId" label="Category">
            <Select 
              placeholder="Select a category" 
              loading={isCategoriesLoading}
              allowClear
            >
              {categoriesResponse?.data?.map((category) => (
                <Option key={category.id} value={category.id}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="contactName" label="Contact Name">
            <Input placeholder="e.g. John Doe" />
          </Form.Item>

          <Form.Item name="contactPhone" label="Contact Phone">
            <Input placeholder="e.g. +1234567890" />
          </Form.Item>

          <Form.Item name="city" label="City" rules={[{ required: true }]}>
            <Input placeholder="e.g. Bangkok" />
          </Form.Item>

          <Form.Item name="township" label="Township">
            <Input placeholder="e.g. Watthana" />
          </Form.Item>

          <Form.Item name="addressLine" label="Address Line" className="col-span-2">
            <TextArea rows={2} placeholder="Full address" />
          </Form.Item>

          <Form.Item name="serviceMode" label="Service Mode">
            <Select>
              <Option value="DELIVERY">Delivery</Option>
              <Option value="PICKUP">Pickup</Option>
              <Option value="DINE_IN">Dine In</Option>
            </Select>
          </Form.Item>

          <Form.Item name="operatingStatus" label="Operating Status">
            <Select>
              <Option value="OPEN">Open</Option>
              <Option value="CLOSED">Closed</Option>
              <Option value="TEMPORARILY_CLOSED">Temporarily Closed</Option>
            </Select>
          </Form.Item>

          <Form.Item name="minimumOrderAmount" label="Min. Order Amount">
            <InputNumber min={0} className="w-full" prefix="$" />
          </Form.Item>

          <Form.Item name="deliveryRadiusKm" label="Delivery Radius (km)">
            <InputNumber min={0} className="w-full" />
          </Form.Item>

          <Form.Item name="status" label="System Status">
            <Select>
              <Option value="ACTIVE">Active</Option>
              <Option value="INACTIVE">Inactive</Option>
              <Option value="SUSPENDED">Suspended</Option>
            </Select>
          </Form.Item>

          <Form.Item name="isFeatured" label="Featured" valuePropName="checked">
            <Switch />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
}
