'use client';

import React, { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Table, Typography, Button, Tag, Space, Popconfirm, Rate } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { useHotels, useDeleteHotel } from '@/hooks/useHotels';
import { Hotel } from '@/types/hotel';
import HotelModal from '@/components/hotels/HotelModal';
import { useRouter } from 'next/navigation';

const { Title } = Typography;

export default function HotelsPage() {
  const { data: hotelsData, isLoading } = useHotels();
  const deleteMutation = useDeleteHotel();
  const router = useRouter();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null);

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleEdit = (hotel: Hotel) => {
    setEditingHotel(hotel);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingHotel(null);
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
      title: 'City',
      dataIndex: 'city',
      key: 'city',
    },
    {
      title: 'Star Rating',
      dataIndex: 'starRating',
      key: 'starRating',
      render: (rating: number | null) => rating ? <Rate disabled defaultValue={rating} /> : 'N/A',
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
      render: (_: any, record: Hotel) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<UnorderedListOutlined />} 
            className="text-green-600" 
            onClick={() => router.push(`/hotels/${record.id}`)}
            title="Manage Room Types"
          />
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            className="text-blue-600" 
            onClick={() => handleEdit(record)}
            title="Edit Hotel"
          />
          <Popconfirm
            title="Delete the hotel"
            description="Are you sure to delete this hotel?"
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
        <Title level={2} className="m-0">Hotels</Title>
        <Button type="primary" icon={<PlusOutlined />} size="large" onClick={handleCreate}>
          Add Hotel
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={hotelsData?.data || []}
        rowKey="id"
        loading={isLoading}
        pagination={{ pageSize: 10 }}
        className="shadow-sm border border-gray-100 rounded-lg"
      />

      <HotelModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingHotel={editingHotel}
      />
    </AdminLayout>
  );
}
