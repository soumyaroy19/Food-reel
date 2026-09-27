import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../styles/bottom-nav.css';
import { useAuth } from '../context/AuthContext';

const BottomNav = () => {
  const { role, setUploadError } = useAuth();
  const navigate = useNavigate();

  const handleUploadClick = (e) => {
    e.preventDefault();

    if (role === 'user') {
      // Normal user trying to upload -> Show error as requested
      setUploadError(
        'Access Denied: Only Food Partners can upload dishes to Foodie Zone. Regular foodies can explore, like, and bookmark reels. Please sign in or register with a Food Partner account to upload!'
      );
      return;
    }

    if (!role) {
      // Not logged in -> Show error with quick login
      setUploadError(
        'Partner Sign-In Required: Only registered Food Partners can upload dishes and publish reels to Foodie Zone. Please sign in with your Food Partner account.'
      );
      return;
    }

    // Role is 'food-partner' -> Allow upload
    navigate('/create-food');
  };

  return (
    <nav className="bottom-nav" role="navigation" aria-label="Bottom Navigation">
      <div className="bottom-nav__dock">
        {/* Home / Reels Tab */}
        <NavLink
          to="/"
          end
          className={({ isActive }) => `bottom-nav__item ${isActive ? 'is-active' : ''}`}
          aria-label="Foodie Reels"
        >
          {({ isActive }) => (
            <>
              <span className="bottom-nav__icon" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill={isActive ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </span>
              <span className="bottom-nav__label">Reels</span>
              {isActive && <span className="bottom-nav__active-dot" />}
            </>
          )}
        </NavLink>

        {/* Center Create Button: With Permission Check */}
        <button
          type="button"
          onClick={handleUploadClick}
          className="bottom-nav__center-btn"
          aria-label="Upload New Food Reel"
          title="Upload New Food Reel"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>

        {/* Saved Tab */}
        <NavLink
          to="/saved"
          className={({ isActive }) => `bottom-nav__item ${isActive ? 'is-active' : ''}`}
          aria-label="Saved Reels"
        >
          {({ isActive }) => (
            <>
              <span className="bottom-nav__icon" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill={isActive ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" />
                </svg>
              </span>
              <span className="bottom-nav__label">Saved</span>
              {isActive && <span className="bottom-nav__active-dot" />}
            </>
          )}
        </NavLink>
      </div>
    </nav>
  );
};

export default BottomNav;