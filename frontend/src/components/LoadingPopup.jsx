import React, { useState, useEffect } from 'react';
import AppLogo from './AppLogo';
import '../styles/loading-popup.css';

const LoadingPopup = ({
  isOpen = false,
  title = 'Connecting to Backend',
  message = 'Please wait while we communicate with the server...',
}) => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setElapsed(0);
      return;
    }

    const timer = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const isServerWakingUp = elapsed >= 3;

  return (
    <div
      className="loading-popup-backdrop"
      role="status"
      aria-live="polite"
      aria-label={`${title}: ${message}`}
    >
      <div className="loading-popup-card">
        {/* Animated Cloche Logo with Outer Spin Orbit */}
        <div className="loading-spinner-wrapper">
          <div className="loading-spinner-orbit" />
          <AppLogo size="small" showText={false} />
        </div>

        <div className="loading-popup-content">
          <h3 className="loading-popup-title">
            {title}
            <span className="loading-dots">
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </span>
          </h3>
          <p className="loading-popup-message">{message}</p>

          {isServerWakingUp && (
            <div className="loading-popup-wake-hint">
              <span className="wake-hint-icon">⚡</span>
              <span>
                Backend server is waking up from idle state ({elapsed}s). Cloud free-tier services usually take 15–25 seconds on first request.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoadingPopup;
