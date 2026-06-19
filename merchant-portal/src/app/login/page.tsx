'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import api from '@/lib/api/axios';

const { Title } = Typography;

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      const response: any = await api.post('/auth/merchant/login', values);
      
      if (response.success && response.data?.token) {
        localStorage.setItem('merchant_token', response.data.token);
        localStorage.setItem('merchant_info', JSON.stringify(response.data.user));
        message.success('Login successful');
        router.push('/');
      }
    } catch (error: any) {
      const errorMsg = error.message || error.error?.message || 'Login failed. Please check your credentials.';
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md shadow-lg rounded-xl">
        <div className="text-center mb-8">
          <Title level={2} className="m-0">Citylink Merchant</Title>
          <p className="text-gray-500 mt-2">Sign in to manage the platform</p>
        </div>

        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input
              size="large"
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder="Merchant Email"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Password"
            />
          </Form.Item>

          <Form.Item className="mt-6 mb-0">
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loading}
              className="bg-blue-600"
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
