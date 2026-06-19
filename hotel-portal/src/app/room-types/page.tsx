'use client';

import React, { useState } from 'react';
import HotelLayout from '@/components/layout/HotelLayout';
import { Table, Button, Space, Tag, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useHotelRoomTypes } from '@/hooks/hotel/useHotelRoomTypes';
import { RoomType } from '@/types/room-type';
import RoomTypeModal from '@/components/room-types/RoomTypeModal';

export default function RoomTypesPage() {
  const { 
    roomTypes, 
    isLoading, 
    createRoomType, 
    updateRoomType, 
    deleteRoomType,
    isCreating,
    isUpdating
  } = useHotelRoomTypes();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoomType, setEditingRoomType] = useState<RoomType | null>(null);

  const handleAdd = () => {
    setEditingRoomType(null);
    setIsModalOpen(true);
  };

  const handleEdit = (record: RoomType) => {
    setEditingRoomType(record);
    setIsModalOpen(true);
  };

  const handleSubmit = async (values: any) => {
    if (editingRoomType) {
      await updateRoomType({ id: editingRoomType.id, data: values });
    } else {
      await createRoomType(values);
    }
    setIsModalOpen(false);
  };

  const columns = [
    {
      title: 'Image',
      dataIndex: 'coverImageUrl',
      key: 'coverImageUrl',
      render: (url: string) => url ? (
        <img src={url} alt="Room" className="w-16 h-12 object-cover rounded" />
      ) : (
        <div className="w-16 h-12 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs">No img</div>
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: RoomType) => (
        <div>
          <div className="font-medium">{text}</div>
          <div className="text-xs text-gray-500">{record.bedType}</div>
        </div>
      ),
    },
    {
      title: 'Base Price',
      dataIndex: 'basePrice',
      key: 'basePrice',
      render: (price: number) => `$${Number(price).toFixed(2)}`,
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
        <Tag color={status === 'ACTIVE' ? 'green' : 'red'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: RoomType) => (
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
            title="Delete room type"
            description="Are you sure you want to delete this room type?"
            onConfirm={() => deleteRoomType(record.id)}
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
    <HotelLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 m-0">Room Types</h1>
          <p className="text-gray-500 mt-1">Manage your hotel rooms</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} size="large">
          Add Room Type
        </Button>
      </div>

      <Table 
        columns={columns} 
        dataSource={Array.isArray(roomTypes) ? roomTypes : []} 
        rowKey="id"
        loading={isLoading}
        className="bg-white rounded-lg"
      />

      <RoomTypeModal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingRoomType}
        loading={isCreating || isUpdating}
      />
    </HotelLayout>
  );
}