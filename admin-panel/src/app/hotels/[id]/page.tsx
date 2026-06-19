'use client';

import React, { useState, use } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Table, Typography, Button, Tag, Space, Popconfirm, Breadcrumb } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useRoomTypesByHotel, useDeleteRoomType } from '@/hooks/useRoomTypes';
import { useHotel } from '@/hooks/useHotels';
import { RoomType } from '@/types/room-type';
import RoomTypeModal from '@/components/room-types/RoomTypeModal';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const { Title } = Typography;

export default function HotelRoomTypesPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  // Unwrap the Promise params for Next.js 15+ 
  const unwrappedParams = use(params);
  const hotelId = unwrappedParams.id;
  
  const { data: hotelResponse } = useHotel(hotelId);
  const { data: roomTypesData, isLoading } = useRoomTypesByHotel(hotelId);
  const deleteMutation = useDeleteRoomType(hotelId);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoomType, setEditingRoomType] = useState<RoomType | null>(null);

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleEdit = (roomType: RoomType) => {
    setEditingRoomType(roomType);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingRoomType(null);
    setIsModalOpen(true);
  };

  const columns = [
    {
      title: 'Image',
      key: 'image',
      render: (_: any, record: RoomType) => {
        const url = record.coverImageUrl || (record.imageUrls && record.imageUrls.length > 0 ? record.imageUrls[0] : null);
        return url ? (
          <img src={url} alt="room" className="w-16 h-12 object-cover rounded-md" />
        ) : (
          <div className="w-16 h-12 bg-gray-100 rounded-md flex items-center justify-center text-xs text-gray-400">No Img</div>
        );
      },
    },
    {
      title: 'Room Type Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <span className="font-medium">{text}</span>,
    },
    {
      title: 'Bed Type',
      dataIndex: 'bedType',
      key: 'bedType',
    },
    {
      title: 'Base Price',
      dataIndex: 'basePrice',
      key: 'basePrice',
      render: (price: number) => `$${Number(price).toFixed(2)} / night`,
    },
    {
      title: 'Capacity',
      dataIndex: 'maxOccupancy',
      key: 'maxOccupancy',
      render: (capacity: number) => `${capacity} Person(s)`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'ACTIVE' ? 'success' : 'default'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: RoomType) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            className="text-blue-600" 
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Delete the room type"
            description="Are you sure to delete this room type?"
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
          <Link href="/hotels">Hotels</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          {hotelResponse?.data?.name || 'Loading...'}
        </Breadcrumb.Item>
        <Breadcrumb.Item>Room Types</Breadcrumb.Item>
      </Breadcrumb>

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Button icon={<ArrowLeftOutlined />} onClick={() => router.push('/hotels')} />
          <Title level={2} className="m-0">Room Types</Title>
        </div>
        <Button type="primary" icon={<PlusOutlined />} size="large" onClick={handleCreate}>
          Add Room Type
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={roomTypesData?.data || []}
        rowKey="id"
        loading={isLoading}
        pagination={{ pageSize: 10 }}
        className="shadow-sm border border-gray-100 rounded-lg"
      />

      <RoomTypeModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingRoomType={editingRoomType}
        hotelId={hotelId}
      />
    </AdminLayout>
  );
}
