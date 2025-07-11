import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import HomePage from './HomePage';
import SavingsTracker from './SavingsTracker';
import QuizPage from './QuizPage';
import InvestmentCalculator from './InvestmentCalculator';
import GlossaryPage from './GlossaryPage';
import LoginPage from './LoginPage';
import InvestmentComparison from './InvestmentComparison';
import SignupPage from './SignupPage';
import Dashboard from './Dashboard';
import StockPredictor from './StockPredictor';
import StockDataFetcher from './StockDataFetcher';
import AppFooter from './Footer';
import AppHeader from './Header';
import ForgotPassword from './ForgotPassword';
function App() {
  return (
    <Router>
      <div className="app">
        <div className="header">
          <AppHeader />
        </div>
        <div className="main-content">
          <Routes>
            {/* Landing Page */}
            <Route
              path="/"
              element={
                <div className="hero-section">
                  <div className="hero-content">
                    <h1>Forecast Your Financial Future <span className="highlight">With Confidence</span></h1>
                    {/*<p className="subtitle">Smart tools to help you grow your wealth and achieve your financial goals</p>*/}
                    <div className="cta-buttons">
                      <Link to="/home" className="cta-primary">Get Started</Link>
                      <Link to="/QuizPage" className="cta-secondary">Take Financial Quiz</Link>
                      
                    </div>
                  </div>
                  <div className="hero-image">
                    {/* This would be your hero image - add in CSS */}
                  </div>
                </div>
              }
            />
        
            <Route path="/home" element={<HomePage />} />
            <Route path="/SavingsTracker" element={<SavingsTracker />} />
            <Route path="/QuizPage" element={<QuizPage />} />
            <Route path="/InvestmentCalculator" element={<InvestmentCalculator />} />
            <Route path="/GlossaryPage" element={<GlossaryPage />} />
            <Route path="/LoginPage" element={<LoginPage />} />
            <Route path="/InvestmentComparison" element={<InvestmentComparison />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/dashboard" element={<Dashboard  />} />
            <Route path="/StockPredictor" element={<StockPredictor  />} />
            <Route path="/StockDataFetcher" element={<StockDataFetcher  />} /> 
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Routes>
        </div>

        <footer className="footer">
          <AppFooter></AppFooter>
        </footer>
      </div>
    </Router>
  );
}

export default App;