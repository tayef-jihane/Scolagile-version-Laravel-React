import { createContext, useContext, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('rsi_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      localStorage.removeItem('rsi_user');
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  const login = async (loginVal, pass) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { login: loginVal, pass });
      const { token, user: userData } = res.data;
      localStorage.setItem('rsi_token', token);
      localStorage.setItem('rsi_user', JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error || 'Erreur de connexion'
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (data) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/register', data);
      const { token, user: userData } = res.data;
      localStorage.setItem('rsi_token', token);
      localStorage.setItem('rsi_user', JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    } catch (err) {
      const errors = err.response?.data?.errors;
      const errorMsg = errors
        ? Object.values(errors).flat().join(', ')
        : (err.response?.data?.error || "Erreur d'inscription");
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try { await api.post('/auth/logout'); } catch (_) {}
    localStorage.removeItem('rsi_token');
    localStorage.removeItem('rsi_user');
    setUser(null);
    window.location.href = '/login';
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('rsi_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);