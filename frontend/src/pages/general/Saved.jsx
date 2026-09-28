import React, { useEffect, useState } from 'react';
import '../../styles/reels.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ReelFeed from '../../components/ReelFeed';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../../components/ThemeToggle';
import AppLogo from '../../components/AppLogo';
import LoadingPopup from '../../components/LoadingPopup';

const Saved = () => {
  const { isLoggedIn } = useAuth();
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) return;

    setIsLoading(true);
    axios.get("https://food-reel-backend-xii0.onrender.com/api/food/save", { withCredentials: true })
      .then(response => {
        if (response.data && response.data.savedFoods) {
          const savedFoods = response.data.savedFoods
            .filter((item) => item && item.food)
            .map((item) => ({
              _id: item.food._id,
              video: item.food.video,
              description: item.food.description,
              likeCount: item.food.likeCount,
              savesCount: item.food.savesCount,
              commentsCount: item.food.commentsCount,
              foodPartner: item.food.foodPartner,
              isSaved: true,
            }));
          setVideos(savedFoods);
        }
      })
      .catch((err) => {
        console.log('Error fetching saved reels:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [isLoggedIn]);

  const removeSaved = async (item) => {
    try {
      await axios.post(
        "https://food-reel-backend-xii0.onrender.com/api/food/save",
        { foodId: item._id },
        { withCredentials: true }
      );
      setVideos((prev) => prev.filter((v) => v._id !== item._id));
    } catch (err) {
      console.error('Error removing saved reel:', err);
    }
  };

  const handleLike = async (item) => {
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
      console.error('Error liking in saved:', err);
    }
  };

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

          <h2>Log in to view saved reels</h2>
          <p>Sign in to your account to view your bookmarked culinary reels and favorite recipes.</p>

          <div className="empty-state-actions">
            <Link to="/user/login" className="empty-state-btn">
              Log In as Foodie
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
        title="Fetching Saved Reels"
        message="Retrieving your bookmarked food reels from backend..."
      />
      <ReelFeed
        items={videos}
        onLike={handleLike}
        onSave={removeSaved}
        emptyMessage="No saved food reels yet"
        emptySubtext="Tap the bookmark icon on any delicious reel to save your favorite dishes here!"
      />
    </>
  );
};

export default Saved;
