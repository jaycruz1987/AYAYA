'use client';

import React, { useState } from 'react';
import MerchantLayout from '@/components/layout/MerchantLayout';
import { Table, Button, Space, Tag, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useMerchantCategories } from '@/hooks/merchant/useMerchantCategories';
import { ProductCategory } from '@/types/product-category';
import CategoryModal from '@/components/categories/CategoryModal';

export default function CategoriesPage() {
  const { 
    categories, 
    isLoading, 
    createCategory, 
    updateCategory, 
    deleteCategory,
    isCreating,
    isUpdating
  } = useMerchantCategories();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ProductCategory | null>(null);

  const handleAdd = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleEdit = (record: ProductCategory) => {
    setEditingCategory(record);
    setIsModalOpen(true);
  };

  const handleSubmit = async (values: any) => {
    if (editingCategory) {
      await updateCategory({ id: editingCategory.id, data: values });
    } else {
      await createCategory(values);
    }
    setIsModalOpen(false);
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Sort Order',
      dataIndex: 'sortOrder',
      key: 'sortOrder',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'ACTIVE' ? 'green' : 'red'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: ProductCategory) => (
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
            title="Delete category"
            description="Are you sure you want to delete this category?"
            onConfirm={() => deleteCategory(record.id)}
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
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 m-0">Product Categories</h1>
          <p className="text-gray-500 mt-1">Manage your menu categories</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} size="large">
          Add Category
        </Button>
      </div>

      <Table 
        columns={columns} 
        dataSource={Array.isArray(categories) ? categories : []} 
        rowKey="id"
        loading={isLoading}
        className="bg-white rounded-lg"
      />

      <CategoryModal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingCategory}
        loading={isCreating || isUpdating}
      />
    </MerchantLayout>
  );
}