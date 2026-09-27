import React from 'react';

const AppLogo = ({ size = 'medium', className = '', showText = true }) => {
  // Dimensions based on size
  const iconSizes = {
    small: { w: 28, h: 28 },
    medium: { w: 42, h: 42 },
    large: { w: 68, h: 68 },
    splash: { w: 90, h: 90 },
  };

  const { w, h } = iconSizes[size] || iconSizes.medium;

  return (
    <div className={`app-logo-wrap size-${size} ${className}`} style={{ display: 'inline-flex', alignItems: 'center', gap: size === 'splash' ? '14px' : '10px' }}>
      <div
        className="app-logo-icon"
        style={{
          width: `${w}px`,
          height: `${h}px`,
          borderRadius: size === 'splash' ? '24px' : size === 'large' ? '18px' : '12px',
          background: 'var(--color-primary)',
          color: '#FFFFFF',
          display: 'grid',
          placeItems: 'center',
          flexShrink: 0,
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <svg
          width={Math.round(w * 0.58)}
          height={Math.round(h * 0.58)}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Modern Food Cloche with Cutlery / Waves */}
          <path d="M3 18h18" />
          <path d="M4 18a8 8 0 0 1 16 0" />
          <path d="M12 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
          <path d="M9 13v2" />
          <path d="M12 11v4" />
          <path d="M15 13v2" />
        </svg>
      </div>

      {showText && (
        <div className="app-logo-text" style={{ display: 'flex', flexDirection: 'column' }}>
          <span
            className="app-logo-title"
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              fontSize: size === 'splash' ? '2.1rem' : size === 'large' ? '1.5rem' : size === 'small' ? '1.05rem' : '1.25rem',
              color: 'var(--color-text)',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
            }}
          >
            Foodie<span style={{ color: 'var(--color-primary)' }}>Zone</span>
          </span>
          {size !== 'small' && (
            <span
              className="app-logo-subtitle"
              style={{
                fontSize: size === 'splash' ? '0.85rem' : '0.72rem',
                fontWeight: 600,
                color: 'var(--color-text-secondary)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginTop: '2px',
              }}
            >
              Taste The Trend
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default AppLogo;
