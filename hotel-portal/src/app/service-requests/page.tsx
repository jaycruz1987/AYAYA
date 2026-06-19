'use client';

import React, { useState } from 'react';
import HotelLayout from '@/components/layout/HotelLayout';
import { Table, Typography, Tag, Button, Select, Space, Input } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { useHotelServiceRequests } from '@/hooks/hotel/useHotelServiceRequests';
import ServiceRequestDrawer from '@/components/service-requests/ServiceRequestDrawer';
import { ServiceRequest } from '@/types/service-request';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Option } = Select;

export default function ServiceRequestsPage() {
  const [filters, setFilters] = useState<Record<string, string>>({});
  const { requests, isLoading } = useHotelServiceRequests(filters);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleView = (record: ServiceRequest) => {
    setSelectedRequestId(record.id);
    setDrawerOpen(true);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: 'gold',
      PROCESSING: 'processing',
      CLOSED: 'success',
      CANCELLED: 'default',
    };
    return colors[status] || 'default';
  };

  const columns = [
    {
      title: 'Ref No.',
      dataIndex: 'referenceNo',
      key: 'referenceNo',
      render: (text: string) => <span className="font-mono text-xs">{text}</span>,
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: string) => dayjs(text).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: 'Customer',
      key: 'customer',
      render: (_: any, record: ServiceRequest) => (
        <div>
          <div>{record.contactName}</div>
          <div className="text-xs text-gray-500">{record.contactPhone}</div>
        </div>
      ),
    },
    {
      title: 'Intent',
      key: 'intent',
      render: (_: any, record: ServiceRequest) => record.hotel?.name || record.city || '-',
    },
    {
      title: 'Admin',
      key: 'admin',
      render: (_: any, record: ServiceRequest) => record.assignedAdmin?.name || '-',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <Tag color={getStatusColor(status)}>{status}</Tag>,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: ServiceRequest) => (
        <Button 
          type="primary" 
          icon={<EyeOutlined />} 
          size="small"
          onClick={() => handleView(record)}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <HotelLayout>
      <div className="flex justify-between items-center mb-6">
        <Title level={2} className="m-0">CRM - Service Requests</Title>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-6 flex flex-wrap gap-4 items-end">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-gray-500 font-medium">Reference No.</span>
          <Input 
            placeholder="Search Ref No." 
            style={{ width: 180 }} 
            allowClear
            onChange={(e) => setFilters({ ...filters, referenceNo: e.target.value })}
          />
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xs text-gray-500 font-medium">Status</span>
          <Select 
            placeholder="All Statuses" 
            style={{ width: 140 }} 
            allowClear
            onChange={(val) => setFilters({ ...filters, status: val })}
          >
            <Option value="PENDING">Pending</Option>
            <Option value="PROCESSING">Processing</Option>
            <Option value="CLOSED">Closed</Option>
            <Option value="CANCELLED">Cancelled</Option>
          </Select>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xs text-gray-500 font-medium">Type</span>
          <Select 
            placeholder="All Types" 
            style={{ width: 160 }} 
            allowClear
            onChange={(val) => setFilters({ ...filters, type: val })}
          >
            <Option value="HOTEL_BOOKING">Hotel Booking</Option>
            <Option value="CUSTOM_ITINERARY">Custom Itinerary</Option>
          </Select>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={Array.isArray(requests) ? requests : []}
        rowKey="id"
        loading={isLoading}
        pagination={{ pageSize: 15 }}
        className="shadow-sm border border-gray-100 rounded-lg"
      />

      <ServiceRequestDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        requestId={selectedRequestId}
      />
    </HotelLayout>
  );
}
