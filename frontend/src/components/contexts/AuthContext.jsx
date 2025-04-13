import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null = неизвестно

  // Проверка авторизации при монтировании
  useEffect(() => {
    console.log('[Auth] Проверка авторизации...');
    axios.get('http://127.0.0.1:8000/auth/check', {
      withCredentials: true,
    })
      .then(() => {
        setIsAuthenticated(true);
        console.log('[Auth] Пользователь авторизован ✅');
      })
      .catch(() => {
        setIsAuthenticated(false);
        console.log('[Auth] Пользователь не авторизован ❌');
      });
  }, []);

  const login = () => {
    setIsAuthenticated(true);
    console.log('[Auth] Вход выполнен — пользователь авторизован ✅');
  };

  const logout = async () => {
    console.log('[Auth] Выход пользователя...');
    try {
      await axios.delete('http://127.0.0.1:8000/auth/logout', {
        withCredentials: true,
      });
      console.log('[Auth] Выход успешно выполнен 📴');
    } catch (err) {
      console.error('[Auth] Ошибка при выходе ❌', err);
    } finally {
      setIsAuthenticated(false);
      console.log('[Auth] Пользователь разлогинен ❌');
    }
  };

  // Вывод состояния при каждом рендере (по желанию)
  useEffect(() => {
    console.log(`[Auth] Текущее состояние isAuthenticated:`, isAuthenticated);
  }, [isAuthenticated]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
