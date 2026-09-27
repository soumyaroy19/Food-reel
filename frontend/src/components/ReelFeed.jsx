import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../context/AuthContext';

const ReelFeed = ({
  items = [],
  onLike,
  onSave,
  emptyMessage = 'No food reels yet.',
  emptySubtext = 'Explore trending tastes or upload your first food bite.'
}) => {
  const { role, user, isLoggedIn, openRoleModal, logout } = useAuth();
  const videoRefs = useRef(new Map());
  const [isMuted, setIsMuted] = useState(true);
  const [doubleTapAnimation, setDoubleTapAnimation] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [likedMap, setLikedMap] = useState({});
  const [savedMap, setSavedMap] = useState({});
  const lastTapRef = useRef(0);

  // Sync incoming item states
  useEffect(() => {
    const newLiked = {};
    const newSaved = {};
    items.forEach((item) => {
      if (item.isLiked !== undefined) newLiked[item._id] = item.isLiked;
      if (item.isSaved !== undefined) newSaved[item._id] = item.isSaved;
    });
    setLikedMap((prev) => ({ ...newLiked, ...prev }));
    setSavedMap((prev) => ({ ...newSaved, ...prev }));
  }, [items]);

  // Video Intersection Observer for automatic smooth playing
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (!(video instanceof HTMLVideoElement)) return;
          if (entry.isIntersecting && entry.intersectionRatio >= 0.55) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: [0, 0.25, 0.55, 0.85, 1] }
    );

    videoRefs.current.forEach((vid) => observer.observe(vid));
    return () => observer.disconnect();
  }, [items]);

  const setVideoRef = (id) => (el) => {
    if (!el) {
      videoRefs.current.delete(id);
      return;
    }
    videoRefs.current.set(id, el);
  };

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    videoRefs.current.forEach((vid) => {
      if (vid) vid.muted = newMuted;
    });
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 2400);
  };

  const handleLike = useCallback(
    async (item) => {
      const currentlyLiked = !!likedMap[item._id];
      setLikedMap((prev) => ({ ...prev, [item._id]: !currentlyLiked }));
      if (onLike) {
        await onLike(item);
      }
    },
    [likedMap, onLike]
  );

  const handleSave = useCallback(
    async (item) => {
      const currentlySaved = !!savedMap[item._id];
      setSavedMap((prev) => ({ ...prev, [item._id]: !currentlySaved }));
      if (onSave) {
        await onSave(item);
      }
    },
    [savedMap, onSave]
  );

  const handleShare = async (item) => {
    const shareUrl = `${window.location.origin}/#reel-${item._id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.name || 'Foodie Zone Reel',
          text: item.description || 'Check out this delicious food reel on Foodie Zone!',
          url: shareUrl,
        });
        return;
      } catch {
        /* user cancelled */
      }
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      showToast('Reel link copied to clipboard!');
    } catch {
      showToast('Link ready to share!');
    }
  };

  // Double-tap on video to trigger heart pop and like
  const handleVideoClick = (e, item) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      // Double tap detected
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setDoubleTapAnimation({ id: item._id, x, y, key: now });

      if (!likedMap[item._id]) {
        handleLike(item);
      }
      setTimeout(() => {
        setDoubleTapAnimation(null);
      }, 900);
    } else {
      // Single tap: toggle play/pause
      const video = videoRefs.current.get(item._id);
      if (video) {
        if (video.paused) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      }
    }
    lastTapRef.current = now;
  };

  return (
    <div className="reels-page">
      {/* Floating Top Bar */}
      <header className="reels-top-bar">
        <Link to="/" className="reels-brand-pill" title="Foodie Zone Home">
          <span className="reels-brand-flame">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8Z" />
              <path d="m15 9-6 6" />
              <path d="M9 9h.01" />
              <path d="M15 15h.01" />
            </svg>
          </span>
          <span>Foodie Zone</span>
        </Link>

        <div className="reels-top-controls">
          {/* User Status / Role or Sign In */}
          {isLoggedIn ? (
            <div className="reels-auth-pill" title={user?.fullName || user?.name || 'Account'}>
              <span className="reels-role-badge">
                {role === 'food-partner' ? 'Kitchen' : 'Foodie'}
              </span>
              <span style={{ maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.fullName?.split(' ')[0] || user?.name?.split(' ')[0] || 'Member'}
              </span>
              <button
                type="button"
                onClick={logout}
                style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', padding: '0 2px' }}
                title="Sign Out"
                aria-label="Sign Out"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="reels-auth-pill"
              onClick={openRoleModal}
              title="Sign In or Register"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span>Sign In</span>
            </button>
          )}

          {/* Mute/Unmute audio button */}
          <button
            type="button"
            className="reels-pill-btn"
            onClick={toggleMute}
            aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="1" y1="1" x2="23" y2="23" />
                <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
                <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" fillOpacity="0.2" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              </svg>
            )}
          </button>

          {/* Theme Toggle in top bar */}
          <ThemeToggle />
        </div>
      </header>

      {/* Floating Toast notification */}
      {toastMessage && (
        <div className="reels-toast" role="status" aria-live="polite">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          {toastMessage}
        </div>
      )}

      {/* Empty State */}
      {items.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <h3>{emptyMessage}</h3>
          <p>{emptySubtext}</p>
          <Link to="/create-food" className="empty-state-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Upload a Food Reel
          </Link>
        </div>
      )}

      {/* Feed list */}
      <div className="reels-feed" role="list">
        {items.map((item) => {
          const isItemLiked = !!likedMap[item._id];
          const isItemSaved = !!savedMap[item._id];

          return (
            <section key={item._id} className="reel" role="listitem" id={`reel-${item._id}`}>
              <video
                ref={setVideoRef(item._id)}
                className="reel-video"
                src={item.video}
                muted={isMuted}
                playsInline
                loop
                preload="metadata"
                onClick={(e) => handleVideoClick(e, item)}
              />

              {/* Double-tap animated electric blue heart pop */}
              {doubleTapAnimation && doubleTapAnimation.id === item._id && (
                <div key={doubleTapAnimation.key} className="double-tap-heart">
                  <svg width="84" height="84" viewBox="0 0 24 24" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="1.5">
                    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 22l7.8-8.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
                  </svg>
                </div>
              )}

              <div className="reel-overlay">
                <div className="reel-overlay-gradient" aria-hidden="true" />

                {/* Right Rail Actions */}
                <div className="reel-actions">
                  {/* Like Button */}
                  <div className="reel-action-group">
                    <button
                      onClick={() => handleLike(item)}
                      className={`reel-action ${isItemLiked ? 'is-liked' : ''}`}
                      aria-label={isItemLiked ? 'Unlike' : 'Like'}
                      title={isItemLiked ? 'Unlike' : 'Like'}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 22l7.8-8.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
                      </svg>
                    </button>
                    <span className="reel-action__count">
                      {item.likeCount ?? item.likesCount ?? item.likes ?? 0}
                    </span>
                  </div>

                  {/* Bookmark / Save Button */}
                  <div className="reel-action-group">
                    <button
                      className={`reel-action ${isItemSaved ? 'is-saved' : ''}`}
                      onClick={() => handleSave(item)}
                      aria-label={isItemSaved ? 'Remove from Saved' : 'Save Reel'}
                      title={isItemSaved ? 'Remove from Saved' : 'Save Reel'}
                    >
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" />
                      </svg>
                    </button>
                    <span className="reel-action__count">
                      {item.savesCount ?? item.bookmarks ?? item.saves ?? 0}
                    </span>
                  </div>

                  {/* Comments Button */}
                  <div className="reel-action-group">
                    <button className="reel-action" aria-label="Comments" title="Comments">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
                      </svg>
                    </button>
                    <span className="reel-action__count">
                      {item.commentsCount ?? (Array.isArray(item.comments) ? item.comments.length : 0)}
                    </span>
                  </div>

                  {/* Share Button */}
                  <div className="reel-action-group">
                    <button
                      className="reel-action"
                      onClick={() => handleShare(item)}
                      aria-label="Share Reel"
                      title="Share Reel"
                    >
                      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="18" cy="5" r="3" />
                        <circle cx="6" cy="12" r="3" />
                        <circle cx="18" cy="19" r="3" />
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                      </svg>
                    </button>
                    <span className="reel-action__count">Share</span>
                  </div>
                </div>

                {/* Bottom Left Content */}
                <div className="reel-content">
                  {item.foodPartner && (
                    <Link
                      className="reel-store-badge"
                      to={`/food-partner/${item.foodPartner}`}
                      aria-label="Visit Kitchen"
                    >
                      <span className="reel-store-avatar">👨‍🍳</span>
                      <span className="reel-store-name">Kitchen Partner</span>
                      <span className="reel-store-cta">
                        Visit
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </span>
                    </Link>
                  )}

                  <p className="reel-description" title={item.description}>
                    {item.description || item.name || 'Mouthwatering culinary masterpiece freshly crafted.'}
                  </p>

                  <div className="reel-tags">
                    <span className="reel-tag">#FoodieZone</span>
                    <span className="reel-tag">#TrendingFood</span>
                    <span className="reel-tag">#Delicious</span>
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};

export default ReelFeed;