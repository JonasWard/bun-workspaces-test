import React from 'react';
import { Button, Dropdown, message } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useAuthStore } from '../../store/useAuthStore';
import { BACKEND_URL } from '../../config/config';

export const UserMenu: React.FC = () => {
  const { user, clearUser } = useAuthStore();

  const handleLogout = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/app-user/logout`, {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        clearUser();
        message.success('Logged out successfully');
        window.location.hash = '/login';
      } else {
        message.error('Logout failed');
      }
    } catch (error) {
      message.error('Network error occurred');
    }
  };

  if (!user) return null;

  const items = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: `${user.username} (${user.email})`,
      disabled: true
    },
    {
      type: 'divider' as const
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout
    }
  ];

  return (
    <Dropdown menu={{ items }} placement="bottomRight">
      <Button type="text" icon={<UserOutlined />}>
        {user.username}
      </Button>
    </Dropdown>
  );
};
