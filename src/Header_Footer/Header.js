import React from "react";
import './Header.css'; 
import { Link } from "react-router-dom";
import { Layout, Button, Space } from "antd";
const { Header } = Layout;

const AppHeader = () => {
  return (
    <Header className="header">
      <div className="header-content">
        <div className="logo">
          <span className="logo-highlight"><Link to="/home">Plan</Link></span>Smart
        </div>
        <div className="nav-links">
          <Space size="large">
            <Link to="/InvestmentCalculator">What-If Calculator</Link>
            <Link to="/investmentcomparison">Investment Comparison</Link>
            <Link to="/QuizPage">Quiz</Link>
            <Link to="/GlossaryPage">Learn</Link>
            <Button type="primary"><Link to="/LoginPage">Login</Link></Button>
          </Space>
        </div>
      </div>
    </Header>
  );
}

export default AppHeader;