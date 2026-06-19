import React from 'react';
import { Drawer, Descriptions, Tag, Table, Select, Button, Space, Divider, Spin } from 'antd';
import { useMerchantOrders, useMerchantOrderDetails } from '@/hooks/merchant/useMerchantOrders';
import { CheckCircleOutlined, SyncOutlined, CarOutlined, StopOutlined, DollarCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

interface OrderDrawerProps {
  open: boolean;
  onClose: () => void;
  orderId: string | null;
}

export default function OrderDrawer({ open, onClose, orderId }: OrderDrawerProps) {
  const { data: orderResponse, isLoading } = useMerchantOrderDetails(orderId || '');
  const { performAction, isActing } = useMerchantOrders();
  
  const order: any = orderResponse;

  const handleAction = (action: string) => {
    if (!orderId) return;
    performAction({ id: orderId, action });
  };

  const itemColumns = [
    {
      title: 'Product',
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: 'Unit Price',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      render: (price: number) => `$${Number(price).toFixed(2)}`,
    },
    {
      title: 'Qty',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Total',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (price: number) => <span className="font-medium">${Number(price).toFixed(2)}</span>,
    },
  ];

  return (
    <Drawer
      title={`Order Details ${order?.orderNo ? `- ${order.orderNo}` : ''}`}
      placement="right"
      size="large"
      onClose={onClose}
      open={open}
    >
      {isLoading ? (
        <div className="flex justify-center py-10"><Spin size="large" /></div>
      ) : order ? (
        <div className="flex flex-col gap-6">
          
          {/* Current Status Block */}
          <div className="bg-gray-50 p-4 rounded-lg flex justify-between items-center border border-gray-200">
            <div className="flex gap-8">
              <div>
                <div className="text-xs text-gray-500 mb-1">Order Status</div>
                <Tag color={order.orderStatus === 'PENDING' ? 'gold' : order.orderStatus === 'ACCEPTED' ? 'blue' : order.orderStatus === 'COMPLETED' ? 'green' : 'red'}>
                  {order.orderStatus}
                </Tag>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Fulfillment Status</div>
                <Tag color={order.fulfillmentStatus === 'COMPLETED' ? 'success' : 'processing'}>
                  {order.fulfillmentStatus}
                </Tag>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Payment Status</div>
                <Tag color={order.paymentStatus === 'PAID' ? 'success' : 'error'}>
                  {order.paymentStatus}
                </Tag>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500 mb-1">Total Amount</div>
              <div className="text-xl font-bold text-blue-600">${Number(order.totalAmount).toFixed(2)}</div>
            </div>
          </div>

          {/* Available Actions Block */}
          <div>
            <h3 className="text-base font-semibold mb-3">Admin Actions</h3>
            <Space wrap>
              <Button 
                icon={<CheckCircleOutlined />} 
                onClick={() => handleAction('confirm')}
                disabled={order.orderStatus !== 'PENDING'}
                loading={isActing}
              >
                Confirm Order
              </Button>
              <Button 
                icon={<SyncOutlined />} 
                onClick={() => handleAction('start-preparing')}
                disabled={order.orderStatus !== 'ACCEPTED' || order.fulfillmentStatus !== 'PENDING'}
                loading={isActing}
              >
                Mark Preparing
              </Button>
              <Button 
                icon={<CarOutlined />} 
                onClick={() => handleAction('start-delivery')}
                disabled={order.fulfillmentStatus !== 'PROCESSING'}
                loading={isActing}
              >
                Mark Delivering
              </Button>
              <Button 
                type="primary"
                icon={<CheckCircleOutlined />} 
                onClick={() => handleAction('complete')}
                disabled={order.fulfillmentStatus !== 'DELIVERING'}
                loading={isActing}
              >
                Mark Delivered
              </Button>
              <Button 
                danger
                icon={<StopOutlined />} 
                onClick={() => handleAction('cancel')}
                disabled={order.orderStatus === 'COMPLETED' || order.orderStatus === 'CANCELLED'}
                loading={isActing}
              >
                Cancel Order
              </Button>
              <Button 
                icon={<DollarCircleOutlined />} 
                onClick={() => handleAction('mark-paid')}
                disabled={order.paymentStatus === 'PAID'}
                loading={isActing}
              >
                Mark Paid
              </Button>
            </Space>
          </div>

          <Divider className="my-2" />

          {/* Order Info */}
          <div>
            <h3 className="text-base font-semibold mb-3">Order Info</h3>
            <Descriptions bordered column={2} size="small">
              <Descriptions.Item label="Order No" span={2}><span className="font-mono">{order.orderNo}</span></Descriptions.Item>
              <Descriptions.Item label="Order Type">{order.orderType || 'DELIVERY'}</Descriptions.Item>
              <Descriptions.Item label="Order Date">
                {dayjs(order.createdAt).format('YYYY-MM-DD HH:mm:ss')}
              </Descriptions.Item>
            </Descriptions>
          </div>

          {/* Delivery Info */}
          {order.deliveryAddressSnapshot && (
            <div className="mt-6">
              <h3 className="text-base font-semibold mb-3">Delivery Information</h3>
              <Descriptions bordered column={1} size="small">
                <Descriptions.Item label="Recipient">
                  {(() => {
                    try {
                      const addr = typeof order.deliveryAddressSnapshot === 'string' 
                        ? JSON.parse(order.deliveryAddressSnapshot) 
                        : order.deliveryAddressSnapshot;
                      return (
                        <div>
                          <span className="font-semibold text-gray-900">{addr.contact_name || addr.contactName}</span>
                          <span className="ml-3 text-gray-600">{addr.contact_phone || addr.contactPhone}</span>
                        </div>
                      );
                    } catch (e) {
                      return order.user?.nickname || order.user?.name || '-';
                    }
                  })()}
                </Descriptions.Item>
                <Descriptions.Item label="Address">
                  {(() => {
                    try {
                      const addr = typeof order.deliveryAddressSnapshot === 'string' 
                        ? JSON.parse(order.deliveryAddressSnapshot) 
                        : order.deliveryAddressSnapshot;
                      
                      return (
                        <div className="flex flex-col">
                          <div>{addr.address_line || addr.addressLine}</div>
                          {(addr.building_name || addr.buildingName || addr.city) && (
                            <div className="text-gray-500 mt-1">
                              {[addr.building_name || addr.buildingName, addr.floor ? `Floor ${addr.floor}` : null, addr.room_no || addr.roomNo, addr.city]
                                .filter(Boolean)
                                .join(', ')}
                            </div>
                          )}
                        </div>
                      );
                    } catch (e) {
                      return <span>{String(order.deliveryAddressSnapshot)}</span>;
                    }
                  })()}
                </Descriptions.Item>
              </Descriptions>
            </div>
          )}

          {/* Items Snapshot */}
          <div>
            <h3 className="text-base font-semibold mb-3">Items Snapshot</h3>
            <Table 
              columns={itemColumns} 
              dataSource={order.orderItems || order.items || []} 
              rowKey="id"
              pagination={false}
              size="small"
              className="border border-gray-100"
            />
          </div>

          {/* Placeholders for future expansion */}
          <div className="grid grid-cols-2 gap-4 opacity-50">
             <div className="border border-dashed border-gray-300 p-4 rounded text-center bg-gray-50">
               <span className="text-gray-400 text-sm">Placeholder: Payment Transaction</span>
             </div>
             <div className="border border-dashed border-gray-300 p-4 rounded text-center bg-gray-50">
               <span className="text-gray-400 text-sm">Placeholder: Refund Info</span>
             </div>
             <div className="border border-dashed border-gray-300 p-4 rounded text-center bg-gray-50">
               <span className="text-gray-400 text-sm">Placeholder: Delivery Task</span>
             </div>
             <div className="border border-dashed border-gray-300 p-4 rounded text-center bg-gray-50">
               <span className="text-gray-400 text-sm">Placeholder: Audit Log</span>
             </div>
          </div>

        </div>
      ) : (
        <div>No order data found</div>
      )}
    </Drawer>
  );
}
