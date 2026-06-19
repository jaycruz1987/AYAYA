import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, Switch } from 'antd';
import { Product } from '@/types/product';
import { useMerchantCategories } from '@/hooks/merchant/useMerchantCategories';
import ImageUpload from '../common/ImageUpload';

interface ProductModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => Promise<void>;
  initialData?: Product | null;
  loading?: boolean;
}

export default function ProductModal({
  open,
  onCancel,
  onSubmit,
  initialData,
  loading
}: ProductModalProps) {
  const [form] = Form.useForm();
  const { categories, isLoading: isCategoriesLoading } = useMerchantCategories();

  useEffect(() => {
    if (open) {
      if (initialData) {
        form.setFieldsValue({
          ...initialData,
          isOnShelf: initialData.status === 'ON_SHELF'
        });
      } else {
        form.resetFields();
        form.setFieldsValue({ stock: -1, isOnShelf: true });
      }
    }
  }, [open, initialData, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        ...values,
        status: values.isOnShelf ? 'ON_SHELF' : 'OFF_SHELF'
      };
      delete payload.isOnShelf;
      await onSubmit(payload);
      form.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <Modal
      title={initialData ? 'Edit Product' : 'Add Product'}
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      confirmLoading={loading}
      destroyOnClose
      width={600}
    >
      <Form form={form} layout="vertical" className="mt-4">
        <Form.Item
          name="categoryId"
          label="Category"
          rules={[{ required: true, message: 'Please select a category' }]}
        >
          <Select 
            placeholder="Select category" 
            loading={isCategoriesLoading}
            options={Array.isArray(categories) ? categories.map((c: any) => ({ label: c.name, value: c.id })) : []}
          />
        </Form.Item>

        <Form.Item
          name="name"
          label="Product Name"
          rules={[{ required: true, message: 'Please enter product name' }]}
        >
          <Input placeholder="e.g., Spicy Chicken Burger" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
        >
          <Input.TextArea rows={3} placeholder="Product description..." />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: 'Please enter price' }]}
          >
            <InputNumber min={0} step={0.01} className="w-full" prefix="$" />
          </Form.Item>

          <Form.Item
            name="stock"
            label="Stock (-1 for unlimited)"
            rules={[{ required: true }]}
          >
            <InputNumber min={-1} className="w-full" />
          </Form.Item>
        </div>

        <Form.Item
          name="imageUrl"
          label="Product Image"
        >
          <ImageUpload
            value={form.getFieldValue('imageUrl')}
            onChange={(url) => form.setFieldsValue({ imageUrl: url })}
          />
        </Form.Item>

        <Form.Item
          name="isOnShelf"
          label="Status"
          valuePropName="checked"
        >
          <Switch checkedChildren="On Shelf" unCheckedChildren="Off Shelf" />
        </Form.Item>
      </Form>
    </Modal>
  );
}