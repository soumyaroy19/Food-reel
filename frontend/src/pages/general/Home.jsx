import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../../styles/reels.css';
import ReelFeed from '../../components/ReelFeed';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../../components/ThemeToggle';
import AppLogo from '../../components/AppLogo';
import LoadingPopup from '../../components/LoadingPopup';

const Home = () => {
  const { isLoggedIn } = useAuth();
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) return;

    setIsLoading(true);
    axios.get("https://food-reel-backend-xii0.onrender.com/api/food", { withCredentials: true })
      .then(response => {
        console.log(response.data);
        if (response.data && response.data.foodItems) {
          setVideos(response.data.foodItems);
        }
      })
      .catch((err) => {
        console.log('Error fetching reels:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [isLoggedIn]);

  async function likeVideo(item) {
    try {
      const response = await axios.post(
        "https://food-reel-backend-xii0.onrender.com/api/food/like",
        { foodId: item._id },
        { withCredentials: true }
      );

      if (response.data.like) {
        setVideos((prev) =>
          prev.map((v) =>
            v._id === item._id
              ? { ...v, likeCount: (v.likeCount || 0) + 1, isLiked: true }
              : v
          )
        );
      } else {
        setVideos((prev) =>
          prev.map((v) =>
            v._id === item._id
              ? { ...v, likeCount: Math.max(0, (v.likeCount || 1) - 1), isLiked: false }
              : v
          )
        );
      }
    } catch (err) {
      console.error('Like error:', err);
    }
  }

  async function saveVideo(item) {
    try {
      const response = await axios.post(
        "https://food-reel-backend-xii0.onrender.com/api/food/save",
        { foodId: item._id },
        { withCredentials: true }
      );

      if (response.data.save) {
        setVideos((prev) =>
          prev.map((v) =>
            v._id === item._id
              ? { ...v, savesCount: (v.savesCount || 0) + 1, isSaved: true }
              : v
          )
        );
      } else {
        setVideos((prev) =>
          prev.map((v) =>
            v._id === item._id
              ? { ...v, savesCount: Math.max(0, (v.savesCount || 1) - 1), isSaved: false }
              : v
          )
        );
      }
    } catch (err) {
      console.error('Save error:', err);
    }
  }

  // If user is not logged in, prompt to log in on the first page
  if (!isLoggedIn) {
    return (
      <div className="reels-page">
        <header className="reels-top-bar" style={{ pointerEvents: 'auto' }}>
          <div className="reels-brand-pill">
            <AppLogo size="small" lightText showSubtitle={false} />
          </div>
          <ThemeToggle />
        </header>

        <div className="empty-state">
          <div style={{ marginBottom: '8px' }}>
            <AppLogo size="large" />
          </div>

          <h2>Log in to view reels</h2>
          <p>
            Welcome to Foodie Zone. Please log in to watch food reels, discover local kitchens, and explore delicious bites.
          </p>

          <div className="empty-state-actions">
            <Link to="/user/login" className="empty-state-btn">
              Log In as Foodie
            </Link>
            <Link to="/food-partner/login" className="empty-state-btn secondary">
              Log In as Food Partner
            </Link>
          </div>

          <div className="empty-state-subtext" style={{ marginTop: '14px' }}>
            Don't have an account?{' '}
            <Link to="/user/register" style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
              Sign Up as Foodie
            </Link>
            {' • '}
            <Link to="/food-partner/register" style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
              Sign Up as Partner
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <LoadingPopup
        isOpen={isLoading}
        title="Fetching Food Reels"
        message="Loading trending tastes and delicious kitchen videos from backend..."
      />
      <ReelFeed
        items={videos}
        onLike={likeVideo}
        onSave={saveVideo}
        emptyMessage="No food reels found"
        emptySubtext="Kitchens are preparing new dishes. Check back shortly!"
      />
    </>
  );
};

export default Home;
