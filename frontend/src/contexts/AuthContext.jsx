import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

// Create Auth Context
const AuthContext = createContext();

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status on app load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      console.log('🔍 AuthContext: Checking auth status...');
      setLoading(true);
      const currentUser = await authService.getCurrentUser();
      console.log('🔍 AuthContext: checkAuthStatus - currentUser:', currentUser);
      if (currentUser) {
        setUser(currentUser);
        setIsAuthenticated(true);
        console.log('🔍 AuthContext: User authenticated');
      } else {
        setUser(null);
        setIsAuthenticated(false);
        console.log('🔍 AuthContext: User not authenticated');
      }
    } catch (error) {
      console.error('🔍 AuthContext: Auth check failed:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
      console.log('🔍 AuthContext: Loading set to false');
    }
  };

  const login = async (credentials, role) => {
    try {
      console.log('🔍 AuthContext: Starting login...');
      const result = await authService.login(credentials, role);
      console.log('🔍 AuthContext: Login result:', result);
      if (result.success) {
        // Get the updated user info after login
        console.log('🔍 AuthContext: Getting current user...');
        const currentUser = await authService.getCurrentUser();
        console.log('🔍 AuthContext: Current user data:', currentUser);
        setUser(currentUser);
        setIsAuthenticated(true);
        console.log('🔍 AuthContext: State updated - isAuthenticated: true');
        return result;
      }
      throw new Error(result.message || 'Login failed');
    } catch (error) {
      console.error('🔍 AuthContext: Login error:', error);
      throw error;
    }
  };

  const signup = async (userData, role) => {
    try {
      const result = await authService.signup(userData, role);
      if (result.success) {
        // Get the updated user info after signup
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
        setIsAuthenticated(true);
        return result;
      }
      throw new Error(result.message || 'Signup failed');
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
      // Optionally redirect to home page
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if logout API fails, clear local state
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const updateUser = (updatedUserData) => {
    setUser(prev => ({ ...prev, ...updatedUserData }));
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    signup,
    logout,
    updateUser,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
