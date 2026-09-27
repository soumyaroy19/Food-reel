import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

axios.defaults.withCredentials = true;

const AuthContext = createContext({
  role: null,
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
      return sessionStorage.getItem('foodie_role') || null;
    } catch {
      return null;
    }
  });

  const [user, setUser] = useState(() => {
    try {
      const saved = sessionStorage.getItem('foodie_user');
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
      sessionStorage.setItem('foodie_role', 'user');
      sessionStorage.setItem('foodie_user', JSON.stringify(userData));
      localStorage.setItem('foodie_visited_before', 'true');
    } catch (error) {
      console.error(error);
    }
  };

  const loginPartner = (partnerData) => {
    setRole('food-partner');
    setUser(partnerData);

    try {
      sessionStorage.setItem('foodie_role', 'food-partner');
      sessionStorage.setItem('foodie_user', JSON.stringify(partnerData));
      localStorage.setItem('foodie_visited_before', 'true');
    } catch (error) {
      console.error(error);
    }
  };

  const logout = async () => {
    try {
      const logoutUrl =
        role === 'food-partner'
          ? 'https://food-reel-backend-xii0.onrender.com/api/auth/food-partner/logout'
          : 'https://food-reel-backend-xii0.onrender.com/api/auth/user/logout';

      await axios.post(logoutUrl, {}, { withCredentials: true });
    } catch (error) {
      console.error('Logout request failed:', error);
    }

    setRole(null);
    setUser(null);

    try {
      sessionStorage.removeItem('foodie_role');
      sessionStorage.removeItem('foodie_user');
    } catch (error) {
      console.error(error);
    }
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
