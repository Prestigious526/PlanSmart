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

function App() {
  return (
    <Router>
      <div className="app">
        {/* Navigation Bar */}
        <nav className="navbar">
          <div className="nav-container">
            <Link to="/" className="logo">
              <span className="logo-highlight">Plan</span>Smart
            </Link>
            <div className="nav-links">


              <Link to="/home">Home</Link>
              <Link to="/SavingsTracker">SavingsTracker</Link>
              <Link to="/InvestmentCalculator">What-If Calculator</Link>
              <Link to="/investmentcomparison">Investment Comparison</Link>
              <Link to="/QuizPage">Quiz</Link>
              <Link to="/GlossaryPage">Learn</Link>
              <Link to="/LoginPage" className="login-btn">Login</Link>
            </div>
          </div>
        </nav>

        <div className="main-content">
          <Routes>
            {/* Landing Page */}
            <Route
              path="/"
              element={
                <div className="hero-section">
                  <div className="hero-content">
                    <h1>Forecast Your Financial Future <span className="highlight">With Confidence</span></h1>
                    <p className="subtitle">Smart tools to help you grow your wealth and achieve your financial goals</p>
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
            
            {/* Other Routes */}
            <Route path="/home" element={<HomePage />} />
            <Route path="/SavingsTracker" element={<SavingsTracker />} />
            <Route path="/QuizPage" element={<QuizPage />} />
            <Route path="/InvestmentCalculator" element={<InvestmentCalculator />} />
            <Route path="/GlossaryPage" element={<GlossaryPage />} />
            <Route path="/LoginPage" element={<LoginPage />} />
            <Route path="/InvestmentComparison" element={<InvestmentComparison />} />
            <Route path="/signup" element={<SignupPage />} />
          </Routes>
        </div>

        {/* Footer */}
        <footer className="footer">
          <div className="footer-container">
            <div className="footer-logo">
              <span className="logo-highlight">Plan</span>Smart
            </div>
            <div className="footer-links">
              <Link to="/home">Home</Link>
              <Link to="/SavingsTracker">Tools</Link>
              <Link to="/GlossaryPage">Resources</Link>
              <Link to="/LoginPage">Account</Link>
              <Link to="#">Privacy Policy</Link>
              <Link to="#">Terms of Service</Link>
            </div>
            <div className="footer-social">
              {/* Social media icons would go here */}
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;