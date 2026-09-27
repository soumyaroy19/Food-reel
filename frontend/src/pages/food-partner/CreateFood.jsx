import React, { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import '../../styles/create-food.css';
import { useNavigate, Link } from 'react-router-dom';
import ThemeToggle from '../../components/ThemeToggle';
import { useAuth } from '../../context/AuthContext';

const FLAVOR_TAGS = [
  '🌶️ Extra Spicy',
  '🧀 Cheesy Goodness',
  '🍗 Biryani & Kebab',
  '🍰 Sweet Treat',
  '🥗 Healthy & Fresh',
  '🍜 Street Food Special',
  '🥤 Refreshing Sips',
  '🌿 Pure Veg',
];

const CreateFood = () => {
  const { role } = useAuth();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [videoURL, setVideoURL] = useState('');
  const [fileError, setFileError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!videoFile) {
      setVideoURL('');
      return;
    }
    const url = URL.createObjectURL(videoFile);
    setVideoURL(url);
    return () => URL.revokeObjectURL(url);
  }, [videoFile]);

  const onFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) {
      setVideoFile(null);
      setFileError('');
      return;
    }
    if (!file.type.startsWith('video/')) {
      setFileError('Please select a valid video format (MP4, WebM, MOV).');
      return;
    }
    setFileError('');
    setVideoFile(file);
  };

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer?.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('video/')) {
      setFileError('Please drop a valid video file.');
      return;
    }
    setFileError('');
    setVideoFile(file);
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const openFileDialog = () => fileInputRef.current?.click();

  const handleTagClick = (tag) => {
    setDescription((prev) => {
      const cleanTag = tag.trim();
      if (prev.includes(cleanTag)) {
        return prev.replace(cleanTag, '').trim();
      }
      return prev ? `${prev} • ${cleanTag}` : cleanTag;
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFileError('');

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('video', videoFile);

      const response = await axios.post("https://food-reel-backend-xii0.onrender.com/api/food", formData, {
        withCredentials: true,
      });

      console.log(response.data);
      navigate("/");
    } catch (err) {
      console.error('Upload error:', err);
      if (err.response?.status === 401) {
        setFileError('Unauthorized: Only Food Partners can upload dishes. Please sign in with a Food Partner account.');
      } else {
        setFileError(err.response?.data?.message || 'Failed to upload video. Please ensure you are logged in as a Food Partner.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDisabled = useMemo(() => !name.trim() || !videoFile || isSubmitting, [name, videoFile, isSubmitting]);

  // If a normal user tries to access /create-food -> Show error as requested
  if (role === 'user') {
    return (
      <div className="create-food-page">
        <div className="create-food-card">
          <div className="create-food-top-row">
            <Link to="/" className="back-btn-pill">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Back to Reels
            </Link>
            <ThemeToggle showLabel />
          </div>

          <div className="access-denied-box">
            <div className="access-denied-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="12" cy="12" r="10" />
                <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
              </svg>
            </div>
            <h2 className="access-denied-title">Only Food Partners Can Upload Dishes</h2>
            <p className="access-denied-desc">
              You are signed in as a regular Foodie account. Foodies can browse, like, bookmark, and discover trending food reels. To upload and publish recipes or kitchen dishes, please switch to or register a Food Partner account.
            </p>
            <div className="access-denied-actions">
              <button
                type="button"
                className="btn-primary"
                onClick={() => navigate('/food-partner/login')}
              >
                Sign In as Food Partner
              </button>
              <Link to="/food-partner/register" className="auth-secondary-btn" style={{ textAlign: 'center' }}>
                Register as Food Partner Kitchen
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="create-food-page">
      <div className="create-food-card">
        {/* Navigation & Theme Switcher */}
        <div className="create-food-top-row">
          <Link to="/" className="back-btn-pill">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to Reels
          </Link>
          <ThemeToggle showLabel />
        </div>

        <header className="create-food-header">
          <h1 className="create-food-title">
            <span style={{ color: 'var(--color-primary)' }}>✨</span> Publish Food Reel
          </h1>
          <p className="create-food-subtitle">
            Upload an appetizing short video of your signature dish to tempt hungry foodies on Foodie Zone.
          </p>
        </header>

        <form className="create-food-form" onSubmit={onSubmit}>
          {/* Video Dropzone */}
          <div className="field-group">
            <label htmlFor="foodVideo">Dish Video Reel</label>
            <input
              id="foodVideo"
              ref={fileInputRef}
              className="file-input-hidden"
              type="file"
              accept="video/*"
              onChange={onFileChange}
            />

            {!videoFile ? (
              <div
                className="file-dropzone"
                role="button"
                tabIndex={0}
                onClick={openFileDialog}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openFileDialog();
                  }
                }}
                onDrop={onDrop}
                onDragOver={onDragOver}
              >
                <div className="file-dropzone-inner">
                  <div className="file-icon-box">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                  </div>
                  <div className="file-dropzone-text">
                    <strong>Click to upload</strong> or drag and drop video
                  </div>
                  <div className="file-hint">MP4, WebM, MOV • High-definition vertical video recommended</div>
                </div>
              </div>
            ) : (
              <div className="file-chip" aria-live="polite">
                <span className="file-chip-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="23 7 16 12 23 17 23 7" />
                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                  </svg>
                </span>
                <span className="file-chip-name">{videoFile.name}</span>
                <span className="file-chip-size">{(videoFile.size / 1024 / 1024).toFixed(1)} MB</span>
                <div className="file-chip-actions">
                  <button type="button" className="btn-ghost" onClick={openFileDialog}>Change</button>
                  <button type="button" className="btn-ghost danger" onClick={() => { setVideoFile(null); setFileError(''); }}>Remove</button>
                </div>
              </div>
            )}

            {fileError && <p className="error-text" role="alert">{fileError}</p>}
          </div>

          {/* Video Preview */}
          {videoURL && (
            <div className="video-preview">
              <video className="video-preview-el" src={videoURL} controls playsInline preload="metadata" />
            </div>
          )}

          {/* Dish Name */}
          <div className="field-group">
            <label htmlFor="foodName">Dish Title</label>
            <input
              id="foodName"
              type="text"
              placeholder="e.g. Crispy Butter Chicken Roll"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Flavor Tags */}
          <div className="field-group">
            <label>Quick Flavor Tags</label>
            <div className="flavor-tags-container">
              {FLAVOR_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className={`flavor-tag-btn ${description.includes(tag.trim()) ? 'is-active' : ''}`}
                  onClick={() => handleTagClick(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="field-group">
            <label htmlFor="foodDesc">Description & Secret Ingredients</label>
            <textarea
              id="foodDesc"
              rows={4}
              placeholder="Tell foodies about the ingredients, texture, sizzling aroma, and spice level..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button className="btn-primary" type="submit" disabled={isDisabled}>
              {isSubmitting ? (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="spin-icon">
                    <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                    <path d="M12 2a10 10 0 0 1 10 10" />
                  </svg>
                  Uploading Reel...
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  Publish Food Reel
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateFood;
