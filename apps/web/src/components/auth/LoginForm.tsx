import React, { useState } from 'react';
import { Button, Form, Input, message, Modal } from 'antd';
import { useAuthStore } from '../../store/useAuthStore';
import { BACKEND_URL } from '../../config/config';

export const LoginForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const setUser = useAuthStore((state) => state.setUser);

  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/app-user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(values)
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data);
        message.success('Login successful!');
        window.location.hash = '/';
      } else {
        message.error(data.message || 'Login failed');
      }
    } catch (error) {
      message.error('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open closeIcon={null} footer={null}>
      <div className="flex flex-col gap-6">
        <span className="font-bold text-[2rem] m-auto">💫 Welcome to Slab 2 Reuse 💫</span>
        <Form name="login" layout="vertical" onFinish={onFinish} autoComplete="off">
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <div className="flex flex-row gap-4 items-center justify-between w-full">
              <div className="items-center flex flex-row gap-3">
                <span>Don't have an account? </span>
                <Button variant="text" href="#/register" className="text-blue-500 hover:text-blue-700">
                  Register here
                </Button>
              </div>
              <Button type="primary" htmlType="submit" loading={loading} className="w-full">
                Login
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};
