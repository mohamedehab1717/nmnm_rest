import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const API_BASE = "https://nmnm-rest.onrender.com/api";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      fetchUserProfile(token);
    } else {
      localStorage.removeItem('token');
      setUser(null);
      setLoading(false);
    }
  }, [token]);

  const fetchUserProfile = async (authToken) => {
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setUser(data);
      } else {
        // Token expired or invalid
        logout();
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password, options = {}) => {
    setError('');
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          staffLogin: options.staffLogin || false,
          staffPin: options.staffPin,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setToken(data.token);
        setUser(data);
        return { success: true };
      } else {
        setError(data.message || 'Invalid email or password');
        return { success: false, message: data.message };
      }
    } catch (err) {
      setError('Connection failed. Please try again.');
      return { success: false, message: 'Server connection error' };
    }
  };

  const register = async (name, email, password) => {
    setError('');
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (data.success) {
        setToken(data.token);
        setUser(data);
        return { success: true };
      } else {
        setError(data.message || 'Registration failed');
        return { success: false, message: data.message };
      }
    } catch (err) {
      setError('Connection failed. Please try again.');
      return { success: false, message: 'Server connection error' };
    }
  };

  const logout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        login,
        register,
        logout,
        setError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
