import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaBars,
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaEye,
  FaFilter,
  FaTimes,
  FaStar
} from 'react-icons/fa';
import { useTheme } from '../../hooks/useTheme.js';
import { booksAPI, categoriesAPI } from '../../api/index.js';
import SidebarAdmin from '../../components/SidebarAdmin.jsx';
import ConfirmationModal from '../../components/ConfirmationModal.jsx';
import useConfirmation from '../../hooks/useConfirmation.js';
import { toast } from 'react-toastify';

const AdminBooks = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [userData, setUserData] = useState(null);
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStock, setSelectedStock] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryForm, setCategoryForm] = useState({
    category_name: '',
    color: '#3B82F6'
  });
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [showManageCategoriesModal, setShowManageCategoriesModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const { confirmationState, showConfirmation, hideConfirmation, handleConfirm } = useConfirmation();

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

  const fetchBooks = useCallback(async (search = '', category = '', stock = '', page = currentPage) => {
    try {
      setLoading(true);
      const response = await booksAPI.getBooks(page, 10, search, category, stock);
      if (response.success) {
        setBooks(response.data);
        setPagination(response.pagination);
      }
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  const applyFilters = useCallback(() => {
    setCurrentPage(1); 
    fetchBooks(searchTerm, selectedCategory, selectedStock, 1);
  }, [searchTerm, selectedCategory, selectedStock, fetchBooks]);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await categoriesAPI.getCategories();
      if (response.success) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }, []);

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
    fetchBooks('', '', '', 1);
    fetchCategories();
  }, [navigate, fetchCategories, fetchBooks]);

  // Effect for pagination changes only
  useEffect(() => {
    if (userData && currentPage > 1) {
      fetchBooks(searchTerm, selectedCategory, selectedStock, currentPage);
    }
  }, [currentPage, userData, fetchBooks, searchTerm, selectedCategory, selectedStock]);

  const handleDelete = async (bookId) => {
    showConfirmation({
      title: "Delete Book",
      message: "Are you sure you want to delete this book? This action cannot be undone.",
      confirmText: "Delete",
      cancelText: "Cancel",
      confirmButtonColor: "red",
      onConfirm: async () => {
        try {
          const response = await booksAPI.deleteBook(bookId);
          if (response.success) {
            fetchBooks();
            toast.success('Book has been deleted successfully!');
          }
        } catch (error) {
          toast.error('Failed to delete book: ' + error.message);
        }
      }
    });
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    setCategoryLoading(true);
    try {
      let response;
      if (editingCategory) {
        response = await categoriesAPI.updateCategory(editingCategory.category_id, categoryForm);
      } else {
        response = await categoriesAPI.createCategory(categoryForm);
      }
      
      if (response.success) {
        toast.success(editingCategory ? 'Category has been updated successfully!' : 'Category has been created successfully!');
        setShowCategoryModal(false);
        setShowManageCategoriesModal(false);
        setCategoryForm({ category_name: '', color: '#3B82F6' });
        setEditingCategory(null);
        fetchCategories();
      }
    } catch (error) {
      toast.error('Failed to save category: ' + error.message);
    } finally {
      setCategoryLoading(false);
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setCategoryForm({
      category_name: category.category_name,
      color: category.color || '#3B82F6'
    });
    setShowManageCategoriesModal(false);
    setShowCategoryModal(true);
  };

  const handleDeleteCategory = async (categoryId) => {
    showConfirmation({
      title: "Delete Category",
      message: "Are you sure you want to delete this category? This action cannot be undone and will affect all books in this category.",
      confirmText: "Delete",
      cancelText: "Cancel",
      confirmButtonColor: "red",
      onConfirm: async () => {
        try {
          const response = await categoriesAPI.deleteCategory(categoryId);
          if (response.success) {
            toast.success('Category has been deleted successfully!');
            fetchCategories();
          }
        } catch (error) {
          toast.error('Failed to delete category: ' + error.message);
        }
      }
    });
  };

  if (!userData || loading) {
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
              <h1 className={`text-2xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Books Management
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowCategoryModal(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <FaPlus className="text-sm" />
                <span className="hidden sm:inline">Add Category</span>
              </button>
              <button
                onClick={() => navigate('/admin/books/create')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <FaPlus className="text-sm" />
                <span className="hidden sm:inline">Add New Book</span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          {/* Filters */}
          <div className={`rounded-xl shadow-sm border p-6 mb-6 ${
            theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
          }`}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-700'
                }`}>
                  Search Books
                </label>
                <div className="relative">
                  <FaSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <input
                    type="text"
                    placeholder="Search by title, author, or publisher... (Press Enter to search)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        applyFilters();
                      }
                    }}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                  />
                </div>
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-700'
                }`}>
                  Filter by Category
                </label>
                <div className="relative">
                  <FaFilter className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                      <option key={category.category_id} value={category.category_id}>
                        {category.category_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-700'
                }`}>
                  Filter by Stock
                </label>
                <div className="relative">
                  <FaFilter className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <select
                    value={selectedStock}
                    onChange={(e) => setSelectedStock(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="">All Stock Status</option>
                    <option value="available">Available</option>
                    <option value="out-of-stock">Out of Stock</option>
                  </select>
                </div>
              </div>

              <div className="flex items-end space-x-2">
                <button
                  onClick={applyFilters}
                  className={`px-4 py-2 border rounded-lg transition-colors ${
                    theme === 'dark'
                      ? 'bg-blue-600 border-blue-600 text-white hover:bg-blue-700'
                      : 'bg-blue-600 border-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  Apply Filter
                </button>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('');
                    setSelectedStock('');
                    setCurrentPage(1);
                    fetchBooks('', '', '', 1);
                  }}
                  className={`px-4 py-2 border rounded-lg transition-colors ${
                    theme === 'dark'
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Books Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
            {books && books.length > 0 ? books.map((book) => (
              <div key={book.book_id} 
                onClick={() => navigate(`/admin/books/${book.book_id}`)}
                className={`group rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col cursor-pointer ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}>
                {/* Book Cover */}
                <div className={`relative aspect-[3/4] overflow-hidden ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                }`}>
                  {book.image_url ? (
                    <img 
                      src={book.image_url.startsWith('http') ? book.image_url : `http://172.22.14.221:3000${book.image_url}`} // Update with your server's IP address
                      alt={book.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className={`w-full h-full flex items-center justify-center ${
                      theme === 'dark' ? 'bg-gradient-to-br from-gray-700 to-gray-800' : 'bg-gradient-to-br from-gray-100 to-gray-200'
                    }`}>
                      <div className={`flex flex-col items-center transform transition-transform group-hover:scale-110 ${
                        theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                      }`}>
                        <FaEdit className="text-6xl mb-2" />
                        <span className="text-sm font-medium">No Cover</span>
                      </div>
                    </div>
                  )}

                  {/* Overlay Information */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-white text-sm overflow-hidden line-clamp-2" style={{display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'}}>
                        {book.description ? (
                          book.description.length > 100 
                            ? `${book.description.substring(0, 100)}...`
                            : book.description
                        ) : 'No description available.'}
                      </p>
                    </div>
                  </div>

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex justify-between items-start gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium shadow-lg backdrop-blur-sm bg-opacity-90 ${
                      theme === 'dark' ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {book.category_name || 'Uncategorized'}
                    </span>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium shadow-lg backdrop-blur-sm bg-opacity-90 ${
                      book.stock > 5 
                        ? theme === 'dark' ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-800'
                        : book.stock <= 5 && book.stock > 0 
                          ? theme === 'dark' ? 'bg-yellow-900/50 text-yellow-300' : 'bg-yellow-100 text-yellow-800'
                          : theme === 'dark' ? 'bg-red-900/50 text-red-300' : 'bg-red-100 text-red-800'
                    }`}>
                      {book.stock} copies
                    </span>
                  </div>
                </div>

                {/* Book Info */}
                <div className="p-4 flex flex-col flex-1 space-y-3">
                  <div className="flex-1">
                    <h3 className={`font-semibold text-lg leading-tight group-hover:text-blue-600 transition-colors duration-200 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {book.title}
                    </h3>
                    <p className={`text-sm mt-1 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      by {book.author}
                    </p>
                    <div className={`flex items-center gap-1 mt-1 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      <FaStar className="text-yellow-500 text-xs" />
                      <span className="text-xs">
                        {book.average_rating ? parseFloat(book.average_rating).toFixed(1) : 'N/A'}
                        {book.total_ratings > 0 && (
                          <span className="ml-1">({book.total_ratings})</span>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className={`flex items-center text-sm gap-4 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    <span className="flex items-center">
                      <FaEdit className="mr-1" />
                      {book.publish_year}
                    </span>
                    <span className="flex items-center">
                      <FaEye className="mr-1" />
                      {book.borrowed_count || 0} borrows
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className={`flex items-center gap-2 pt-3 border-t ${
                    theme === 'dark' ? 'border-gray-600' : 'border-gray-100'
                  }`}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/admin/books/${book.book_id}`);
                      }}
                      className={`flex-1 inline-flex justify-center items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        theme === 'dark' 
                          ? 'text-gray-300 bg-gray-700 hover:bg-gray-600 hover:text-white'
                          : 'text-gray-700 bg-gray-50 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <FaEye className="mr-1.5" /> View
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/admin/books/edit/${book.book_id}`);
                      }}
                      className="flex-1 inline-flex justify-center items-center px-3 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                    >
                      <FaEdit className="mr-1.5" /> Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(book.book_id);
                      }}
                      className="flex-1 inline-flex justify-center items-center px-3 py-2 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors"
                    >
                      <FaTrash className="mr-1.5" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-full text-center py-12">
                <p className={`text-lg ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  No books found.
                </p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {pagination && pagination.last_page > 1 && (
            <div className={`px-6 py-3 rounded-xl shadow-sm border flex items-center justify-between mt-6 ${
              theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
            }`}>
                <div className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-700'
                }`}>
                  Showing {((pagination.current_page - 1) * pagination.per_page) + 1} to {
                    Math.min(pagination.current_page * pagination.per_page, pagination.total)
                  } of {pagination.total} results
                </div>
                <div className="flex items-center space-x-1">
                  {/* Previous Button */}
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`px-3 py-2 rounded-lg border transition-colors ${
                      currentPage === 1
                        ? theme === 'dark'
                          ? 'border-gray-600 text-gray-500 cursor-not-allowed'
                          : 'border-gray-300 text-gray-400 cursor-not-allowed'
                        : theme === 'dark'
                          ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Previous
                  </button>

                  {/* Page Numbers */}
                  {(() => {
                    const totalPages = pagination.last_page;
                    const current = currentPage;
                    const pages = [];
                    
                    // Always show first page
                    if (current > 3) {
                      pages.push(
                        <button
                          key={1}
                          onClick={() => setCurrentPage(1)}
                          className={`px-3 py-2 rounded-lg border transition-colors ${
                            theme === 'dark'
                              ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          1
                        </button>
                      );
                      
                      if (current > 4) {
                        pages.push(
                          <span key="dots1" className={`px-2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                            ...
                          </span>
                        );
                      }
                    }

                    // Show pages around current page
                    const start = Math.max(1, current - 2);
                    const end = Math.min(totalPages, current + 2);
                    
                    for (let i = start; i <= end; i++) {
                      pages.push(
                        <button
                          key={i}
                          onClick={() => setCurrentPage(i)}
                          className={`px-3 py-2 rounded-lg border transition-colors ${
                            i === current
                              ? 'bg-blue-600 border-blue-600 text-white'
                              : theme === 'dark'
                                ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {i}
                        </button>
                      );
                    }

                    // Always show last page
                    if (current < totalPages - 2) {
                      if (current < totalPages - 3) {
                        pages.push(
                          <span key="dots2" className={`px-2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                            ...
                          </span>
                        );
                      }
                      
                      pages.push(
                        <button
                          key={totalPages}
                          onClick={() => setCurrentPage(totalPages)}
                          className={`px-3 py-2 rounded-lg border transition-colors ${
                            theme === 'dark'
                              ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {totalPages}
                        </button>
                      );
                    }

                    return pages;
                  })()}

                  {/* Next Button */}
                  <button
                    onClick={() => setCurrentPage(Math.min(pagination.last_page, currentPage + 1))}
                    disabled={currentPage === pagination.last_page}
                    className={`px-3 py-2 rounded-lg border transition-colors ${
                      currentPage === pagination.last_page
                        ? theme === 'dark'
                          ? 'border-gray-600 text-gray-500 cursor-not-allowed'
                          : 'border-gray-300 text-gray-400 cursor-not-allowed'
                        : theme === 'dark'
                          ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Next
                  </button>
                </div>
            </div>
          )}
        </main>
      </div>

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`rounded-xl shadow-xl max-w-md w-full mx-4 ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className={`px-6 py-4 border-b ${
              theme === 'dark' ? 'border-gray-600' : 'border-gray-200'
            }`}>
              <h2 className={`text-lg font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h2>
            </div>
            
            <form onSubmit={handleCategorySubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-700'
                  }`}>
                    Category Name
                  </label>
                  <input
                    type="text"
                    value={categoryForm.category_name}
                    onChange={(e) => setCategoryForm({...categoryForm, category_name: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    placeholder="Enter category name"
                    required
                  />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-700'
                  }`}>
                    Category Color
                  </label>
                  <div className="flex items-center gap-3">
                    <div className={`relative w-12 h-10 border rounded-lg overflow-hidden cursor-pointer ${
                      theme === 'dark' ? 'border-gray-600' : 'border-gray-300'
                    }`}>
                      <input
                        type="color"
                        value={categoryForm.color}
                        onChange={(e) => setCategoryForm({...categoryForm, color: e.target.value})}
                        className="absolute inset-0 w-full h-full border-none outline-none cursor-pointer appearance-none"
                        style={{backgroundColor: categoryForm.color, border: 'none'}}
                      />
                    </div>
                    <input
                      type="text"
                      value={categoryForm.color}
                      onChange={(e) => setCategoryForm({...categoryForm, color: e.target.value})}
                      className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                        theme === 'dark' 
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="#3B82F6"
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-3 mt-6">
                {/* Cancel and Create buttons on same row */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCategoryModal(false);
                      setEditingCategory(null);
                      setCategoryForm({ category_name: '', color: '#3B82F6' });
                    }}
                    className={`flex-1 px-4 py-2 border rounded-lg transition-colors ${
                      theme === 'dark'
                        ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={categoryLoading}
                    className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-lg transition-colors"
                  >
                    {categoryLoading ? (editingCategory ? 'Updating...' : 'Creating...') : (editingCategory ? 'Update Category' : 'Create Category')}
                  </button>
                </div>
                
                {/* Edit button on separate row */}
                <button
                  type="button"
                  onClick={() => {
                    setShowCategoryModal(false);
                    setShowManageCategoriesModal(true);
                  }}
                  className={`w-full px-4 py-2 border rounded-lg transition-colors ${
                    theme === 'dark'
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Edit Existing Categories
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manage Categories Modal */}
      {showManageCategoriesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`rounded-xl shadow-xl max-w-md w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className={`px-6 py-4 border-b ${
              theme === 'dark' ? 'border-gray-600' : 'border-gray-200'
            }`}>
              <h2 className={`text-lg font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Manage Categories
              </h2>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-3">
                {categories.map((category) => (
                  <div key={category.category_id} className={`flex items-center justify-between p-3 border rounded-lg ${
                    theme === 'dark' ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full border"
                        style={{backgroundColor: category.color || '#3B82F6'}}
                      ></div>
                      <span className={`font-medium ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {category.category_name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditCategory(category)}
                        className={`p-1 rounded transition-colors ${
                          theme === 'dark'
                            ? 'text-blue-400 hover:bg-blue-900/30'
                            : 'text-blue-600 hover:bg-blue-50'
                        }`}
                      >
                        <FaEdit className="text-sm" />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.category_id)}
                        className={`p-1 rounded transition-colors ${
                          theme === 'dark'
                            ? 'text-red-400 hover:bg-red-900/30'
                            : 'text-red-600 hover:bg-red-50'
                        }`}
                      >
                        <FaTrash className="text-sm" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className={`px-6 py-4 border-t ${
              theme === 'dark' ? 'border-gray-600' : 'border-gray-200'
            }`}>
              <button
                onClick={() => setShowManageCategoriesModal(false)}
                className={`w-full px-4 py-2 border rounded-lg transition-colors ${
                  theme === 'dark'
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmationState.isOpen}
        onClose={hideConfirmation}
        onConfirm={handleConfirm}
        title={confirmationState.title}
        message={confirmationState.message}
        confirmText={confirmationState.confirmText}
        cancelText={confirmationState.cancelText}
        confirmButtonColor={confirmationState.confirmButtonColor}
        theme={theme}
      />
    </div>
  );
};

export default AdminBooks;