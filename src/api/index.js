import axios from 'axios';
import { hashPassword } from './hashPassword.js';

// Base API URL using server IP
const API_BASE_URL = 'http://172.22.11.208:3000/api'; // Update with your server's IP address

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

// Books API functions
export const booksAPI = {
  // Get all books with pagination and filters
  getBooks: async (page = 1, limit = 10, search = '', category = '') => {
    try {
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', limit);
      if (search) params.append('search', search);
      if (category) params.append('category', category);
      
      const response = await api.get(`/books?${params}`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Network error occurred');
    }
  },

  // Get book by ID
  getBookById: async (bookId) => {
    try {
      const response = await api.get(`/books/${bookId}`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Network error occurred');
    }
  },

  // Create new book (admin only)
  createBook: async (bookData) => {
    try {
      const response = await api.post('/books', bookData);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Network error occurred');
    }
  },

  // Update book (admin only)
  updateBook: async (bookId, bookData) => {
    try {
      const response = await api.put(`/books/${bookId}`, bookData);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Network error occurred');
    }
  },

  // Delete book (admin only)
  deleteBook: async (bookId) => {
    try {
      const response = await api.delete(`/books/${bookId}`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Network error occurred');
    }
  },

  // Get all categories
  getCategories: async () => {
    try {
      const response = await api.get('/categories');
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