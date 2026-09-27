import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/modals.css';

const UploadErrorModal = () => {
  const { uploadError, setUploadError } = useAuth();
  const navigate = useNavigate();

  if (!uploadError) return null;

  const handleClose = () => {
    setUploadError('');
  };

  const handlePartnerLogin = () => {
    setUploadError('');
    navigate('/food-partner/login');
  };

  const handlePartnerRegister = () => {
    setUploadError('');
    navigate('/food-partner/register');
  };

  return (
    <div className="modal-backdrop" onClick={handleClose} role="alertdialog" aria-modal="true">
      <div className="modal-card error-card" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close-btn" onClick={handleClose} aria-label="Close error">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="modal-brand-badge error-badge">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>

        <header className="modal-header">
          <h2 className="modal-title">Food Partner Access Required</h2>
          <p className="modal-subtitle">
            {uploadError || 'Only registered Food Partners can upload dishes and publish reels to Foodie Zone.'}
          </p>
        </header>

        <div className="error-modal-actions">
          <button type="button" className="modal-role-btn cyan-btn" onClick={handlePartnerLogin}>
            Sign In with Food Partner Account
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          <button type="button" className="modal-role-btn secondary-btn" onClick={handlePartnerRegister}>
            Register as Food Partner Kitchen
          </button>

          <button type="button" className="modal-skip-btn" onClick={handleClose}>
            Back to Food Reels
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadErrorModal;
