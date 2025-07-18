import React, { useState } from 'react';
import { Button, Form, Input, message } from 'antd';
import { BACKEND_URL } from '../../config/config';

export const RegisterForm: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { username: string; email: string; password: string; confirmPassword: string }) => {
    if (values.password !== values.confirmPassword) {
      message.error('Passwords do not match!');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/app-user/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          username: values.username,
          email: values.email,
          password: values.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        message.success('Registration successful! Please login.');
        window.location.hash = '/login';
      } else {
        message.error(data.message || 'Registration failed');
      }
    } catch (error) {
      message.error('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
      <Form name="register" onFinish={onFinish} layout="vertical" autoComplete="off">
        <Form.Item
          label="Username"
          name="username"
          rules={[
            { required: true, message: 'Please input your username!' },
            { min: 3, message: 'Username must be at least 3 characters!' }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Please input your email!' },
            { type: 'email', message: 'Please enter a valid email!' }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            { required: true, message: 'Please input your password!' },
            { min: 6, message: 'Password must be at least 6 characters!' }
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="Confirm Password"
          name="confirmPassword"
          rules={[{ required: true, message: 'Please confirm your password!' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} className="w-full">
            Register
          </Button>
        </Form.Item>
      </Form>

      <div className="text-center mt-4">
        <span>Already have an account? </span>
        <a href="#/login" className="text-blue-500 hover:text-blue-700">
          Login here
        </a>
      </div>
    </div>
  );
};
