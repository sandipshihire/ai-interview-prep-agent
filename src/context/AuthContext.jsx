import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockCandidate } from '../data/mockData';
import { loginUser, registerUser } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('interviewai_user');
    return saved ? JSON.parse(saved) : mockCandidate; // Default to mockCandidate for smooth demo
  });
  const [token, setToken] = useState(() => localStorage.getItem('interviewai_token') || 'demo_token_active');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('interviewai_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('interviewai_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('interviewai_token', token);
    } else {
      localStorage.removeItem('interviewai_token');
    }
  }, [token]);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const res = await loginUser(credentials);
      const data = res.data || res;
      const tokenVal = data.access_token || data.token || 'demo_token_active';
      const userVal = data.user
        ? { ...data.user, name: data.user.full_name || data.user.name || 'Candidate' }
        : mockCandidate;
      setUser(userVal);
      setToken(tokenVal);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || error.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await registerUser(userData);
      const data = res.data || res;
      const tokenVal = data.access_token || data.token || 'demo_token_active';
      const userVal = data.user
        ? { ...data.user, name: data.user.full_name || data.user.name || userData.fullName }
        : { ...mockCandidate, name: userData.fullName || userData.name, email: userData.email };
      setUser(userVal);
      setToken(tokenVal);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || error.message || 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('interviewai_user');
    localStorage.removeItem('interviewai_token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        loading,
        login,
        register,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
