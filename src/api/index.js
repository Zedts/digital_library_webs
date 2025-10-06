import axios from 'axios';
import { hashPassword } from './hashPassword.js';

// Base API URL using server IP
const API_BASE_URL = 'http://172.22.14.221:3000/api'; // Update with your server's IP address

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
  getBooks: async (page = 1, limit = 10, search = '', category = '', stock = '') => {
    try {
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', limit);
      if (search) params.append('search', search);
      if (category) params.append('category', category);
      if (stock) params.append('stock', stock);
      
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
      // Check if it's FormData (for file uploads)
      const isFormData = bookData instanceof FormData;
      
      const config = {};
      if (isFormData) {
        // For FormData
        config.headers = {
          'Content-Type': 'multipart/form-data'
        };
      }
      
      const response = await api.post('/books', bookData, config);
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
      // Check if it's FormData (for file uploads)
      const isFormData = bookData instanceof FormData;
      
      const config = {};
      if (isFormData) {
        // For FormData
        config.headers = {
          'Content-Type': 'multipart/form-data'
        };
      }
      
      const response = await api.put(`/books/${bookId}`, bookData, config);
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

// Categories API functions
export const categoriesAPI = {
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
  },

  // Create new category (admin only)
  createCategory: async (categoryData) => {
    try {
      const response = await api.post('/categories', categoryData);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Network error occurred');
    }
  },

  // Update category (admin only)
  updateCategory: async (categoryId, categoryData) => {
    try {
      const response = await api.put(`/categories/${categoryId}`, categoryData);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Network error occurred');
    }
  },

  // Delete category (admin only)
  deleteCategory: async (categoryId) => {
    try {
      const response = await api.delete(`/categories/${categoryId}`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Network error occurred');
    }
  }
};

// Borrowings API functions
export const borrowingsAPI = {
  // Get all borrowings with pagination and filters
  getBorrowings: async (page = 1, limit = 10, status = '', search = '') => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });
      
      if (status) params.append('status', status);
      if (search) params.append('search', search);
      
      const response = await api.get(`/borrowings?${params}`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Network error occurred');
    }
  },

  // Get borrowing by ID
  getBorrowingById: async (borrowingId) => {
    try {
      const response = await api.get(`/borrowings/${borrowingId}`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Network error occurred');
    }
  },

  // Create new borrowing request
  createBorrowing: async (borrowingData) => {
    try {
      const response = await api.post('/borrowings', borrowingData);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Network error occurred');
    }
  },

  // Update borrowing status (approve/reject)
  updateBorrowingStatus: async (borrowingId, statusData) => {
    try {
      const response = await api.put(`/borrowings/${borrowingId}/status`, statusData);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Network error occurred');
    }
  },

  // Return book
  returnBook: async (borrowingId, returnData) => {
    try {
      const response = await api.put(`/borrowings/${borrowingId}/return`, returnData);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Network error occurred');
    }
  },

  // Extend borrowing period
  extendBorrowing: async (borrowingId, extensionData) => {
    try {
      const response = await api.put(`/borrowings/${borrowingId}/extend`, extensionData);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Network error occurred');
    }
  },

  // Delete borrowing
  deleteBorrowing: async (borrowingId) => {
    try {
      const response = await api.delete(`/borrowings/${borrowingId}`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Network error occurred');
    }
  },

  // Get borrowing statistics
  getBorrowingStats: async () => {
    try {
      const response = await api.get('/borrowings/stats');
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Network error occurred');
    }
  }
};

// Registration API functions
export const registrationAPI = {
  // Get all registration requests with pagination and filters
  getRegistrations: async (page = 1, limit = 10, status = '', search = '') => {
    try {
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', limit);
      if (status) params.append('status', status);
      if (search) params.append('search', search);

      const response = await api.get(`/registrations?${params.toString()}`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Network error occurred');
    }
  },

  // Get registration by ID
  getRegistrationById: async (registrationId) => {
    try {
      const response = await api.get(`/registrations/${registrationId}`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Network error occurred');
    }
  },

  // Approve registration request (admin only)
  approveRegistration: async (registrationId) => {
    try {
      const response = await api.put(`/registrations/${registrationId}/approve`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Network error occurred');
    }
  },

  // Reject registration request (admin only)
  rejectRegistration: async (registrationId) => {
    try {
      const response = await api.put(`/registrations/${registrationId}/reject`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Network error occurred');
    }
  },

  // Delete registration request (admin only)
  deleteRegistration: async (registrationId) => {
    try {
      const response = await api.delete(`/registrations/${registrationId}`);
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