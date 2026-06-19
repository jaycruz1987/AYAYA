'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import api from '@/lib/api/axios';
import { ChevronLeft } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      const response: any = await api.post('/auth/user/login', values);
      
      if (response.success && response.data?.token) {
        localStorage.setItem('client_token', response.data.token);
        localStorage.setItem('client_info', JSON.stringify(response.data.user));
        message.success('Login successful');
        
        const redirectUrl = localStorage.getItem('redirect_after_login');
        if (redirectUrl) {
          localStorage.removeItem('redirect_after_login');
          router.push(redirectUrl);
        } else {
          router.push('/');
        }
      }
    } catch (error: any) {
      const errorMsg = error.message || error.error?.message || 'Login failed. Please check your credentials.';
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-surface flex flex-col relative">
      <div className="px-4 py-4 pt-safe-top absolute top-0 left-0 right-0 z-10">
        <button onClick={() => router.push('/')} className="p-2 -ml-2 bg-brand-gray rounded-full">
          <ChevronLeft size={24} className="text-brand-charcoal" />
        </button>
      </div>

      <div className="flex-1 flex flex-col justify-center px-6">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-brand-charcoal mb-2">Welcome Back! 👋</h1>
          <p className="text-brand-text-accent">Sign in to continue ordering and booking.</p>
        </div>

        <Form form={form} layout="vertical" onFinish={onFinish} size="large">
          <Form.Item
            name="emailOrPhone"
            rules={[
              { required: true, message: 'Please enter your email or phone' }
            ]}
          >
            <Input
              prefix={<UserOutlined className="text-brand-text-accent/70" />}
              placeholder="Email or Phone number"
              className="rounded-xl px-4 py-3"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-brand-text-accent/70" />}
              placeholder="Password"
              className="rounded-xl px-4 py-3"
            />
          </Form.Item>

          <Form.Item className="mt-8 mb-0">
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              className="bg-brand-orange hover:bg-brand-orange-dark h-14 rounded-full font-bold text-lg shadow-md"
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>
        
        <div className="mt-8 text-center text-sm text-brand-text-accent">
          Don't have an account? <span className="text-brand-orange font-bold">Register</span>
        </div>
      </div>
    </div>
  );
}