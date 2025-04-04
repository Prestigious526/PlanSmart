import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";

const HomePage = () => {
  const [activeTab, setActiveTab] = useState("features");

  const features = [
    {
      title: "AI-Powered Insights",
      description: "Get personalized investment recommendations powered by our advanced AI algorithms.",
      icon: "📊"
    },
    {
      title: "Portfolio Tracking",
      description: "Monitor all your investments in one place with real-time updates.",
      icon: "📈"
    },
    {
      title: "Risk Analysis",
      description: "Understand your risk tolerance and get suitable investment options.",
      icon: "🛡️"
    },
    {
      title: "Market Trends",
      description: "Stay updated with the latest market movements and trends.",
      icon: "🌐"
    }
  ];

  const testimonials = [
    {
      quote: "This tool helped me optimize my portfolio and increase returns by 23% in just 6 months!",
      author: "Sarah J., Investor"
    },
    {
      quote: "Finally, a financial tool that speaks human language instead of Wall Street jargon.",
      author: "Michael T., Small Business Owner"
    },
    {
      quote: "The AI recommendations have been spot on for my retirement planning.",
      author: "David L., Retiree"
    }
  ];

  return (
    <div className="home-container">

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Your AI-Powered Financial Assistant</h1>
          <p className="hero-subtitle">
            Make smarter investment decisions with our intelligent financial platform that combines
            cutting-edge AI with expert financial knowledge.
          </p>
          <div className="hero-cta">
            <Link to="/Investmentcomparison" className="cta-button primary">
              Get Started
            </Link>
            <Link to="/QuizPage" className="cta-button secondary">
              Take Financial Quiz
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <div className="image-placeholder">
            {/* In a real app, you would have an actual image here */}
            <span>📈 Financial Dashboard Preview</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2>Why Choose Our Platform</h2>
          <p>We combine financial expertise with artificial intelligence to give you an edge</p>
        </div>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tabs Section */}
      <section className="tabs-section">
        <div className="tabs-header">
          <button
            className={`tab-button ${activeTab === "features" ? "active" : ""}`}
            onClick={() => setActiveTab("features")}
          >
            Key Features
          </button>
          <button
            className={`tab-button ${activeTab === "testimonials" ? "active" : ""}`}
            onClick={() => setActiveTab("testimonials")}
          >
            User Testimonials
          </button>
        </div>
        <div className="tabs-content">
          {activeTab === "features" ? (
            <div className="features-list">
              <ul>
                <li>AI-driven investment recommendations</li>
                <li>Real-time portfolio tracking</li>
                <li>Customizable financial dashboards</li>
                <li>Risk assessment tools</li>
                <li>Educational resources</li>
                <li>Tax optimization strategies</li>
              </ul>
            </div>
          ) : (
            <div className="testimonials-list">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="testimonial-card">
                  <p className="quote">"{testimonial.quote}"</p>
                  <p className="author">- {testimonial.author}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <h2>Ready to Take Control of Your Financial Future?</h2>
        <div className="cta-buttons">
          <Link to="/LoginPage" className="cta-button primary">
            Sign Up Now
          </Link>
          <Link to="/GlossaryPage" className="cta-button secondary">
            Learn Financial Terms
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;