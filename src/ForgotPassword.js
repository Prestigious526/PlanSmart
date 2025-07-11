import React, { useState } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from './firebase';
import './ForgotPasswordPage.css';

const { Title, Text } = Typography;

const ForgotPasswordPage = () => {
  const [loading, setLoading] = useState(false);

  const handleReset = async (values) => {
    const { email } = values;
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      message.success(`Password reset link sent to ${email}`);
      alert("Check your email for the reset link. Please check your spam folder if you don't see it in your inbox.");
    } 
    catch (error) {
      console.error(error);
      if (error.code === 'auth/user-not-found') {
        message.error('No user found with this email.');
      } 
      else {
        message.error('Failed to send reset email.');
      }
    } 
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-wrapper">
      <div className="forgot-password-card">
        <Title level={2}>Forgot Password</Title>
        <Text type="secondary">Enter your email to receive a reset link</Text>

        <Form layout="vertical" onFinish={handleReset} style={{ marginTop: 24 }}>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Email is required' },
              { type: 'email', message: 'Enter a valid email address' }
            ]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Send Reset Link
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
