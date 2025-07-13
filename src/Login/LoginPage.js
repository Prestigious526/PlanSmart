import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Input, Form, Typography, Divider, message } from 'antd';
import { GoogleOutlined, AppleOutlined } from '@ant-design/icons';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import './LoginPage.css';

const { Title, Text } = Typography;

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); //useNavigate: Allows redirection after successful login.
  const onFinish = async (values) => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      navigate('/dashboard');
    } catch (error) {
      let msg = 'Login failed';
      if (error.code === 'auth/user-not-found') msg = 'No user found with this email.';
      if (error.code === 'auth/wrong-password') msg = 'Incorrect password.';
      if (error.code === 'auth/too-many-requests') msg = 'Too many attempts. Try again later.';
      message.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      await signInWithPopup(auth, googleProvider);
      navigate('/dashboard');
    } catch {
      message.error('Google login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <Title level={2}>Welcome Back</Title>
        <Text type="secondary">Sign in to access your financial dashboard</Text>

        <Form
          layout="vertical"
          onFinish={onFinish}
          className="login-form"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Email is required' },
              { type: 'email', message: 'Enter a valid email' },
            ]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: 'Password is required' },
              { min: 8, message: 'Password must be at least 8 characters' },
            ]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          <div className="form-extra">
            <Button type="link"> <Link to="/forgot-password"> Forgot Password? </Link> </Button>
          </div>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={isLoading}>
              Sign In
            </Button>
          </Form.Item>
        </Form>

        <Divider>Or continue with</Divider>

        <div className="social-buttons">
          <Button icon={<GoogleOutlined />} onClick={handleGoogleLogin} block>
            Google
          </Button>
          <Button icon={<AppleOutlined />} disabled block>
            Apple (Coming Soon)
          </Button>
        </div>

        <div className="signup-prompt">
          <Text>Don't have an account? <Link to="/signup">Sign up</Link></Text>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
