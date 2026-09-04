import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

const DEMO_USERS = {
  'admin@demo.com': {
    id: 'demo-admin-id',
    name: 'Rajesham Sharma',
    email: 'admin@demo.com',
    role: 'ADMIN',
    organization: 'Department of Legal Metrology, HQ',
    state: 'Telangana',
    district: 'Hyderabad',
  },
  'lmo@demo.com': {
    id: 'demo-lmo-id',
    name: 'Inspector Suresh Rao',
    email: 'lmo@demo.com',
    role: 'LMO',
    organization: 'Legal Metrology Office, Zone 1',
    state: 'Telangana',
    district: 'Hyderabad',
  },
  'gatc@demo.com': {
    id: 'demo-gatc-id',
    name: 'National Test House - GATC',
    email: 'gatc@demo.com',
    role: 'GATC',
    organization: 'Government Approved Test Centre #402',
    state: 'Telangana',
    district: 'Hyderabad',
  },
  'business@demo.com': {
    id: 'demo-biz-id',
    name: 'Apex Retail Stores Pvt Ltd',
    email: 'business@demo.com',
    role: 'BUSINESS',
    organization: 'Apex Retail & Supermarkets',
    state: 'Telangana',
    district: 'Hyderabad',
  },
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('lm_token');
      if (token) {
        if (token.startsWith('demo-token-')) {
          const role = token.replace('demo-token-', '').toUpperCase();
          const demoUser = Object.values(DEMO_USERS).find((u) => u.role === role);
          if (demoUser) {
            setUser(demoUser);
            setLoading(false);
            return;
          }
        }
        try {
          const userData = await api.get('/auth/me');
          setUser(userData);
        } catch (err) {
          console.error('Session expired or invalid token:', err);
          localStorage.removeItem('lm_token');
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const data = await api.post('/auth/login', { email, password });
      localStorage.setItem('lm_token', data.token);
      setUser(data.user);
      return data.user;
    } catch (apiErr) {
      if (DEMO_USERS[email] && password === 'demo123') {
        const demoUser = DEMO_USERS[email];
        localStorage.setItem('lm_token', 'demo-token-' + demoUser.role.toLowerCase());
        setUser(demoUser);
        return demoUser;
      }
      throw apiErr;
    }
  };

  const register = async (formData) => {
    const data = await api.post('/auth/register', formData);
    localStorage.setItem('lm_token', data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('lm_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
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
