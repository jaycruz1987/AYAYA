'use client';

import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, InputNumber, Switch } from 'antd';
import { Product } from '@/types/product';
import { useCreateProduct, useUpdateProduct, useProductCategoriesByMerchant } from '@/hooks/useProducts';
import ImageUpload from '@/components/common/ImageUpload';

const { Option } = Select;
const { TextArea } = Input;

interface ProductModalProps {
  open: boolean;
  onClose: () => void;
  editingProduct: Product | null;
  merchantId: string;
}

export default function ProductModal({ open, onClose, editingProduct, merchantId }: ProductModalProps) {
  const [form] = Form.useForm();
  const createMutation = useCreateProduct(merchantId);
  const updateMutation = useUpdateProduct(merchantId);
  const { data: categoriesResponse, isLoading: isCategoriesLoading } = useProductCategoriesByMerchant(merchantId);

  useEffect(() => {
    if (open) {
      if (editingProduct) {
        form.setFieldsValue({
          ...editingProduct,
          price: Number(editingProduct.price),
        });
      } else {
        form.resetFields();
      }
    }
  }, [open, editingProduct, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      const payload = {
        name: values.name,
        categoryId: values.categoryId, // Must be required
        description: values.description || null,
        imageUrl: values.imageUrl || null,
        price: Number(values.price || 0),
        stock: Number(values.stock || 0),
        status: values.status || 'ON_SHELF',
      };
      
      if (editingProduct) {
        await updateMutation.mutateAsync({ id: editingProduct.id, data: payload });
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
      title={editingProduct ? 'Edit Product' : 'Add New Product'}
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
          status: 'ON_SHELF',
          stock: -1, // -1 implies unlimited based on our DB rules
        }}
      >
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="name"
            label="Product Name"
            rules={[{ required: true, message: 'Please enter product name' }]}
            className="col-span-2"
          >
            <Input placeholder="e.g. Tom Yum Goong" />
          </Form.Item>

          <Form.Item name="imageUrl" label="Product Image">
            <ImageUpload />
          </Form.Item>

          <Form.Item name="categoryId" label="Category" rules={[{ required: true, message: 'Please select a category' }]}>
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

          <Form.Item name="price" label="Price" rules={[{ required: true }]}>
            <InputNumber min={0} className="w-full" prefix="$" />
          </Form.Item>

          <Form.Item name="stock" label="Stock (-1 for unlimited)" rules={[{ required: true }]}>
            <InputNumber className="w-full" />
          </Form.Item>

          <Form.Item name="description" label="Description" className="col-span-2">
            <TextArea rows={3} placeholder="Delicious spicy shrimp soup..." />
          </Form.Item>

          <Form.Item name="status" label="Status">
            <Select>
              <Option value="ON_SHELF">On Shelf</Option>
              <Option value="OFF_SHELF">Off Shelf</Option>
            </Select>
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
}
