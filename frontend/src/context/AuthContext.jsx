import React, { createContext, useContext, useState, useEffect } from 'react';
import client from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('viraliq_token');
      if (token) {
        try {
          const res = await client.get('/auth/me');
          if (res.data.success) {
            setUser(res.data.data.user);
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('viraliq_token');
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await client.post('/auth/login', { email, password });
      if (res.data.success) {
        const { token, user } = res.data.data;
        localStorage.setItem('viraliq_token', token);
        setUser(user);
        return { success: true };
      }
    } catch (error) {
      const msg = error.response?.data?.error?.message;
      return { 
        success: false, 
        message: msg || (error.message === 'Network Error' ? 'Network Error: Backend unreachable or CORS blocked' : 'Login failed')
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await client.post('/auth/register', { name, email, password });
      if (res.data.success) {
        const { token, user } = res.data.data;
        localStorage.setItem('viraliq_token', token);
        setUser(user);
        return { success: true };
      }
    } catch (error) {
      const msg = error.response?.data?.error?.message;
      return { 
        success: false, 
        message: msg || (error.message === 'Network Error' ? 'Network Error: Backend unreachable or CORS blocked' : 'Registration failed')
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('viraliq_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated: !!user }}>
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
