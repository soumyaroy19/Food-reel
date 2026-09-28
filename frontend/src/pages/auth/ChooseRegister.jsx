import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/auth-shared.css';
import ThemeToggle from '../../components/ThemeToggle';
import AppLogo from '../../components/AppLogo';

const ChooseRegister = () => {
  return (
    <div className="auth-page-wrapper">
      <nav className="auth-top-nav" aria-label="Theme switch">
        <ThemeToggle showLabel />
      </nav>

      <div className="auth-card" role="region" aria-labelledby="choose-register-title">
        <header className="auth-header">
          <div style={{ marginBottom: '4px' }}>
            <AppLogo size="medium" />
          </div>
          <h1 id="choose-register-title" className="auth-title">Join Foodie Zone</h1>
          <p className="auth-subtitle">Pick how you want to experience the platform.</p>
        </header>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <Link
            to="/user/register"
            className="auth-submit"
            style={{ textDecoration: 'none', textAlign: 'center', width: '100%' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            Register as Foodie (User)
          </Link>

          <Link
            to="/food-partner/register"
            className="auth-secondary-btn"
            style={{ textDecoration: 'none', textAlign: 'center', width: '100%' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
              <path d="M7 2v20" />
              <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
            </svg>
            Register as Food Partner (Kitchen)
          </Link>
        </div>

        <div className="auth-alt-action" style={{ marginTop: '8px' }}>
          Already have an account? <Link to="/user/login">Sign in here</Link>
        </div>
      </div>
    </div>
  );
};

export default ChooseRegister;