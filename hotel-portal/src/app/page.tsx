'use client';

import HotelLayout from '@/components/layout/HotelLayout';
import { Card, Statistic, Row, Col } from 'antd';
import { AppstoreOutlined, CustomerServiceOutlined } from '@ant-design/icons';

export default function Dashboard() {
  return (
    <HotelLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Hotel Dashboard</h1>
        <p className="text-gray-500">Welcome to your hotel management portal.</p>
      </div>
      
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Active Room Types"
              value={12}
              prefix={<AppstoreOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Pending Service Requests"
              value={5}
              styles={{ content: { color: '#cf1322' } }}
              prefix={<CustomerServiceOutlined />}
            />
          </Card>
        </Col>
      </Row>
    </HotelLayout>
  );
}
