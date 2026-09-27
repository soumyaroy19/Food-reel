import React, { useState, useEffect } from 'react';
import '../../styles/profile.css';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import ThemeToggle from '../../components/ThemeToggle';

const Profile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    axios.get(`https://food-reel-backend-xii0.onrender.com/api/food-partner/${id}`, { withCredentials: true })
      .then(response => {
        if (response.data && response.data.foodPartner) {
          setProfile(response.data.foodPartner);
          setVideos(response.data.foodPartner.foodItems || []);
        }
      })
      .catch((err) => {
        console.error('Error fetching partner profile:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  return (
    <main className="profile-page">
      {/* Top bar with back navigation and theme switcher */}
      <div className="profile-top-bar">
        <Link to="/" className="profile-back-link">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to Reels
        </Link>
        <ThemeToggle showLabel />
      </div>

      <section className="profile-header">
        <div className="profile-meta">
          <div className="profile-avatar-wrap">
            <img
              className="profile-avatar"
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&auto=format&fit=crop&q=80"
              alt={profile?.name || 'Kitchen Partner'}
            />
            <div className="profile-badge-verified" title="Verified Culinary Partner">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          </div>

          <div className="profile-info">
            <div className="profile-partner-title-row">
              <h1 className="profile-business-name">
                {profile?.name || 'Authentic Kitchen'}
              </h1>
              <span className="profile-pill-tag">🔥 Partner Kitchen</span>
              <span className="profile-rating-tag">★ 4.9 Rating</span>
            </div>

            <p className="profile-address-row">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2.2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>{profile?.address || 'Locally Crafted • Fresh Ingredients'}</span>
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="profile-stats" role="list" aria-label="Kitchen Statistics">
          <div className="profile-stat-card" role="listitem">
            <span className="profile-stat-value">{profile?.totalMeals || '2.4k+'}</span>
            <span className="profile-stat-label">Meals Cooked</span>
          </div>
          <div className="profile-stat-card" role="listitem">
            <span className="profile-stat-value">{profile?.customersServed || '1.8k+'}</span>
            <span className="profile-stat-label">Foodies Served</span>
          </div>
          <div className="profile-stat-card" role="listitem">
            <span className="profile-stat-value">{videos.length || '12'}</span>
            <span className="profile-stat-label">Dishes on Menu</span>
          </div>
        </div>
      </section>

      {/* Video Reel Showcase */}
      <div className="profile-section-header">
        <h2 className="profile-section-title">
          <span style={{ color: 'var(--color-primary)' }}>🎬</span> Signature Food Reels
        </h2>
        <Link to="/create-food" className="profile-pill-tag" style={{ textDecoration: 'none' }}>
          + Add New Reel
        </Link>
      </div>

      <section className="profile-grid" aria-label="Partner Videos">
        {videos.map((v, idx) => (
          <div key={v._id || v.id || idx} className="profile-grid-item">
            <video
              className="profile-grid-video"
              src={v.video}
              muted
              playsInline
              loop
              onMouseEnter={(e) => e.target.play().catch(() => {})}
              onMouseLeave={(e) => e.target.pause()}
            />
            <div className="profile-grid-overlay">
              <p className="profile-grid-desc">{v.description || v.name || 'Signature Special'}</p>
            </div>
          </div>
        ))}

        {videos.length === 0 && !isLoading && (
          <div style={{
            gridColumn: '1 / -1',
            padding: 'var(--space-8)',
            textAlign: 'center',
            background: 'var(--color-surface-alt)',
            borderRadius: 'var(--radius-lg)',
            border: '1px dashed var(--color-border)',
            color: 'var(--color-text-secondary)'
          }}>
            <p>No video reels uploaded for this partner yet.</p>
          </div>
        )}
      </section>
    </main>
  );
};

export default Profile;
