import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Validate form inputs
  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, you would:
      // 1. Send credentials to your authentication endpoint
      // 2. Handle the response (set tokens, user data, etc.)
      // 3. Redirect to dashboard or show error
      
      // For demo purposes, we'll just redirect
      navigate('/dashboard');
      
    } catch (error) {
      setErrors({ api: 'Invalid email or password' });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle social login
  const handleSocialLogin = (provider) => {
    // In a real app, this would initiate OAuth flow
    console.log(`Logging in with ${provider}`);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <img src="./logo.jpeg" alt="Logo" className="logo" />
          <h1>Welcome Back</h1>
          <p>Sign in to access your financial dashboard</p>
        </div>

        {errors.api && <div className="alert error">{errors.api}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={errors.email ? 'error' : ''}
              placeholder="Enter your email"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={errors.password ? 'error' : ''}
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <div className="form-options">
            <div className="remember-me">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember">Remember me</label>
            </div>
            <a href="/forgot-password" className="forgot-password">
              Forgot password?
            </a>
          </div>

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="spinner"></span> Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>

          <div className="divider">
            <span>or continue with</span>
          </div>

          <div className="social-login">
            <button
              type="button"
              className="social-button google"
              onClick={() => handleSocialLogin('Google')}
            >
              {/*<img src="/google-logo.jpeg" alt="Google" />*/}
              Google
            </button>
            <button
              type="button"
              className="social-button apple"
              onClick={() => handleSocialLogin('Apple')}
            >
              {/*<img src="/apple-icon.png" alt="Apple" />*/}
              Apple
            </button>
          </div>
        </form>

        <div className="signup-link">
          Don't have an account? <a href="/signup">Sign up</a>
        </div>
      </div>

      <div className="login-image">
        {/* This would be a financial-themed image */}
        <div className="image-overlay">
          <h2>Take Control of Your Financial Future</h2>
          <p>Access all your investment tools in one secure place</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;