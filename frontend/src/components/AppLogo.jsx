import React from 'react';

const AppLogo = ({
  size = 'medium',
  className = '',
  showText = true,
  showSubtitle = true,
  lightText = false,
  style = {},
}) => {
  // Dimensions based on size
  const iconSizes = {
    xsmall: { w: 24, h: 24, radius: '8px', iconScale: 14, titleSize: '0.95rem' },
    small: { w: 30, h: 30, radius: '10px', iconScale: 18, titleSize: '1.1rem' },
    medium: { w: 44, h: 44, radius: '14px', iconScale: 25, titleSize: '1.35rem', subtitleSize: '0.74rem' },
    large: { w: 64, h: 64, radius: '18px', iconScale: 36, titleSize: '1.65rem', subtitleSize: '0.82rem' },
    splash: { w: 88, h: 88, radius: '24px', iconScale: 50, titleSize: '2.1rem', subtitleSize: '0.88rem' },
  };

  const config = iconSizes[size] || iconSizes.medium;
  const isCompact = size === 'small' || size === 'xsmall';
  const displaySubtitle = showSubtitle && !isCompact && config.subtitleSize;
  const textColor = lightText ? '#FFFFFF' : 'var(--color-text)';

  return (
    <div
      className={`app-logo-wrap size-${size} ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: size === 'splash' ? '14px' : isCompact ? '8px' : '10px',
        userSelect: 'none',
        ...style,
      }}
    >
      {/* Brand Icon Cloche */}
      <div
        className="app-logo-icon"
        style={{
          width: `${config.w}px`,
          height: `${config.h}px`,
          borderRadius: config.radius,
          background: 'var(--color-primary)',
          color: '#FFFFFF',
          display: 'grid',
          placeItems: 'center',
          flexShrink: 0,
          boxShadow: size === 'splash' || size === 'large' ? 'var(--shadow-md)' : 'var(--shadow-sm)',
        }}
      >
        <svg
          width={config.iconScale}
          height={config.iconScale}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Modern Food Cloche with Signature Culinary Steam */}
          <path d="M3 18h18" />
          <path d="M4 18a8 8 0 0 1 16 0" />
          <path d="M12 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
          <path d="M9 13v2" />
          <path d="M12 11v4" />
          <path d="M15 13v2" />
        </svg>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="app-logo-text" style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
          <span
            className="app-logo-title"
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              fontSize: config.titleSize,
              color: textColor,
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
            }}
          >
            Foodie<span style={{ color: 'var(--color-primary)' }}>Zone</span>
          </span>
          {displaySubtitle && (
            <span
              className="app-logo-subtitle"
              style={{
                fontSize: config.subtitleSize,
                fontWeight: 600,
                color: lightText ? 'rgba(255, 255, 255, 0.75)' : 'var(--color-text-secondary)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginTop: '3px',
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
