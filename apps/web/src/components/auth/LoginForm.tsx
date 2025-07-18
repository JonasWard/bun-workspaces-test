import React, { useState } from 'react';
import { Button, Form, Input, message } from 'antd';
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

      console.log('=== LOGIN RESPONSE DEBUG ===');
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      console.log('Set-Cookie header:', response.headers.get('set-cookie'));
      console.log('Document cookies after login:', document.cookie);
      console.log('=== END LOGIN DEBUG ===');

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
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      <Form name="login" onFinish={onFinish} layout="vertical" autoComplete="off">
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
          <Button type="primary" htmlType="submit" loading={loading} className="w-full">
            Login
          </Button>
        </Form.Item>
      </Form>

      <div className="text-center mt-4">
        <span>Don't have an account? </span>
        <a href="#/register" className="text-blue-500 hover:text-blue-700">
          Register here
        </a>
      </div>
    </div>
  );
};
