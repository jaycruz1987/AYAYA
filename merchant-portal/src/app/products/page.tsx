'use client';

import React, { useState } from 'react';
import MerchantLayout from '@/components/layout/MerchantLayout';
import { Table, Button, Space, Tag, Popconfirm, Select } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useMerchantProducts } from '@/hooks/merchant/useMerchantProducts';
import { useMerchantCategories } from '@/hooks/merchant/useMerchantCategories';
import { Product } from '@/types/product';
import ProductModal from '@/components/products/ProductModal';

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>();
  const { categories } = useMerchantCategories();
  
  const { 
    products, 
    isLoading, 
    createProduct, 
    updateProduct, 
    deleteProduct,
    isCreating,
    isUpdating
  } = useMerchantProducts(selectedCategory);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleAdd = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEdit = (record: Product) => {
    setEditingProduct(record);
    setIsModalOpen(true);
  };

  const handleSubmit = async (values: any) => {
    if (editingProduct) {
      await updateProduct({ id: editingProduct.id, data: values });
    } else {
      await createProduct(values);
    }
    setIsModalOpen(false);
  };

  const columns = [
    {
      title: 'Image',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      render: (url: string) => url ? (
        <img src={url} alt="Product" className="w-12 h-12 object-cover rounded" />
      ) : (
        <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs">No img</div>
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Product) => (
        <div>
          <div className="font-medium">{text}</div>
          <div className="text-xs text-gray-500">{record.category?.name}</div>
        </div>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `$${Number(price).toFixed(2)}`,
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      render: (stock: number) => stock === -1 ? <Tag color="blue">Unlimited</Tag> : stock,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'ON_SHELF' ? 'green' : 'red'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Product) => (
        <Space>
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
            className="text-blue-600 hover:text-blue-800"
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete product"
            description="Are you sure you want to delete this product?"
            onConfirm={() => deleteProduct(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <MerchantLayout>
      <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 m-0">Products</h1>
          <p className="text-gray-500 mt-1">Manage your menu items</p>
        </div>
        
        <div className="flex items-center gap-4">
          <Select
            allowClear
            placeholder="Filter by Category"
            style={{ width: 200 }}
            onChange={setSelectedCategory}
            options={Array.isArray(categories) ? categories.map((c: any) => ({ label: c.name, value: c.id })) : []}
            size="large"
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} size="large">
            Add Product
          </Button>
        </div>
      </div>

      <Table 
        columns={columns} 
        dataSource={Array.isArray(products) ? products : []} 
        rowKey="id"
        loading={isLoading}
        className="bg-white rounded-lg"
      />

      <ProductModal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingProduct}
        loading={isCreating || isUpdating}
      />
    </MerchantLayout>
  );
}