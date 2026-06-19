'use client';

import React, { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Table, Typography, Button, Tag, Space, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { useMerchants, useDeleteMerchant } from '@/hooks/useMerchants';
import { Merchant } from '@/types/merchant';
import MerchantModal from '@/components/merchants/MerchantModal';
import { useRouter } from 'next/navigation';

const { Title } = Typography;

export default function MerchantsPage() {
  const { data: merchantsData, isLoading } = useMerchants();
  const deleteMutation = useDeleteMerchant();
  const router = useRouter();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMerchant, setEditingMerchant] = useState<Merchant | null>(null);

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleEdit = (merchant: Merchant) => {
    setEditingMerchant(merchant);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingMerchant(null);
    setIsModalOpen(true);
  };

  const columns = [
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
      title: 'City',
      dataIndex: 'city',
      key: 'city',
    },
    {
      title: 'Service Mode',
      dataIndex: 'serviceMode',
      key: 'serviceMode',
      render: (mode: string) => {
        const colors: Record<string, string> = {
          DELIVERY: 'blue',
          PICKUP: 'green',
          DINE_IN: 'purple',
        };
        return <Tag color={colors[mode] || 'default'}>{mode}</Tag>;
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'ACTIVE' ? 'success' : 'error'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Merchant) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<UnorderedListOutlined />} 
            className="text-green-600" 
            onClick={() => router.push(`/merchants/${record.id}`)}
            title="Manage Products"
          />
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            className="text-blue-600" 
            onClick={() => handleEdit(record)}
            title="Edit Merchant"
          />
          <Popconfirm
            title="Delete the merchant"
            description="Are you sure to delete this merchant?"
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
      <div className="flex justify-between items-center mb-6">
        <Title level={2} className="m-0">Merchants</Title>
        <Button type="primary" icon={<PlusOutlined />} size="large" onClick={handleCreate}>
          Add Merchant
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={merchantsData?.data || []}
        rowKey="id"
        loading={isLoading}
        pagination={{ pageSize: 10 }}
        className="shadow-sm border border-gray-100 rounded-lg"
      />

      <MerchantModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingMerchant={editingMerchant}
      />
    </AdminLayout>
  );
}
