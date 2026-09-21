import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, logoutUser } from '../api/auth';
import { AUTH_EXPIRED_EVENT } from '../api/axiosClient';
import { persistAuthProfile, readAuthProfile } from '../utils/authProfile';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(readAuthProfile);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const clearSession = () => {
      try { sessionStorage.removeItem('ace_auth_token'); } catch {}
      setUser(persistAuthProfile(null));
    };
    window.addEventListener(AUTH_EXPIRED_EVENT, clearSession);

    const checkAuth = async () => {
      try {
        const freshUser = await getCurrentUser();
        if (active) setUser(persistAuthProfile(freshUser));
      } catch {
        if (active) clearSession();
      } finally {
        if (active) setLoading(false);
      }
    };

    checkAuth();
    return () => {
      active = false;
      window.removeEventListener(AUTH_EXPIRED_EVENT, clearSession);
    };
  }, []);

  const login = (userData) => {
    setUser(persistAuthProfile(userData));
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch {
      // Do not log request objects, which may include private authentication data.
    }
    setUser(persistAuthProfile(null));
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
