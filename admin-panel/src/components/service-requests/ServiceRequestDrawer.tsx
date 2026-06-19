import React, { useState, useEffect } from 'react';
import { Drawer, Descriptions, Tag, Button, Space, Divider, Spin, Input } from 'antd';
import { useServiceRequest, useAssignAdmin, useUpdateNotes, useCloseRequest } from '@/hooks/useServiceRequests';
import { UserOutlined, CheckCircleOutlined, SaveOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { TextArea } = Input;

interface ServiceRequestDrawerProps {
  open: boolean;
  onClose: () => void;
  requestId: string | null;
}

export default function ServiceRequestDrawer({ open, onClose, requestId }: ServiceRequestDrawerProps) {
  const { data: response, isLoading } = useServiceRequest(requestId || '');
  const assignMutation = useAssignAdmin();
  const updateNotesMutation = useUpdateNotes();
  const closeMutation = useCloseRequest();
  
  const request = response?.data;

  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (request?.adminNotes) {
      setNotes(request.adminNotes);
    } else {
      setNotes('');
    }
  }, [request]);

  const handleAssign = () => {
    if (requestId) assignMutation.mutate(requestId);
  };

  const handleSaveNotes = () => {
    if (requestId) updateNotesMutation.mutate({ id: requestId, adminNotes: notes });
  };

  const handleClose = () => {
    if (requestId) closeMutation.mutate({ id: requestId, adminNotes: notes });
  };

  return (
    <Drawer
      title={`Service Request ${request?.referenceNo ? `- ${request.referenceNo}` : ''}`}
      placement="right"
      size="large"
      onClose={onClose}
      open={open}
    >
      {isLoading ? (
        <div className="flex justify-center py-10"><Spin size="large" /></div>
      ) : request ? (
        <div className="flex flex-col gap-6">
          
          {/* Status Block */}
          <div className="bg-gray-50 p-4 rounded-lg flex justify-between items-center border border-gray-200">
            <div className="flex gap-8">
              <div>
                <div className="text-xs text-gray-500 mb-1">Status</div>
                <Tag color={request.status === 'PENDING' ? 'gold' : request.status === 'PROCESSING' ? 'processing' : request.status === 'CLOSED' ? 'success' : 'default'}>
                  {request.status}
                </Tag>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Priority</div>
                <Tag color={request.priority === 'HIGH' ? 'red' : 'blue'}>
                  {request.priority || 'NORMAL'}
                </Tag>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Assigned To</div>
                <div className="font-medium text-sm">
                  {request.assignedAdmin ? request.assignedAdmin.name : <span className="text-gray-400 italic">Unassigned</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div>
            <h3 className="text-base font-semibold mb-3">CRM Actions</h3>
            <Space wrap>
              <Button 
                type="primary"
                icon={<UserOutlined />} 
                onClick={handleAssign}
                disabled={request.status !== 'PENDING' && request.status !== 'PROCESSING'}
                loading={assignMutation.isPending}
              >
                Take Ownership (Assign to Me)
              </Button>
              <Button 
                icon={<CheckCircleOutlined />} 
                onClick={handleClose}
                disabled={request.status === 'CLOSED' || request.status === 'CANCELLED'}
                loading={closeMutation.isPending}
              >
                Mark as Closed
              </Button>
            </Space>
          </div>

          <Divider className="my-2" />

          {/* Admin Notes Section */}
          <div>
            <h3 className="text-base font-semibold mb-3">Admin Follow-up Notes</h3>
            <TextArea 
              rows={4} 
              placeholder="Record your communication with the customer here..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mb-2"
            />
            <Button 
              icon={<SaveOutlined />} 
              onClick={handleSaveNotes}
              loading={updateNotesMutation.isPending}
              disabled={notes === request.adminNotes}
            >
              Save Notes
            </Button>
          </div>

          {/* Customer & Request Info */}
          <div>
            <h3 className="text-base font-semibold mb-3">Request Details</h3>
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="Customer Name">{request.contactName}</Descriptions.Item>
              <Descriptions.Item label="Contact Phone">{request.contactPhone}</Descriptions.Item>
              <Descriptions.Item label="Registered User">{request.user?.nickname || request.user?.email || 'Guest'}</Descriptions.Item>
              <Descriptions.Item label="Request Type">{request.type}</Descriptions.Item>
              <Descriptions.Item label="City">{request.city || '-'}</Descriptions.Item>
              <Descriptions.Item label="Target Hotel">{request.hotel?.name || '-'}</Descriptions.Item>
              <Descriptions.Item label="Target Room">{request.roomType?.name || '-'}</Descriptions.Item>
              <Descriptions.Item label="Created At">
                {dayjs(request.createdAt).format('YYYY-MM-DD HH:mm:ss')}
              </Descriptions.Item>
              <Descriptions.Item label="Custom Requirements">
                <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 whitespace-pre-wrap">
                  {typeof request.requestData === 'string' 
                    ? request.requestData 
                    : JSON.stringify(request.requestData, null, 2)}
                </div>
              </Descriptions.Item>
            </Descriptions>
          </div>

        </div>
      ) : (
        <div>No request data found</div>
      )}
    </Drawer>
  );
}
