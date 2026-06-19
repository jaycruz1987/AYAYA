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

interface MerchantLayoutProps {
  children: React.ReactNode;
}

export default function MerchantLayout({ children }: MerchantLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [merchantName, setMerchantName] = useState('Merchant');
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
    // Check authentication
    const token = localStorage.getItem('merchant_token');
    if (!token) {
      router.push('/login');
      return;
    }

    const merchantInfo = localStorage.getItem('merchant_info');
    if (merchantInfo) {
      try {
        const parsed = JSON.parse(merchantInfo);
        setMerchantName(parsed.name || 'Merchant');
      } catch (e) {
        console.error(e);
      }
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('merchant_token');
    localStorage.removeItem('merchant_info');
    router.push('/login');
  };

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/profile',
      icon: <UserOutlined />,
      label: 'My Profile',
    },
    {
      key: '/categories',
      icon: <AppstoreOutlined />,
      label: 'Categories',
    },
    {
      key: '/products',
      icon: <ShopOutlined />,
      label: 'Products',
    },
    {
      key: '/orders',
      icon: <ShoppingOutlined />,
      label: 'Orders',
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
          {collapsed ? 'MP' : 'Merchant Portal'}
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
              <span className="font-medium text-gray-700">{merchantName}</span>
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
