'use client';

import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, InputNumber } from 'antd';
import { RoomType } from '@/types/room-type';
import { useCreateRoomType, useUpdateRoomType } from '@/hooks/useRoomTypes';
import ImageUpload from '@/components/common/ImageUpload';

const { Option } = Select;
const { TextArea } = Input;

interface RoomTypeModalProps {
  open: boolean;
  onClose: () => void;
  editingRoomType: RoomType | null;
  hotelId: string;
}

export default function RoomTypeModal({ open, onClose, editingRoomType, hotelId }: RoomTypeModalProps) {
  const [form] = Form.useForm();
  const createMutation = useCreateRoomType(hotelId);
  const updateMutation = useUpdateRoomType(hotelId);

  useEffect(() => {
    if (open) {
      if (editingRoomType) {
        form.setFieldsValue({
          ...editingRoomType,
          basePrice: Number(editingRoomType.basePrice),
          capacity: editingRoomType.maxOccupancy ? Number(editingRoomType.maxOccupancy) : 2,
          roomSizeSqm: editingRoomType.roomSizeSqm ? Number(editingRoomType.roomSizeSqm) : null,
          coverImage: editingRoomType.coverImageUrl || (editingRoomType.imageUrls && editingRoomType.imageUrls.length > 0 ? editingRoomType.imageUrls[0] : undefined),
        });
      } else {
        form.resetFields();
      }
    }
  }, [open, editingRoomType, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      const payload = {
        name: values.name,
        description: values.description || null,
        bedType: values.bedType || null,
        basePrice: Number(values.basePrice || 0),
        maxOccupancy: Number(values.capacity || 1),
        roomSizeSqm: values.roomSizeSqm ? Number(values.roomSizeSqm) : null,
        coverImageUrl: values.coverImage || null,
        imageUrls: values.coverImage ? [values.coverImage] : [],
        facilities: values.facilities && values.facilities.length > 0 ? values.facilities : [],
        status: values.status || 'ACTIVE',
      };
      
      if (editingRoomType) {
        await updateMutation.mutateAsync({ id: editingRoomType.id, data: payload });
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
      title={editingRoomType ? 'Edit Room Type' : 'Add New Room Type'}
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
          capacity: 2,
        }}
      >
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="name"
            label="Room Type Name"
            rules={[{ required: true, message: 'Please enter room type name' }]}
            className="col-span-2"
          >
            <Input placeholder="e.g. Deluxe Double Room" />
          </Form.Item>

          <Form.Item name="coverImage" label="Room Image">
            <ImageUpload />
          </Form.Item>

          <Form.Item name="bedType" label="Bed Type">
            <Input placeholder="e.g. 1 King Bed" />
          </Form.Item>

          <Form.Item name="basePrice" label="Base Price (per night)" rules={[{ required: true }]}>
            <InputNumber min={0} className="w-full" prefix="$" />
          </Form.Item>

          <Form.Item name="capacity" label="Guest Capacity" rules={[{ required: true }]}>
            <InputNumber min={1} className="w-full" />
          </Form.Item>

          <Form.Item name="roomSizeSqm" label="Room Size (sqm)">
            <InputNumber min={0} className="w-full" suffix="m²" />
          </Form.Item>

          <Form.Item name="status" label="Status">
            <Select>
              <Option value="ACTIVE">Active</Option>
              <Option value="INACTIVE">Inactive</Option>
            </Select>
          </Form.Item>

          <Form.Item name="facilities" label="Facilities (Press Enter to add)" className="col-span-2">
            <Select mode="tags" placeholder="e.g. WiFi, Air Conditioning, Balcony">
            </Select>
          </Form.Item>

          <Form.Item name="description" label="Description" className="col-span-2">
            <TextArea rows={3} placeholder="Spacious room with a beautiful city view..." />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
}
