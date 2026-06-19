import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Switch } from 'antd';
import { ProductCategory } from '@/types/product-category';

interface CategoryModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => Promise<void>;
  initialData?: ProductCategory | null;
  loading?: boolean;
}

export default function CategoryModal({
  open,
  onCancel,
  onSubmit,
  initialData,
  loading
}: CategoryModalProps) {
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
        form.setFieldsValue({ sortOrder: 0, isActive: true });
      }
    }
  }, [open, initialData, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        name: values.name,
        sortOrder: values.sortOrder,
        status: values.isActive ? 'ACTIVE' : 'INACTIVE'
      };
      await onSubmit(payload);
      form.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <Modal
      title={initialData ? 'Edit Category' : 'Add Category'}
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      confirmLoading={loading}
      destroyOnClose
    >
      <Form form={form} layout="vertical" className="mt-4">
        <Form.Item
          name="name"
          label="Category Name"
          rules={[{ required: true, message: 'Please enter category name' }]}
        >
          <Input placeholder="e.g., Main Course, Drinks" />
        </Form.Item>

        <Form.Item
          name="sortOrder"
          label="Sort Order"
          rules={[{ required: true }]}
        >
          <InputNumber min={0} className="w-full" />
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