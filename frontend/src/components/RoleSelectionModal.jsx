import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AppLogo from './AppLogo';

const RoleSelectionModal = () => {
  const { showRoleModal, closeRoleModal } = useAuth();
  const navigate = useNavigate();

  if (!showRoleModal) return null;

  const handleSelectRole = (rolePath) => {
    closeRoleModal();
    navigate(rolePath);
  };

  return (
    <div className="modal-backdrop" onClick={closeRoleModal} role="dialog" aria-modal="true">
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          type="button"
          className="modal-close-btn"
          onClick={closeRoleModal}
          aria-label="Close popup"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Brand Logo */}
        <div style={{ marginBottom: '12px' }}>
          <AppLogo size="medium" />
        </div>

        <header className="modal-header">
          <p className="modal-subtitle">
            Discover delicious food reels & explore top local kitchens. Choose your role to sign in:
          </p>
        </header>

        <div className="modal-role-options">
          {/* Option 1: Foodie (User) */}
          <div className="modal-role-card">
            <div className="modal-role-header">
              <span className="modal-role-icon user-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </span>
              <div>
                <h3 className="modal-role-name">Foodie (User)</h3>
                <span className="modal-role-badge">Explore & Eat</span>
              </div>
            </div>
            <p className="modal-role-desc">
              Watch mouthwatering video reels, like & save your favorite recipes, and discover restaurants.
            </p>
            <button
              type="button"
              className="modal-role-btn primary-btn"
              onClick={() => handleSelectRole('/user/login')}
            >
              Sign In as Foodie
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
            <div className="modal-sub-link">
              New foodie?{' '}
              <button
                type="button"
                className="modal-text-link"
                onClick={() => handleSelectRole('/user/register')}
              >
                Register here
              </button>
            </div>
          </div>

          {/* Option 2: Food Partner (Kitchen) */}
          <div className="modal-role-card">
            <div className="modal-role-header">
              <span className="modal-role-icon partner-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z" />
                  <line x1="6" y1="17" x2="18" y2="17" />
                </svg>
              </span>
              <div>
                <h3 className="modal-role-name">Food Partner</h3>
                <span className="modal-role-badge partner-badge">Kitchens & Chefs</span>
              </div>
            </div>
            <p className="modal-role-desc">
              Upload tempting dish reels, showcase signature menus, and connect directly with food lovers.
            </p>
            <button
              type="button"
              className="modal-role-btn cyan-btn"
              onClick={() => handleSelectRole('/food-partner/login')}
            >
              Sign In as Partner
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
            <div className="modal-sub-link">
              New partner?{' '}
              <button
                type="button"
                className="modal-text-link"
                onClick={() => handleSelectRole('/food-partner/register')}
              >
                Register kitchen
              </button>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="modal-skip-btn" onClick={closeRoleModal}>
            Skip & Browse Food Reels as Guest
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionModal;
