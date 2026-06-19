'use client';

import React, { useEffect } from 'react';
import MerchantLayout from '@/components/layout/MerchantLayout';
import { Card, Form, Input, Switch, Button, Row, Col, Typography, InputNumber } from 'antd';
import { useMerchantProfile } from '@/hooks/merchant/useMerchantProfile';
import ImageUpload from '@/components/common/ImageUpload';

const { Title } = Typography;

export default function MerchantProfilePage() {
  const { profile, isLoading, updateProfile, isUpdating } = useMerchantProfile();
  const [form] = Form.useForm();

  useEffect(() => {
    if (profile && 'status' in profile) {
      form.setFieldsValue({
        ...profile,
        isOpen: (profile as any).status === 'ACTIVE'
      });
    }
  }, [profile, form]);

  const onFinish = async (values: any) => {
    const { isOpen, ...rest } = values;
    await updateProfile({
      ...rest,
      status: isOpen ? 'ACTIVE' : 'INACTIVE'
    });
  };

  return (
    <MerchantLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <Title level={2} className="m-0!">My Profile</Title>
          <p className="text-gray-500">Manage your restaurant details and operating status</p>
        </div>
      </div>

      <Card loading={isLoading} className="max-w-4xl">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item name="name" label="Restaurant Name" rules={[{ required: true }]}>
                <Input size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="isOpen" label="Operating Status" valuePropName="checked">
                <Switch checkedChildren="OPEN" unCheckedChildren="CLOSED" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name="contactName" label="Contact Name">
                <Input size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="contactPhone" label="Contact Phone">
                <Input size="large" />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item name="addressLine" label="Address Line">
                <Input.TextArea rows={2} />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item name="city" label="City">
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="township" label="Township">
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="buildingName" label="Building Name">
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name="minimumOrderAmount" label="Minimum Order Amount ($)">
                <InputNumber min={0} step={0.01} className="w-full" size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="deliveryRadiusKm" label="Delivery Radius (Km)">
                <InputNumber min={0} step={0.1} className="w-full" size="large" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name="logoUrl" label="Logo Image">
                <ImageUpload
                  value={form.getFieldValue('logoUrl')}
                  onChange={(url) => form.setFieldsValue({ logoUrl: url })}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="coverImageUrl" label="Cover Image">
                <ImageUpload
                  value={form.getFieldValue('coverImageUrl')}
                  onChange={(url) => form.setFieldsValue({ coverImageUrl: url })}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item className="mb-0 text-right mt-4">
            <Button type="primary" htmlType="submit" size="large" loading={isUpdating}>
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </MerchantLayout>
  );
}