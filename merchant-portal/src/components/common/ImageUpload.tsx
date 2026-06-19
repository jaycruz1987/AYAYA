'use client';

import React, { useState } from 'react';
import { Upload, message } from 'antd';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import type { UploadChangeParam } from 'antd/es/upload';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import api from '@/lib/api/axios';

interface ImageUploadProps {
  value?: string;
  onChange?: (url: string) => void;
  maxSizeMB?: number;
}

export default function ImageUpload({ value, onChange, maxSizeMB = 5 }: ImageUploadProps) {
  const [loading, setLoading] = useState(false);
  const getImageUrl = (url: string | undefined) => {
    if (!url) return undefined;
    // If the URL already includes http, we need to convert it to use our proxy
    // Because the backend returns http://localhost:3001/uploads/...
    // But we want to use the frontend proxy /uploads/...
    if (url.startsWith('http://localhost:3001/')) {
      return url.replace('http://localhost:3001/', '/');
    }
    return url;
  };

  const [imageUrl, setImageUrl] = useState<string | undefined>(getImageUrl(value));

  // When value prop changes from outside (e.g. editing an existing item), update local state
  React.useEffect(() => {
    setImageUrl(getImageUrl(value));
  }, [value]);

  const beforeUpload = (file: RcFile) => {
    const isJpgOrPngOrWebp = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp' || file.type === 'image/gif';
    if (!isJpgOrPngOrWebp) {
      message.error('You can only upload JPG/PNG/WEBP/GIF file!');
    }
    const isLtSize = file.size / 1024 / 1024 < maxSizeMB;
    if (!isLtSize) {
      message.error(`Image must smaller than ${maxSizeMB}MB!`);
    }
    return isJpgOrPngOrWebp && isLtSize;
  };

  const customRequest = async (options: any) => {
    const { file, onSuccess, onError } = options;
    const formData = new FormData();
    formData.append('file', file as RcFile);

    try {
      setLoading(true);
      const res: any = await api.post('/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.success && res.data.url) {
        // Save the raw URL to the form (so it goes to DB)
        if (onChange) {
          onChange(res.data.url);
        }
        // Set the display URL to use the proxy
        setImageUrl(getImageUrl(res.data.url));
        onSuccess(res.data, file);
        message.success('Upload successfully');
      } else {
        throw new Error('Upload failed');
      }
    } catch (err: any) {
      onError(err);
      message.error(err.response?.data?.error?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      setLoading(false);
    }
    if (info.file.status === 'error') {
      setLoading(false);
    }
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <Upload
      name="file"
      listType="picture-card"
      className="avatar-uploader"
      showUploadList={false}
      customRequest={customRequest}
      beforeUpload={beforeUpload}
      onChange={handleChange}
    >
      {imageUrl ? (
        <img src={imageUrl} alt="uploaded" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
      ) : (
        uploadButton
      )}
    </Upload>
  );
}
