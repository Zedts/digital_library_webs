import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  FaBars,
  FaSave,
  FaTimes,
  FaArrowLeft,
  FaImage,
  FaLink,
  FaUpload,
  FaEye
} from 'react-icons/fa';
import { useTheme } from '../../hooks/useTheme.js';
import { booksAPI } from '../../api/index.js';
import SidebarAdmin from '../../components/SidebarAdmin.jsx';
import { toast } from 'react-toastify';

const AdminEditBook = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { theme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [userData, setUserData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    publisher: '',
    publish_year: '',
    isbn: '',
    pages: '',
    category_id: '',
    stock: '',
    location: '',
    description: ''
  });
  const [coverType, setCoverType] = useState('url');
  const [coverUrl, setCoverUrl] = useState('');
  const [coverFile, setCoverFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await booksAPI.getCategories();
      if (response.success) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }, []);

  const fetchBookData = useCallback(async () => {
    try {
      setInitialLoading(true);
      const response = await booksAPI.getBookById(id);
      if (response.success) {
        const book = response.data;
        setFormData({
          title: book.title || '',
          author: book.author || '',
          publisher: book.publisher || '',
          publish_year: book.publish_year || '',
          isbn: book.isbn || '',
          pages: book.pages || '',
          category_id: book.category_id || '',
          stock: book.stock || '',
          location: book.location || '',
          description: book.description || ''
        });
        
        // Set image data if available
        if (book.image_url) {
          setCoverType('url');
          setCoverUrl(book.image_url);
          const fullImageUrl = book.image_url.startsWith('http') ? book.image_url : `http://172.22.11.208:3000${book.image_url}`; // Update with your server's IP address
          setImagePreview(fullImageUrl);
        }
      } else {
        toast.error('Book not found');
        navigate('/admin/books');
      }
    } catch (error) {
      console.error('Error fetching book data:', error);
      toast.error('Failed to load book data');
      navigate('/admin/books');
    } finally {
      setInitialLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    // Check if user is authenticated and has admin role
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (!token || !user) {
      navigate('/login');
      return;
    }

    const parsedUser = JSON.parse(user);
    if (parsedUser.role !== 'admin') {
      navigate('/login');
      return;
    }

    setUserData(parsedUser);
    fetchCategories();
    fetchBookData();
  }, [navigate, fetchCategories, fetchBookData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleCoverTypeChange = (type) => {
    setCoverType(type);
    setCoverUrl('');
    setCoverFile(null);
    setImagePreview(null);
  };

  const handleCoverUrlChange = (e) => {
    const url = e.target.value;
    setCoverUrl(url);
    if (url) {
      setImagePreview(url);
    } else {
      setImagePreview(null);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setCoverFile(null);
      setImagePreview(null);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.author.trim()) {
      newErrors.author = 'Author is required';
    }

    // Category is optional - no validation needed

    if (!formData.stock || formData.stock < 0) {
      newErrors.stock = 'Valid stock quantity is required';
    }

    if (formData.publish_year && (formData.publish_year < 1000 || formData.publish_year > new Date().getFullYear())) {
      newErrors.publish_year = 'Please enter a valid year';
    }

    if (formData.pages && formData.pages < 1) {
      newErrors.pages = 'Pages must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Create FormData for multipart/form-data submission
      const submitData = new FormData();
      
      // Add all form fields
      Object.keys(formData).forEach(key => {
        if (formData[key] !== '') {
          submitData.append(key, formData[key]);
        }
      });
      
      // Add cover type and image data
      submitData.append('cover_type', coverType);
      
      if (coverType === 'url' && coverUrl) {
        submitData.append('cover_url', coverUrl);
      } else if (coverType === 'file' && coverFile) {
        submitData.append('cover_file', coverFile);
      }

      const response = await booksAPI.updateBook(id, submitData);
      if (response.success) {
        toast.success('Book has been updated successfully!');
        // Navigate after showing notification
        setTimeout(() => navigate(`/admin/books/${id}`), 1500);
      } else {
        toast.error('Failed to update book: ' + response.message);
      }
    } catch (error) {
      toast.error('Failed to update book: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!userData || initialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className={`flex h-screen overflow-hidden ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Sidebar */}
      <SidebarAdmin
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
        userData={userData}
        activeMenu="books"
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className={`border-b px-6 py-4 ${
          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className={`lg:hidden p-2 rounded-lg transition-colors ${
                  theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
              >
                <FaBars className={`text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`} />
              </button>
              <button
                onClick={() => navigate('/admin/books')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  theme === 'dark' ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <FaArrowLeft className="text-sm" />
              </button>
              <h1 className={`text-2xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Edit Book
              </h1>
            </div>
          </div>
        </header>

        {/* Page Content - Same form as CreateBook but with update functionality */}
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className={`rounded-xl shadow-sm border p-6 ${
              theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
            }`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div className="md:col-span-2">
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-700'
                  }`}>
                    Book Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.title ? 'border-red-500' : ''
                    } ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    placeholder="Enter book title"
                  />
                  {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
                </div>

                {/* Author */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-700'
                  }`}>
                    Author *
                  </label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.author ? 'border-red-500' : ''
                    } ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    placeholder="Enter author name"
                  />
                  {errors.author && <p className="mt-1 text-sm text-red-500">{errors.author}</p>}
                </div>

                {/* Publisher */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-700'
                  }`}>
                    Publisher
                  </label>
                  <input
                    type="text"
                    name="publisher"
                    value={formData.publisher}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    placeholder="Enter publisher name"
                  />
                </div>

                {/* Publish Year */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-700'
                  }`}>
                    Publish Year
                  </label>
                  <input
                    type="number"
                    name="publish_year"
                    value={formData.publish_year}
                    onChange={handleInputChange}
                    min="1000"
                    max={new Date().getFullYear()}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.publish_year ? 'border-red-500' : ''
                    } ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    placeholder="e.g. 2023"
                  />
                  {errors.publish_year && <p className="mt-1 text-sm text-red-500">{errors.publish_year}</p>}
                </div>

                {/* ISBN */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-700'
                  }`}>
                    ISBN
                  </label>
                  <input
                    type="text"
                    name="isbn"
                    value={formData.isbn}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    placeholder="Enter ISBN number"
                  />
                </div>

                {/* Pages */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-700'
                  }`}>
                    Number of Pages
                  </label>
                  <input
                    type="number"
                    name="pages"
                    value={formData.pages}
                    onChange={handleInputChange}
                    min="1"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.pages ? 'border-red-500' : ''
                    } ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    placeholder="Enter number of pages"
                  />
                  {errors.pages && <p className="mt-1 text-sm text-red-500">{errors.pages}</p>}
                </div>

                {/* Category */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-700'
                  }`}>
                    Category
                  </label>
                  <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.category_id ? 'border-red-500' : ''
                    } ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category.category_id} value={category.category_id}>
                        {category.category_name}
                      </option>
                    ))}
                  </select>
                  {errors.category_id && <p className="mt-1 text-sm text-red-500">{errors.category_id}</p>}
                </div>

                {/* Stock */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-700'
                  }`}>
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    min="0"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.stock ? 'border-red-500' : ''
                    } ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    placeholder="Enter stock quantity"
                  />
                  {errors.stock && <p className="mt-1 text-sm text-red-500">{errors.stock}</p>}
                </div>

                {/* Location */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-700'
                  }`}>
                    Shelf Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    placeholder="e.g. A1-B2"
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-700'
                  }`}>
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    placeholder="Enter book description"
                  />
                </div>

                {/* Book Cover */}
                <div className="md:col-span-2">
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-700'
                  }`}>
                    <FaImage className="inline mr-2 text-blue-500" />
                    Book Cover
                  </label>
                  
                  {/* Cover Type Selection */}
                  <div className="flex items-center gap-4 mb-4">
                    <button
                      type="button"
                      onClick={() => handleCoverTypeChange('url')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors font-medium ${
                        coverType === 'url'
                          ? theme === 'dark'
                            ? 'bg-blue-600 border-blue-600 text-white'
                            : 'bg-blue-600 border-blue-600 text-white'
                          : theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <FaLink className="text-sm" />
                      URL
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCoverTypeChange('file')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors font-medium ${
                        coverType === 'file'
                          ? theme === 'dark'
                            ? 'bg-blue-600 border-blue-600 text-white'
                            : 'bg-blue-600 border-blue-600 text-white'
                          : theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <FaUpload className="text-sm" />
                      Upload File
                    </button>
                  </div>

                  {/* URL Input */}
                  {coverType === 'url' && (
                    <div className="mb-4">
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        <FaLink className="inline mr-1 text-blue-400" />
                        Cover URL
                      </label>
                      <input
                        type="url"
                        value={coverUrl}
                        onChange={handleCoverUrlChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          theme === 'dark' 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                        }`}
                        placeholder="https://example.com/book-cover.jpg"
                      />
                    </div>
                  )}

                  {/* File Upload */}
                  {coverType === 'file' && (
                    <div className="mb-4">
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        <FaUpload className="inline mr-1 text-blue-400" />
                        Upload Cover
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className={`block w-full text-sm ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                        } file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors`}
                      />
                    </div>
                  )}

                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="mt-4">
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        <FaEye className="inline mr-1 text-green-500" />
                        Preview
                      </label>
                      <div className="relative inline-block">
                        <img
                          src={imagePreview}
                          alt="Book cover preview"
                          className="w-32 h-48 object-cover rounded-lg border-2 border-gray-300 dark:border-gray-600 shadow-md"
                          onError={() => setImagePreview(null)}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => navigate('/admin/books')}
                  className={`px-6 py-2 border rounded-lg transition-colors ${
                    theme === 'dark'
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <FaTimes className="inline mr-2" />
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <FaSave />
                  )}
                  {loading ? 'Updating...' : 'Update Book'}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminEditBook;