import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  FaBars,
  FaArrowLeft,
  FaUser,
  FaBook,
  FaCalendarAlt,
  FaClock,
  FaCheck,
  FaUndo,
  FaTimes,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaStickyNote
} from 'react-icons/fa';
import { useTheme } from '../../hooks/useTheme.js';
import { borrowingsAPI } from '../../api/index.js';
import SidebarAdmin from '../../components/SidebarAdmin.jsx';
import ConfirmationModal from '../../components/ConfirmationModal.jsx';
import useConfirmation from '../../hooks/useConfirmation.js';
import { toast } from 'react-toastify';

const AdminBorrowDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { theme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [userData, setUserData] = useState(null);
  const [borrowing, setBorrowing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [notes, setNotes] = useState('');
  const [fine, setFine] = useState(0);
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
    fetchBorrowingDetail();
  }, [id, navigate, fetchBorrowingDetail]);

  const fetchBorrowingDetail = useCallback(async () => {
    try {
      setLoading(true);
      const response = await borrowingsAPI.getBorrowingById(id);
      if (response.success) {
        setBorrowing(response.data);
        setNotes(response.data.notes || '');
      }
    } catch (error) {
      console.error('Failed to fetch borrowing details:', error);
      toast.error('Failed to fetch borrowing details');
      navigate('/admin/borrows');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  const handleApproveBorrowing = async () => {
    try {
      setActionLoading(true);
      const statusData = {
        status: 'Borrowed',
        approved_by: userData.users_id,
        notes: notes || 'Approved by admin'
      };

      const response = await borrowingsAPI.updateBorrowingStatus(id, statusData);
      if (response.success) {
        toast.success('Borrowing approved successfully!');
        fetchBorrowingDetail();
      }
    } catch (error) {
      toast.error(error.message || 'Failed to approve borrowing');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReturnBook = async () => {
    try {
      setActionLoading(true);
      const returnData = {
        notes: notes || 'Book returned',
        fine: parseFloat(fine) || 0
      };

      const response = await borrowingsAPI.returnBook(id, returnData);
      if (response.success) {
        toast.success('Book returned successfully!');
        fetchBorrowingDetail();
      }
    } catch (error) {
      toast.error(error.message || 'Failed to return book');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectBorrowing = () => {
    showConfirmation(
      'Reject Borrowing Request',
      'Are you sure you want to reject this borrowing request? This action cannot be undone.',
      async () => {
        try {
          setActionLoading(true);
          await borrowingsAPI.deleteBorrowing(id);
          toast.success('Borrowing request rejected successfully!');
          navigate('/admin/borrows');
        } catch (error) {
          toast.error(error.message || 'Failed to reject borrowing request');
        } finally {
          setActionLoading(false);
        }
      }
    );
  };

  const handleExtendBorrowing = () => {
    showConfirmation(
      'Extend Borrowing Period',
      'Are you sure you want to extend this borrowing period by 7 days?',
      async () => {
        try {
          setActionLoading(true);
          const extensionData = {
            extension_days: 7,
            approved_by: userData.users_id,
            notes: notes || 'Extended by admin for additional 7 days'
          };

          const response = await borrowingsAPI.extendBorrowing(id, extensionData);
          if (response.success) {
            toast.success('Borrowing period extended successfully!');
            fetchBorrowingDetail();
          }
        } catch (error) {
          toast.error(error.message || 'Failed to extend borrowing period');
        } finally {
          setActionLoading(false);
        }
      }
    );
  };

  const getStatusBadge = (status, daysOverdue) => {
    const isOverdue = (status === 'Borrowed' || status === 'Extended') && daysOverdue < 0;
    
    if (isOverdue) {
      return (
        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400">
          <FaExclamationTriangle className="mr-2" />
          Overdue
        </span>
      );
    }

    const statusConfig = {
      'Pending': {
        bgColor: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
        icon: <FaHourglassHalf className="mr-2" />
      },
      'Borrowed': {
        bgColor: 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        icon: <FaCheckCircle className="mr-2" />
      },
      'Extended': {
        bgColor: 'bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
        icon: <FaClock className="mr-2" />
      },
      'Returned': {
        bgColor: 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
        icon: <FaCheck className="mr-2" />
      }
    };

    const config = statusConfig[status] || statusConfig['Pending'];
    
    return (
      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${config.bgColor}`}>
        {config.icon}
        {status}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDateOnly = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-400">Loading borrowing details...</span>
        </div>
      </div>
    );
  }

  if (!borrowing) {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <FaTimesCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Borrowing Not Found</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">The borrowing record you're looking for doesn't exist.</p>
            <button
              onClick={() => navigate('/admin/borrows')}
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              Back to Borrowings
            </button>
          </div>
        </div>
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
        activeMenu="borrows"
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
                onClick={() => navigate('/admin/borrows')}
                className={`p-2 rounded-lg transition-colors ${
                  theme === 'dark' ? 'hover:bg-gray-700 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                }`}
                title="Back to Borrowings"
              >
                <FaArrowLeft className="text-lg" />
              </button>
              <div>
                <h1 className={`text-2xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Borrowing Details
                </h1>
                <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  ID: #{borrowing.borrowing_id}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {getStatusBadge(borrowing.display_status || borrowing.status)}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* User Information */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <FaUser className="mr-2 text-blue-600" />
                User Information
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <FaUser className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{borrowing.user_name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{borrowing.user_email}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Book Information */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <FaBook className="mr-2 text-green-600" />
                Book Information
              </h3>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Title</p>
                  <p className="font-medium text-gray-900 dark:text-white">{borrowing.book_title}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Author</p>
                  <p className="text-gray-900 dark:text-white">{borrowing.book_author}</p>
                </div>
                {borrowing.publisher && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Publisher</p>
                    <p className="text-gray-900 dark:text-white">{borrowing.publisher}</p>
                  </div>
                )}
                {borrowing.isbn && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">ISBN</p>
                    <p className="text-gray-900 dark:text-white">{borrowing.isbn}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Borrowing Timeline */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <FaCalendarAlt className="mr-2 text-purple-600" />
                Timeline
              </h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Request Date</p>
                  <p className="text-gray-900 dark:text-white">{formatDate(borrowing.created_at)}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Borrow Date</p>
                  <p className="text-gray-900 dark:text-white">{formatDateOnly(borrowing.borrow_date)}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Due Date</p>
                  <p className="text-gray-900 dark:text-white">{formatDateOnly(borrowing.due_date)}</p>
                </div>
                
                {borrowing.return_date && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Return Date</p>
                    <p className="text-gray-900 dark:text-white">{formatDateOnly(borrowing.return_date)}</p>
                  </div>
                )}
                
                {borrowing.approved_date && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Approved Date</p>
                    <p className="text-gray-900 dark:text-white">{formatDate(borrowing.approved_date)}</p>
                    {borrowing.approved_by_name && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">by {borrowing.approved_by_name}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Notes and Actions */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Notes Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <FaStickyNote className="mr-2 text-orange-600" />
                Notes
              </h3>
              
              <div className="space-y-4">
                {borrowing.notes && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Existing Notes</p>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                      <p className="text-gray-900 dark:text-white">{borrowing.notes}</p>
                    </div>
                  </div>
                )}
                
                {(borrowing.status === 'Pending' || borrowing.status === 'Borrowed' || borrowing.status === 'Extended' || borrowing.display_status === 'Overdue') && (
                  <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Add Notes
                    </label>
                    <textarea
                      id="notes"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Add notes about this borrowing..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>
                )}

                {(borrowing.status === 'Borrowed' || borrowing.status === 'Extended' || borrowing.display_status === 'Overdue') && (
                  <div>
                    <label htmlFor="fine" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Fine Amount ($)
                    </label>
                    <input
                      type="number"
                      id="fine"
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="0.00"
                      value={fine}
                      onChange={(e) => setFine(e.target.value)}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Actions Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Actions</h3>
              
              <div className="space-y-3">
                {borrowing.status === 'Pending' && (
                  <>
                    <button
                      onClick={handleApproveBorrowing}
                      disabled={actionLoading}
                      className="w-full flex items-center justify-center px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium rounded-lg transition-colors"
                    >
                      <FaCheck className="mr-2" />
                      {actionLoading ? 'Processing...' : 'Approve Request'}
                    </button>
                    
                    <button
                      onClick={handleRejectBorrowing}
                      disabled={actionLoading}
                      className="w-full flex items-center justify-center px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-medium rounded-lg transition-colors"
                    >
                      <FaTimes className="mr-2" />
                      {actionLoading ? 'Processing...' : 'Reject Request'}
                    </button>
                  </>
                )}

                {borrowing.status === 'Borrowed' && (
                  <button
                    onClick={handleExtendBorrowing}
                    disabled={actionLoading}
                    className="w-full flex items-center justify-center px-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-medium rounded-lg transition-colors"
                  >
                    <FaClock className="mr-2" />
                    {actionLoading ? 'Processing...' : 'Extend Period (+7 days)'}
                  </button>
                )}

                {(borrowing.status === 'Borrowed' || borrowing.status === 'Extended' || borrowing.display_status === 'Overdue') && (
                  <button
                    onClick={handleReturnBook}
                    disabled={actionLoading}
                    className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors"
                  >
                    <FaUndo className="mr-2" />
                    {actionLoading ? 'Processing...' : 'Mark as Returned'}
                  </button>
                )}

                {borrowing.status === 'Returned' && (
                  <div className="text-center py-8">
                    <FaCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-900 dark:text-white">Book Returned</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">This borrowing has been completed.</p>
                  </div>
                )}

                <button
                  onClick={() => navigate('/admin/borrows')}
                  className="w-full flex items-center justify-center px-4 py-3 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
                >
                  <FaArrowLeft className="mr-2" />
                  Back to Borrowings
                </button>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmationState.isOpen}
        title={confirmationState.title}
        message={confirmationState.message}
        onConfirm={handleConfirm}
        onCancel={hideConfirmation}
        confirmText="Yes, Proceed"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default AdminBorrowDetail;