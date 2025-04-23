import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user when component mounts
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setLoading(false);
        return;
      }
      
      try {
        setAuthToken(token);
        const res = await axios.get('/api/users/me');
        setUser(res.data);
        setIsAuthenticated(true);
      } catch (err) {
        console.error('Load user error:', err);
        localStorage.removeItem('token');
        setAuthToken(null);
      }
      
      setLoading(false);
    };
    
    loadUser();
  }, []);

  // Register user
  const register = async (formData) => {
    try {
      // Clear any previous errors
      setError(null);
      
      console.log('Registering user:', formData.email);
      
      // Make API request to register
      const res = await axios.post('/api/auth/register', formData);
      console.log('Register response:', res.data);
      
      // Check if user was created successfully
      if (res.data && res.data.success === false) {
        setError(res.data.msg || 'Registration failed');
        throw new Error(res.data.msg || 'Registration failed');
      }
      
      // For approval-based systems, the token might not be returned immediately
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        setAuthToken(res.data.token);
        
        // Set user data if available in response
        if (res.data.user) {
          setUser(res.data.user);
          setIsAuthenticated(true);
        }
      }
      
      // Return the response data to handle in the component
      return {
        success: true,
        msg: res.data.msg || 'Registration successful! Waiting for approval.',
        ...res.data
      };
    } catch (err) {
      console.error('Registration error:', err);
      
      // Handle error and set appropriate error message
      const errorMessage = 
        err.response?.data?.msg || 
        err.response?.data?.errors?.[0]?.msg || 
        err.message ||
        'Registration failed';
      
      setError(errorMessage);
      throw err;
    }
  };

  // Login user
  const login = async (formData) => {
    try {
      setError(null);
      console.log('Logging in user:', formData.email);
      
      const res = await axios.post('/api/auth/login', formData);
      console.log('Login response:', res.data);
      
      localStorage.setItem('token', res.data.token);
      setAuthToken(res.data.token);
      
      setUser(res.data.user);
      setIsAuthenticated(true);
      
      return res.data;
    } catch (err) {
      console.error('Login error:', err);
      
      const errorMessage = 
        err.response?.data?.msg || 
        err.response?.data?.errors?.[0]?.msg || 
        'Login failed';
      
      setError(errorMessage);
      throw err;
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    setAuthToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  // Clear errors
  const clearErrors = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        error,
        register,
        login,
        logout,
        clearErrors
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};