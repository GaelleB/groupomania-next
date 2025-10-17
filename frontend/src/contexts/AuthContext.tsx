'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '@/lib/api';
import { User, AuthResponse } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (nom: string, prenom: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Charger les données du localStorage au démarrage
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      const data: AuthResponse = response.data;

      setToken(data.token);
      setUser(data.user || { id: data.userId, email, nom: '', prenom: '' });

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user || { id: data.userId, email }));
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      throw error;
    }
  };

  const signup = async (nom: string, prenom: string, email: string, password: string) => {
    try {
      const response = await authService.signup({ nom, prenom, email, password });
      const data: AuthResponse = response.data;

      setToken(data.token);
      setUser(data.user || { id: data.userId, nom, prenom, email });

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user || { id: data.userId, nom, prenom, email }));
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    login,
    signup,
    logout,
    isAuthenticated: !!token,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
