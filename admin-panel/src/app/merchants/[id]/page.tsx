'use client';

import React, { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Table, Typography, Button, Tag, Space, Popconfirm, Breadcrumb } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useProductsByMerchant, useDeleteProduct } from '@/hooks/useProducts';
import { useMerchant } from '@/hooks/useMerchants';
import { Product } from '@/types/product';
import ProductModal from '@/components/products/ProductModal';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

const { Title } = Typography;

export default function MerchantProductsPage() {
  const params = useParams();
  const router = useRouter();
  const merchantId = params.id as string;
  
  const { data: merchantResponse } = useMerchant(merchantId);
  const { data: productsData, isLoading } = useProductsByMerchant(merchantId);
  const deleteMutation = useDeleteProduct(merchantId);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const columns = [
    {
      title: 'Image',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      render: (url: string) => url ? (
        <img src={url} alt="product" className="w-12 h-12 object-cover rounded-md" />
      ) : (
        <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center text-xs text-gray-400">No Img</div>
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <span className="font-medium">{text}</span>,
    },
    {
      title: 'Category',
      dataIndex: ['category', 'name'],
      key: 'category',
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
        <Tag color={status === 'ON_SHELF' ? 'success' : 'default'}>
          {status === 'ON_SHELF' ? 'On Shelf' : 'Off Shelf'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Product) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            className="text-blue-600" 
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Delete the product"
            description="Are you sure to delete this product?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="text" danger icon={<DeleteOutlined />} loading={deleteMutation.isPending} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <AdminLayout>
      <Breadcrumb className="mb-4">
        <Breadcrumb.Item>
          <Link href="/merchants">Merchants</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          {merchantResponse?.data?.name || 'Loading...'}
        </Breadcrumb.Item>
        <Breadcrumb.Item>Products</Breadcrumb.Item>
      </Breadcrumb>

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Button icon={<ArrowLeftOutlined />} onClick={() => router.push('/merchants')} />
          <Title level={2} className="m-0">Products Menu</Title>
        </div>
        <Button type="primary" icon={<PlusOutlined />} size="large" onClick={handleCreate}>
          Add Product
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={productsData?.data || []}
        rowKey="id"
        loading={isLoading}
        pagination={{ pageSize: 10 }}
        className="shadow-sm border border-gray-100 rounded-lg"
      />

      <ProductModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingProduct={editingProduct}
        merchantId={merchantId}
      />
    </AdminLayout>
  );
}
