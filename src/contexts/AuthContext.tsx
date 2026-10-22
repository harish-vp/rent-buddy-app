import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { storageService } from '../services/storageService';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Check if user is already authenticated (stored in sessionStorage)
    const authStatus = sessionStorage.getItem('rent_budy_auth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    const success = storageService.authenticateUser(username, password);
    if (success) {
      setIsAuthenticated(true);
      sessionStorage.setItem('rent_budy_auth', 'true');
    }
    return success;
  };

  const logout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('rent_budy_auth');
  };

  const value: AuthContextType = {
    isAuthenticated,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 