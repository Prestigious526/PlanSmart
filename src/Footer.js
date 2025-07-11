import React from 'react';
import { Layout, Input, Space, Button } from 'antd';
import { Link } from 'react-router-dom';
import { FacebookOutlined, TwitterOutlined, InstagramOutlined } from '@ant-design/icons';
import './Footer.css';

const { Footer } = Layout;

const AppFooter = () => {
  return (
    <Footer className="footer">
      <div className="newsletter-input">
        <Input placeholder='Enter email-id'></Input>
        <Button>Submit</Button>
      </div>
      <div className='footer-links'>
        <Link to="/home">Home</Link>
        <Link to="/SavingsTracker">Tools</Link>
        <Link to="/GlossaryPage">Resources</Link>
        <Link to="/LoginPage">Account</Link>
      </div>
      <div className='social'>
        <FacebookOutlined></FacebookOutlined>
        <TwitterOutlined></TwitterOutlined>
        <InstagramOutlined></InstagramOutlined>
      </div>
    </Footer>
  );
};

export default AppFooter;
