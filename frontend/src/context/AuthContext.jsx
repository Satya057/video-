import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

// Mock user data for development
const MOCK_USER = {
  id: '1',
  username: 'testuser',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User'
};

const MOCK_TOKEN = 'mock-jwt-token';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const userData = JSON.parse(localStorage.getItem('user'));
      setUser(userData);
    }
    setLoading(false);
  }, []);

  const login = async () => {
    try {
      // Bypass backend authentication and use mock data
      localStorage.setItem('token', MOCK_TOKEN);
      localStorage.setItem('user', JSON.stringify(MOCK_USER));
      setUser(MOCK_USER);
      
      return { 
        success: true,
        message: 'Login successful!'
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'Invalid credentials'
      };
    }
  };

  const register = async (username, email) => {
    try {
      // Bypass backend registration and use mock data
      const mockUserData = {
        ...MOCK_USER,
        username,
        email
      };
      
      localStorage.setItem('token', MOCK_TOKEN);
      localStorage.setItem('user', JSON.stringify(mockUserData));
      setUser(mockUserData);
      
      return { 
        success: true,
        message: 'Registration successful!'
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: 'Registration failed'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout,
      isAuthenticated: !!user
    }}>
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

export default AuthContext; 