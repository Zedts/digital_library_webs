import axios from 'axios';
import { hashPassword } from './hashPassword.js';

// Base API URL using server IP
const API_BASE_URL = 'http://192.168.1.138:3000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth API functions
export const authAPI = {

  // Login function
  login: async (email, password) => {
    try {
      const hashedPassword = hashPassword(password);
      const response = await api.post('/auth/login', {
        email,
        password: hashedPassword
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Network error occurred');
    }
  },

  // Register function
  register: async (fullName, email, password) => {
    try {
      const hashedPassword = hashPassword(password);
      const response = await api.post('/auth/register', {
        fullName,
        email,
        password: hashedPassword
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Network error occurred');
    }
  }
};

// Dashboard API functions
export const dashboardAPI = {
  // Get admin dashboard data
  getAdminDashboard: async () => {
    try {
      const response = await api.get('/dashboard/admin');
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Network error occurred');
    }
  },

  // Get user dashboard data
  getUserDashboard: async (userId) => {
    try {
      const response = await api.get(`/dashboard/user/${userId}`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Network error occurred');
    }
  }
};

export default api;