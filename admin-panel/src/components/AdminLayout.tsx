'use client';

import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, Dropdown, Avatar, Skeleton } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ShopOutlined,
  AppstoreOutlined,
  UserOutlined,
  LogoutOutlined,
  DashboardOutlined,
  ShoppingOutlined,
  CustomerServiceOutlined,
} from '@ant-design/icons';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

const { Header, Sider, Content } = Layout;

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [adminName, setAdminName] = useState('Admin');
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
    // Check authentication
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/login');
      return;
    }

    const adminInfo = localStorage.getItem('admin_info');
    if (adminInfo) {
      try {
        const parsed = JSON.parse(adminInfo);
        setAdminName(parsed.name || 'Admin');
      } catch (e) {
        console.error(e);
      }
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_info');
    router.push('/login');
  };

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/merchants',
      icon: <ShopOutlined />,
      label: 'Merchants',
    },
    {
      key: '/hotels',
      icon: <AppstoreOutlined />,
      label: 'Hotels',
    },
    {
            key: '/orders',
            icon: <ShoppingOutlined />,
            label: <Link href="/orders">Orders</Link>,
          },
          {
            key: '/service-requests',
            icon: <CustomerServiceOutlined />,
            label: <Link href="/service-requests">Service Requests</Link>,
          },
  ];

  const userMenu = {
    items: [
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: 'Logout',
        onClick: handleLogout,
      },
    ],
  };

  if (!isMounted) {
    return (
      <Layout className="min-h-screen">
        <Sider trigger={null} collapsible collapsed={collapsed} className="bg-white shadow-md z-10" />
        <Layout>
          <Header className="bg-white px-4 shadow-sm z-0" />
          <Content className="m-6 p-6 bg-white rounded-lg shadow-sm">
            <Skeleton active />
          </Content>
        </Layout>
      </Layout>
    );
  }

  return (
    <Layout className="min-h-screen">
      <Sider trigger={null} collapsible collapsed={collapsed} className="bg-white shadow-md z-10">
        <div className="h-16 flex items-center justify-center font-bold text-xl text-blue-600 border-b border-gray-100">
          {collapsed ? 'CL' : 'Citylink'}
        </div>
        <Menu
          mode="inline"
          selectedKeys={[pathname]}
          onClick={({ key }) => router.push(key)}
          items={menuItems}
          className="border-r-0 pt-4"
        />
      </Sider>
      <Layout>
        <Header className="bg-white px-4 flex items-center justify-between shadow-sm z-0">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="text-lg w-16 h-16"
          />
          <Dropdown menu={userMenu} placement="bottomRight">
            <div className="flex items-center cursor-pointer gap-2 hover:bg-gray-50 px-3 py-1 rounded-md transition-colors">
              <Avatar icon={<UserOutlined />} className="bg-blue-500" />
              <span className="font-medium text-gray-700">{adminName}</span>
            </div>
          </Dropdown>
        </Header>
        <Content className="m-6 p-6 bg-white rounded-lg shadow-sm overflow-auto">
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
