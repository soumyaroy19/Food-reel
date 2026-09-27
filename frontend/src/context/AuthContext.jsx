import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
axios.defaults.withCredentials = true;

const AuthContext = createContext({
  role: null, // 'user' | 'food-partner' | null
  user: null,
  isLoggedIn: false,
  showRoleModal: false,
  uploadError: '',
  openRoleModal: () => {},
  closeRoleModal: () => {},
  setUploadError: () => {},
  loginUser: () => {},
  loginPartner: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(() => {
    try {
      return localStorage.getItem('foodie_role') || null;
    } catch {
      return null;
    }
  });

  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('foodie_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [showRoleModal, setShowRoleModal] = useState(false);

  const [uploadError, setUploadError] = useState('');

  const openRoleModal = () => setShowRoleModal(true);
  const closeRoleModal = () => {
    try {
      localStorage.setItem('foodie_visited_before', 'true');
    } catch {}
    setShowRoleModal(false);
  };

  const loginUser = (userData) => {
    setRole('user');
    setUser(userData);
    try {
      localStorage.setItem('foodie_role', 'user');
      localStorage.setItem('foodie_user', JSON.stringify(userData));
      localStorage.setItem('foodie_visited_before', 'true');
    } catch (e) {
      console.error(e);
    }
  };

  const loginPartner = (partnerData) => {
    setRole('food-partner');
    setUser(partnerData);
    try {
      localStorage.setItem('foodie_role', 'food-partner');
      localStorage.setItem('foodie_user', JSON.stringify(partnerData));
      localStorage.setItem('foodie_visited_before', 'true');
    } catch (e) {
      console.error(e);
    }
  };

  const logout = async () => {
    try {
      if (role === 'food-partner') {
        await axios.post('https://food-reel-backend-xii0.onrender.com/api/auth/food-partner/logout', {}, { withCredentials: true }).catch(() => {});
      } else {
        await axios.post('https://food-reel-backend-xii0.onrender.com/api/auth/user/logout', {}, { withCredentials: true }).catch(() => {});
      }
    } catch (e) {
      console.error(e);
    }
    setRole(null);
    setUser(null);
    try {
      localStorage.removeItem('foodie_role');
      localStorage.removeItem('foodie_user');
    } catch (e) {}
  };

  return (
    <AuthContext.Provider
      value={{
        role,
        user,
        isLoggedIn: !!role,
        showRoleModal,
        uploadError,
        openRoleModal,
        closeRoleModal,
        setUploadError,
        loginUser,
        loginPartner,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export { AuthContext };
