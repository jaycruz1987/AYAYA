'use client';

import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, InputNumber, Switch, Rate } from 'antd';
import { Hotel } from '@/types/hotel';
import { useCreateHotel, useUpdateHotel } from '@/hooks/useHotels';
import ImageUpload from '@/components/common/ImageUpload';

const { Option } = Select;
const { TextArea } = Input;

interface HotelModalProps {
  open: boolean;
  onClose: () => void;
  editingHotel: Hotel | null;
}

export default function HotelModal({ open, onClose, editingHotel }: HotelModalProps) {
  const [form] = Form.useForm();
  const createMutation = useCreateHotel();
  const updateMutation = useUpdateHotel();

  useEffect(() => {
    if (open) {
      if (editingHotel) {
        form.setFieldsValue(editingHotel);
      } else {
        form.resetFields();
      }
    }
  }, [open, editingHotel, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      const payload = {
        name: values.name,
        starRating: values.starRating ? Number(values.starRating) : null,
        description: values.description || null,
        coverImageUrl: values.coverImageUrl || null,
        contactName: values.contactName || null,
        contactPhone: values.contactPhone || null,
        addressLine: values.addressLine || null, // Ensure this isn't undefined if DB requires it
        city: values.city, // Usually required
        township: values.township || null,
        landmark: values.landmark || null,
        buildingName: values.buildingName || null,
        facilities: values.facilities && values.facilities.length > 0 ? values.facilities : [], // Prisma Json usually wants valid array or object, not null if typed as JSON? maybe null is fine, let's use [] to be safe if no facilities
        isFeatured: Boolean(values.isFeatured),
        status: values.status || 'ACTIVE',
      };
      
      if (editingHotel) {
        await updateMutation.mutateAsync({ id: editingHotel.id, data: payload });
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
      title={editingHotel ? 'Edit Hotel' : 'Add New Hotel'}
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
          status: 'ACTIVE',
          isFeatured: false,
          starRating: 0,
        }}
      >
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="name"
            label="Hotel Name"
            rules={[{ required: true, message: 'Please enter hotel name' }]}
            className="col-span-2"
          >
            <Input placeholder="e.g. Grand Citylink Hotel" />
          </Form.Item>

          <Form.Item name="coverImageUrl" label="Cover Image" className="col-span-2">
            <ImageUpload />
          </Form.Item>

          <Form.Item name="starRating" label="Star Rating">
            <Rate />
          </Form.Item>

          <Form.Item name="contactName" label="Contact Name">
            <Input placeholder="e.g. Jane Doe" />
          </Form.Item>

          <Form.Item name="contactPhone" label="Contact Phone">
            <Input placeholder="e.g. +1234567890" />
          </Form.Item>

          <Form.Item name="city" label="City" rules={[{ required: true }]}>
            <Input placeholder="e.g. Bangkok" />
          </Form.Item>

          <Form.Item name="township" label="Township">
            <Input placeholder="e.g. Sukhumvit" />
          </Form.Item>

          <Form.Item name="addressLine" label="Address Line" className="col-span-2">
            <TextArea rows={2} placeholder="Full address" />
          </Form.Item>

          <Form.Item name="facilities" label="Facilities (Press Enter to add)" className="col-span-2">
            <Select mode="tags" placeholder="e.g. wifi, pool, parking">
            </Select>
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
