import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  FaBook, 
  FaBars,
  FaEdit,
  FaTrash,
  FaArrowLeft,
  FaCalendar,
  FaBuilding,
  FaFileAlt,
  FaMapMarkerAlt,
  FaLayerGroup
} from 'react-icons/fa';
import { useTheme } from '../../hooks/useTheme.js';
import { booksAPI } from '../../api/index.js';
import SidebarAdmin from '../../components/SidebarAdmin.jsx';
import ConfirmationModal from '../../components/ConfirmationModal.jsx';
import useConfirmation from '../../hooks/useConfirmation.js';
import { toast } from 'react-toastify';

const AdminBookDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { theme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [userData, setUserData] = useState(null);
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
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

  const fetchBookData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await booksAPI.getBookById(id);
      if (response.success) {
        setBook(response.data);
      } else {
        toast.error('Book not found');
        navigate('/admin/books');
      }
    } catch (error) {
      console.error('Error fetching book data:', error);
      toast.error('Failed to load book data');
      navigate('/admin/books');
    } finally {
      setLoading(false);
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
    fetchBookData();
  }, [navigate, fetchBookData]);

  const handleDelete = async () => {
    showConfirmation({
      title: "Delete Book",
      message: "Are you sure you want to delete this book? This action cannot be undone and you will be redirected to the books page.",
      confirmText: "Delete",
      cancelText: "Cancel",
      confirmButtonColor: "red",
      onConfirm: async () => {
        try {
          const response = await booksAPI.deleteBook(id);
          if (response.success) {
            // Navigate immediately since we're leaving the page
            navigate('/admin/books');
            toast.success('Book has been deleted successfully!');
          }
        } catch (error) {
          toast.error('Failed to delete book: ' + error.message);
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
              <button
                onClick={() => navigate('/admin/books')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  theme === 'dark' ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <FaArrowLeft className="text-sm" />
              </button>
              <h1 className={`text-2xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Book Details
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigate(`/admin/books/edit/${id}`)}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <FaEdit className="text-sm" />
                Edit Book
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <FaTrash className="text-sm" />
                Delete Book
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          {book && (
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Book Header */}
              <div className={`rounded-xl shadow-sm border p-6 ${
                theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
              }`}>
                <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-8">
                  {/* Book Cover */}
                  <div className="flex-shrink-0 mb-6 lg:mb-0">
                    <div className={`w-48 h-64 mx-auto lg:mx-0 rounded-lg overflow-hidden ${
                      theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                    }`}>
                      {book.image_url ? (
                        <img 
                          src={book.image_url.startsWith('http') ? book.image_url : `http://172.22.11.208:3000${book.image_url}`} // Update with your server's IP address
                          alt={book.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentNode.innerHTML = `<div class="w-full h-full flex items-center justify-center"><svg class="text-6xl ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}" fill="currentColor" viewBox="0 0 20 20" style="width: 4rem; height: 4rem;"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div>`;
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FaBook className={`text-6xl ${
                            theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                          }`} />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Book Info */}
                  <div className="flex-1">
                    <div className="mb-4">
                      <h2 className={`text-3xl font-bold mb-2 ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {book.title}
                      </h2>
                      <p className={`text-xl ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        by {book.author}
                      </p>
                    </div>

                    {/* Status Badges */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        theme === 'dark'
                          ? 'bg-blue-900/30 text-blue-400'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        <FaLayerGroup className="mr-2 text-xs" />
                        {book.category_name || 'Uncategorized'}
                      </span>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        book.stock > 0
                          ? theme === 'dark'
                            ? 'bg-green-900/30 text-green-400'
                            : 'bg-green-100 text-green-800'
                          : theme === 'dark'
                            ? 'bg-red-900/30 text-red-400'
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {book.stock > 0 ? `${book.stock} Available` : 'Out of Stock'}
                      </span>
                      {book.borrowed_count > 0 && (
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          theme === 'dark'
                            ? 'bg-orange-900/30 text-orange-400'
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {book.borrowed_count} Borrowed
                        </span>
                      )}
                    </div>

                    {/* Quick Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {book.publisher && (
                        <div className="flex items-center space-x-2">
                          <FaBuilding className={`text-sm ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                          }`} />
                          <span className={`text-sm ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                            {book.publisher}
                          </span>
                        </div>
                      )}
                      {book.publish_year && (
                        <div className="flex items-center space-x-2">
                          <FaCalendar className={`text-sm ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                          }`} />
                          <span className={`text-sm ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                            Published {book.publish_year}
                          </span>
                        </div>
                      )}
                      {book.pages && (
                        <div className="flex items-center space-x-2">
                          <FaFileAlt className={`text-sm ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                          }`} />
                          <span className={`text-sm ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                            {book.pages} pages
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Book Details Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Technical Details */}
                <div className={`rounded-xl shadow-sm border p-6 ${
                  theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
                }`}>
                  <h3 className={`text-lg font-semibold mb-4 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Technical Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className={`text-sm font-medium ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        Book ID
                      </span>
                      <span className={`text-sm ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        #{book.book_id}
                      </span>
                    </div>
                    {book.isbn && (
                      <div className="flex justify-between">
                        <span className={`text-sm font-medium ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          ISBN
                        </span>
                        <span className={`text-sm ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          {book.isbn}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className={`text-sm font-medium ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        Total Stock
                      </span>
                      <span className={`text-sm ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {book.stock} copies
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`text-sm font-medium ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        Currently Borrowed
                      </span>
                      <span className={`text-sm ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {book.borrowed_count || 0} copies
                      </span>
                    </div>
                    {book.location && (
                      <div className="flex justify-between">
                        <span className={`text-sm font-medium flex items-center ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          <FaMapMarkerAlt className="mr-1" />
                          Location
                        </span>
                        <span className={`text-sm ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          {book.location}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Publication Info */}
                <div className={`rounded-xl shadow-sm border p-6 ${
                  theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
                }`}>
                  <h3 className={`text-lg font-semibold mb-4 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Publication Info
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <span className={`text-sm font-medium block mb-1 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        Author
                      </span>
                      <span className={`text-sm ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {book.author}
                      </span>
                    </div>
                    {book.publisher && (
                      <div>
                        <span className={`text-sm font-medium block mb-1 ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          Publisher
                        </span>
                        <span className={`text-sm ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          {book.publisher}
                        </span>
                      </div>
                    )}
                    {book.publish_year && (
                      <div>
                        <span className={`text-sm font-medium block mb-1 ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          Publication Year
                        </span>
                        <span className={`text-sm ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          {book.publish_year}
                        </span>
                      </div>
                    )}
                    {book.isbn && (
                      <div>
                        <span className={`text-sm font-medium block mb-1 ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          ISBN
                        </span>
                        <span className={`text-sm ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          {book.isbn}
                        </span>
                      </div>
                    )}
                    <div>
                      <span className={`text-sm font-medium block mb-1 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        Category
                      </span>
                      <span className={`text-sm ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {book.category_name || 'Uncategorized'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              {book.description && (
                <div className={`rounded-xl shadow-sm border p-6 ${
                  theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
                }`}>
                  <h3 className={`text-lg font-semibold mb-4 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Description
                  </h3>
                  <p className={`text-sm leading-relaxed ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {book.description}
                  </p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
      
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

export default AdminBookDetail;