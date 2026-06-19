'use client';

import React, { useState } from 'react';
import MerchantLayout from '@/components/layout/MerchantLayout';
import { Table, Typography, Tag, Button, Select, Space, Input } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { useMerchantOrders } from '@/hooks/merchant/useMerchantOrders';
import { Order } from '@/types/order';
import OrderDrawer from '@/components/orders/OrderDrawer';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Option } = Select;

export default function OrdersPage() {
  const [filters, setFilters] = useState<Record<string, string>>({});
  const { orders, isLoading } = useMerchantOrders(filters);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleView = (order: Order) => {
    setSelectedOrder(order);
    setDrawerOpen(true);
  };

  const getOrderStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: 'gold',
      ACCEPTED: 'blue',
      REJECTED: 'red',
      CANCELLED: 'default',
      COMPLETED: 'green'
    };
    return colors[status] || 'default';
  };

  const getFulfillmentColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: 'default',
      PROCESSING: 'processing',
      READY_FOR_PICKUP: 'cyan',
      DELIVERING: 'purple',
      COMPLETED: 'success'
    };
    return colors[status] || 'default';
  };

  const columns = [
    {
      title: 'Order No.',
      dataIndex: 'orderNo',
      key: 'orderNo',
      render: (text: string) => <span className="font-mono">{text}</span>,
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: string) => dayjs(text).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: 'Customer',
      key: 'user',
      render: (_: any, record: Order) => record.user?.name || record.user?.email || '-',
    },
    {
      title: 'Total Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number) => <span className="font-bold">${Number(amount).toFixed(2)}</span>,
    },
    {
      title: 'Order Status',
      dataIndex: 'orderStatus',
      key: 'orderStatus',
      render: (status: string) => <Tag color={getOrderStatusColor(status)}>{status}</Tag>,
    },
    {
      title: 'Fulfillment',
      dataIndex: 'fulfillmentStatus',
      key: 'fulfillmentStatus',
      render: (status: string) => <Tag color={getFulfillmentColor(status)}>{status}</Tag>,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: Order) => (
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
    <MerchantLayout>
      <div className="flex justify-between items-center mb-6">
        <Title level={2} className="m-0">Order Management</Title>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-6 flex flex-wrap gap-4 items-end">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-gray-500 font-medium">Order No.</span>
          <Input 
            placeholder="Search by Order No." 
            style={{ width: 200 }} 
            allowClear
            onChange={(e) => setFilters({ ...filters, orderNo: e.target.value })}
          />
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xs text-gray-500 font-medium">Order Status</span>
          <Select 
            placeholder="All Statuses" 
            style={{ width: 160 }} 
            allowClear
            onChange={(val) => setFilters({ ...filters, orderStatus: val })}
          >
            <Option value="PENDING">Pending</Option>
            <Option value="ACCEPTED">Accepted</Option>
            <Option value="COMPLETED">Completed</Option>
            <Option value="CANCELLED">Cancelled</Option>
          </Select>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xs text-gray-500 font-medium">Fulfillment Status</span>
          <Select 
            placeholder="All Stages" 
            style={{ width: 160 }} 
            allowClear
            onChange={(val) => setFilters({ ...filters, fulfillmentStatus: val })}
          >
            <Option value="PENDING">Pending</Option>
            <Option value="PROCESSING">Processing</Option>
            <Option value="READY_FOR_PICKUP">Ready for Pickup</Option>
            <Option value="DELIVERING">Delivering</Option>
            <Option value="COMPLETED">Completed</Option>
          </Select>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xs text-gray-500 font-medium">Payment Status</span>
          <Select 
            placeholder="All Payments" 
            style={{ width: 140 }} 
            allowClear
            onChange={(val) => setFilters({ ...filters, paymentStatus: val })}
          >
            <Option value="UNPAID">Unpaid</Option>
            <Option value="PAID">Paid</Option>
            <Option value="REFUNDED">Refunded</Option>
          </Select>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={Array.isArray(orders) ? orders : []}
        rowKey="id"
        loading={isLoading}
        pagination={{ pageSize: 15 }}
        className="shadow-sm border border-gray-100 rounded-lg"
      />

      <OrderDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        orderId={selectedOrder?.id || null}
      />
    </MerchantLayout>
  );
}
