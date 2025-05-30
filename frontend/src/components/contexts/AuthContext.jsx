import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const savedRole = localStorage.getItem('role');
    if (savedRole) {
      setRole(savedRole);
    }
    axios.get('http://127.0.0.1:8000/auth/check', {
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
      await axios.delete('http://127.0.0.1:8000/auth/logout', {
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
