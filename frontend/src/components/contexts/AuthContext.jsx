import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const savedRole = localStorage.getItem('role');
    if (savedRole) {
      setRole(savedRole);
    }
    axios.get(`${API_URL}/auth/check`, {
      withCredentials: true,
    })
      .then(() => {
        setIsAuthenticated(true);
      })
      .catch(() => {
        setIsAuthenticated(false);
      });
  }, []);

  const login = (userRole) => {
    setIsAuthenticated(true);
    setRole(userRole);
    localStorage.setItem('role', userRole);
  };

  const logout = async () => {
    try {
      await axios.delete(`${API_URL}/auth/logout`, {
        withCredentials: true,
      });
    } catch (err) {
    } finally {
      setIsAuthenticated(false);
      setRole(null);
      localStorage.removeItem('role');
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
