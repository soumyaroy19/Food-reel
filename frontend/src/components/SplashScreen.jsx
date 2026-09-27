import React, { useEffect, useState } from 'react';
import AppLogo from './AppLogo';
import '../styles/splash.css';

const SplashScreen = () => {
  const [isVisible, setIsVisible] = useState(() => {
    try {
      return !sessionStorage.getItem('foodie_splash_shown');
    } catch {
      return true;
    }
  });

  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    if (!isVisible) return;

    // Display logo for ~1.5s then fade out smoothly
    const timer = setTimeout(() => {
      setIsFading(true);
      setTimeout(() => {
        setIsVisible(false);
        try {
          sessionStorage.setItem('foodie_splash_shown', 'true');
        } catch {}
      }, 400); // match transition duration
    }, 1500);

    return () => clearTimeout(timer);
  }, [isVisible]);

  const handleSkip = () => {
    setIsFading(true);
    setTimeout(() => {
      setIsVisible(false);
      try {
        sessionStorage.setItem('foodie_splash_shown', 'true');
      } catch {}
    }, 200);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`splash-screen-container ${isFading ? 'fading-out' : ''}`}
      onClick={handleSkip}
      role="banner"
      aria-label="Foodie Zone Loading"
    >
      <div className="splash-logo-box">
        <AppLogo size="splash" />
      </div>
      <div className="splash-progress-bar" />
    </div>
  );
};

export default SplashScreen;
