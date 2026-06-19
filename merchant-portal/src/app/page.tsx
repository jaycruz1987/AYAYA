'use client';

import MerchantLayout from '@/components/layout/MerchantLayout';
import { Card, Statistic, Row, Col } from 'antd';
import { ShoppingOutlined, DollarOutlined, AppstoreOutlined } from '@ant-design/icons';

export default function Dashboard() {
  return (
    <MerchantLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Merchant Dashboard</h1>
        <p className="text-gray-500">Welcome to your restaurant management portal.</p>
      </div>
      
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Today's Orders"
              value={12}
              prefix={<ShoppingOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Today's Revenue"
              value={450.00}
              precision={2}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Active Products"
              value={48}
              prefix={<AppstoreOutlined />}
            />
          </Card>
        </Col>
      </Row>
    </MerchantLayout>
  );
}
