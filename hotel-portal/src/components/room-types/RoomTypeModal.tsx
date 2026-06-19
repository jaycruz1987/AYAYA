import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Switch } from 'antd';
import { RoomType } from '@/types/room-type';
import ImageUpload from '../common/ImageUpload';

interface RoomTypeModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => Promise<void>;
  initialData?: RoomType | null;
  loading?: boolean;
}

export default function RoomTypeModal({
  open,
  onCancel,
  onSubmit,
  initialData,
  loading
}: RoomTypeModalProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      if (initialData) {
        form.setFieldsValue({
          ...initialData,
          isActive: initialData.status === 'ACTIVE'
        });
      } else {
        form.resetFields();
        form.setFieldsValue({ maxOccupancy: 2, isActive: true });
      }
    }
  }, [open, initialData, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        ...values,
        status: values.isActive ? 'ACTIVE' : 'INACTIVE'
      };
      delete payload.isActive;
      await onSubmit(payload);
      form.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <Modal
      title={initialData ? 'Edit Room Type' : 'Add Room Type'}
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      confirmLoading={loading}
      destroyOnClose
      width={600}
    >
      <Form form={form} layout="vertical" className="mt-4">
        <Form.Item
          name="name"
          label="Room Type Name"
          rules={[{ required: true, message: 'Please enter room type name' }]}
        >
          <Input placeholder="e.g., Deluxe Double Room" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
        >
          <Input.TextArea rows={3} placeholder="Room description..." />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="basePrice"
            label="Base Price"
            rules={[{ required: true, message: 'Please enter price' }]}
          >
            <InputNumber min={0} step={0.01} className="w-full" prefix="$" />
          </Form.Item>

          <Form.Item
            name="maxOccupancy"
            label="Max Occupancy"
            rules={[{ required: true }]}
          >
            <InputNumber min={1} className="w-full" />
          </Form.Item>
        </div>

        <Form.Item
          name="bedType"
          label="Bed Type"
        >
          <Input placeholder="e.g., 1 King Bed" />
        </Form.Item>

        <Form.Item
          name="roomSizeSqm"
          label="Room Size (sqm)"
        >
          <InputNumber min={0} className="w-full" />
        </Form.Item>

        <Form.Item
          name="coverImageUrl"
          label="Cover Image"
        >
          <ImageUpload
            value={form.getFieldValue('coverImageUrl')}
            onChange={(url) => form.setFieldsValue({ coverImageUrl: url })}
          />
        </Form.Item>

        <Form.Item
          name="isActive"
          label="Status"
          valuePropName="checked"
        >
          <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
        </Form.Item>
      </Form>
    </Modal>
  );
}