import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [farmerProfile, setFarmerProfile] = useState(null);
  const [workProfile, setWorkProfile] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('agromed_token') || null);
  const [loading, setLoading] = useState(true);

  // Initialize session on page load
  useEffect(() => {
    async function loadUser() {
      const storedToken = localStorage.getItem('agromed_token');
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get('/auth/profile');
        if (res.data.success) {
          setUser(res.data.user);
          setFarmerProfile(res.data.farmerProfile);
          setWorkProfile(res.data.workProfile);
        }
      } catch (err) {
        console.error('Failed to load user session:', err);
        localStorage.removeItem('agromed_token');
        localStorage.removeItem('agromed_user');
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  // Login handler
  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        const { token: newToken, user: newUser, farmerProfile: newFarmerProfile, workProfile: newWorkProfile } = res.data;
        localStorage.setItem('agromed_token', newToken);
        localStorage.setItem('agromed_user', JSON.stringify(newUser));
        setToken(newToken);
        setUser(newUser);
        setFarmerProfile(newFarmerProfile);
        setWorkProfile(newWorkProfile);
        return { success: true, user: newUser };
      }
      return { success: false, message: res.data.message || 'Login failed' };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Login failed. Please check your credentials.'
      };
    }
  };

  // Request OTP handler (Step 1)
  const requestOtp = async (formData) => {
    try {
      const res = await api.post('/auth/register/request-otp', formData);
      return { success: true, data: res.data };
    } catch (err) {
      return {
        success: false,
        code: err.response?.data?.code,
        retryAfterSeconds: err.response?.data?.retryAfterSeconds,
        message: err.response?.data?.message || 'Failed to send verification code. Please check your details.'
      };
    }
  };

  // Verify OTP handler (Step 2)
  const verifyOtp = async (email, otp) => {
    try {
      const res = await api.post('/auth/register/verify-otp', { email, otp });
      if (res.data.success) {
        const { token: newToken, user: newUser, farmerProfile: newFarmerProfile } = res.data;
        localStorage.setItem('agromed_token', newToken);
        localStorage.setItem('agromed_user', JSON.stringify(newUser));
        setToken(newToken);
        setUser(newUser);
        setFarmerProfile(newFarmerProfile);
        return { success: true, user: newUser, data: res.data };
      }
      return { success: false, message: res.data.message || 'OTP verification failed' };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'OTP verification failed. Please check the code.'
      };
    }
  };

  // Resend OTP handler
  const resendOtp = async (email) => {
    try {
      const res = await api.post('/auth/register/resend-otp', { email });
      return { success: true, data: res.data };
    } catch (err) {
      return {
        success: false,
        retryAfterSeconds: err.response?.data?.retryAfterSeconds,
        message: err.response?.data?.message || 'Failed to resend code. Please try again later.'
      };
    }
  };

  // Direct register handler
  const register = async (formData) => {
    try {
      const res = await api.post('/auth/register', formData);
      if (res.data.success) {
        const { token: newToken, user: newUser, farmerProfile: newFarmerProfile } = res.data;
        localStorage.setItem('agromed_token', newToken);
        localStorage.setItem('agromed_user', JSON.stringify(newUser));
        setToken(newToken);
        setUser(newUser);
        setFarmerProfile(newFarmerProfile);
        return { success: true, user: newUser };
      }
      return { success: false, message: res.data.message || 'Registration failed' };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Registration failed. Please check your details.'
      };
    }
  };

  // Refresh profile data
  const refreshProfile = async () => {
    try {
      if (user?.role === 'FARMER') {
        const res = await api.get('/farmer/profile');
        if (res.data.success) {
          setFarmerProfile(res.data.profile);
        }
        const workRes = await api.get('/work-profile');
        if (workRes.data.success) {
          setWorkProfile(workRes.data.workProfile);
        }
      }
    } catch (err) {
      console.error('Failed to refresh profile:', err);
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('agromed_token');
    localStorage.removeItem('agromed_user');
    setToken(null);
    setUser(null);
    setFarmerProfile(null);
    setWorkProfile(null);
  };

  const value = {
    user,
    farmerProfile,
    workProfile,
    token,
    loading,
    isAuthenticated: Boolean(token && user),
    isAdmin: user?.role === 'ADMIN',
    isFarmer: user?.role === 'FARMER',
    login,
    register,
    requestOtp,
    verifyOtp,
    resendOtp,
    logout,
    refreshProfile,
    setUser,
    setFarmerProfile,
    setWorkProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
