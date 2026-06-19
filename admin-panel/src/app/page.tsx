'use client';

import AdminLayout from '@/components/AdminLayout';
import { Typography, Row, Col, Card, Statistic } from 'antd';
import { ShopOutlined, AppstoreOutlined, ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function Home() {
  return (
    <AdminLayout>
      <Title level={2} className="mb-6">Dashboard</Title>
      
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm">
            <Statistic
              title="Total Merchants"
              value={120}
              prefix={<ShopOutlined className="text-blue-500" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm">
            <Statistic
              title="Total Hotels"
              value={45}
              prefix={<AppstoreOutlined className="text-green-500" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm">
            <Statistic
              title="Active Orders"
              value={89}
              prefix={<ShoppingCartOutlined className="text-orange-500" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm">
            <Statistic
              title="New Users (Today)"
              value={32}
              prefix={<UserOutlined className="text-purple-500" />}
            />
          </Card>
        </Col>
      </Row>

      <div className="mt-8">
        <Title level={4}>Recent Activity</Title>
        <Card className="shadow-sm">
          <p className="text-gray-500">Activity chart or recent logs will be displayed here.</p>
        </Card>
      </div>
    </AdminLayout>
  );
}
