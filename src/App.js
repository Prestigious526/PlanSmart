import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import HomePage from './HomePage';
import SavingsTracker from './Dashboard/SavingsTracker';
import QuizPage from './Quiz/QuizPage';
import InvestmentCalculator from './What-if Calculator/InvestmentCalculator';
import GlossaryPage from './Learn/GlossaryPage';
import LoginPage from './Login/LoginPage';
import InvestmentComparison from './Comparison/InvestmentComparison';
import SignupPage from './Login/SignupPage';
import Dashboard from './Dashboard/Dashboard';
import StockPredictor from './Stock_Predictor/StockPredictor';
import StockDataFetcher from './Stock_Predictor/StockDataFetcher';
import AppFooter from './Header_Footer/Footer';
import AppHeader from './Header_Footer/Header';
import ForgotPassword from './Login/ForgotPassword';
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