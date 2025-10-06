import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaBars,
  FaSearch,
  FaEye,
  FaCheck,
  FaUndo,
  FaTimes,
  FaUser,
  FaBook,
  FaCalendarAlt,
  FaClock,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf
} from 'react-icons/fa';
import { useTheme } from '../../hooks/useTheme.js';
import { borrowingsAPI } from '../../api/index.js';
import SidebarAdmin from '../../components/SidebarAdmin.jsx';
import ConfirmationModal from '../../components/ConfirmationModal.jsx';
import useConfirmation from '../../hooks/useConfirmation.js';
import { toast } from 'react-toastify';

const AdminBorrows = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [userData, setUserData] = useState(null);
  const [borrowings, setBorrowings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
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

  const fetchBorrowings = useCallback(async (search = '', status = '', page = currentPage) => {
    try {
      setLoading(true);
      const response = await borrowingsAPI.getBorrowings(page, 10, status, search);
      if (response.success) {
        setBorrowings(response.data);
        setPagination(response.pagination);
      }
    } catch (error) {
      console.error('Error fetching borrowings:', error);
      toast.error('Failed to fetch borrowings');
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  const applyFilters = useCallback(() => {
    setCurrentPage(1); 
    fetchBorrowings(searchTerm, selectedStatus, 1);
  }, [searchTerm, selectedStatus, fetchBorrowings]);

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
    fetchBorrowings();
  }, [navigate, fetchBorrowings]);

  useEffect(() => {
    const delayedFilter = setTimeout(() => {
      applyFilters();
    }, 300);

    return () => clearTimeout(delayedFilter);
  }, [searchTerm, applyFilters]);

  useEffect(() => {
    applyFilters();
  }, [selectedStatus, applyFilters]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchBorrowings(searchTerm, selectedStatus, page);
  };

  const handleApproveBorrowing = async (borrowingId) => {
    try {
      const statusData = {
        status: 'Borrowed',
        approved_by: userData.users_id,
        notes: 'Approved by admin'
      };

      const response = await borrowingsAPI.updateBorrowingStatus(borrowingId, statusData);
      if (response.success) {
        toast.success('Borrowing approved successfully!');
        fetchBorrowings(searchTerm, selectedStatus, currentPage);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to approve borrowing');
    }
  };

  const handleReturnBook = async (borrowingId) => {
    try {
      const returnData = {
        notes: 'Book returned',
        fine: 0
      };

      const response = await borrowingsAPI.returnBook(borrowingId, returnData);
      if (response.success) {
        toast.success('Book returned successfully!');
        fetchBorrowings(searchTerm, selectedStatus, currentPage);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to return book');
    }
  };

  const handleRejectBorrowing = async (borrowingId) => {
    showConfirmation(
      'Reject Borrowing Request',
      'Are you sure you want to reject this borrowing request? This action cannot be undone.',
      async () => {
        try {
          await borrowingsAPI.deleteBorrowing(borrowingId);
          toast.success('Borrowing request rejected successfully!');
          fetchBorrowings(searchTerm, selectedStatus, currentPage);
        } catch (error) {
          toast.error(error.message || 'Failed to reject borrowing request');
        }
      }
    );
  };

  const handleExtendBorrowing = async (borrowingId) => {
    showConfirmation(
      'Extend Borrowing Period',
      'Are you sure you want to extend this borrowing period by 7 days?',
      async () => {
        try {
          const extensionData = {
            extension_days: 7,
            approved_by: userData.users_id,
            notes: 'Extended by admin for additional 7 days'
          };

          await borrowingsAPI.extendBorrowing(borrowingId, extensionData);
          toast.success('Borrowing period extended successfully!');
          fetchBorrowings(searchTerm, selectedStatus, currentPage);
        } catch (error) {
          toast.error(error.message || 'Failed to extend borrowing period');
        }
      }
    );
  };

  const getStatusBadge = (status, daysOverdue) => {
    const isOverdue = (status === 'Borrowed' || status === 'Extended') && daysOverdue < 0;
    
    if (isOverdue) {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400">
          <FaExclamationTriangle className="mr-1 text-xs" />
          Overdue
        </span>
      );
    }

    const statusConfig = {
      'Pending': {
        bgColor: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
        icon: <FaHourglassHalf className="mr-1 text-xs" />
      },
      'Borrowed': {
        bgColor: 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        icon: <FaCheckCircle className="mr-1 text-xs" />
      },
      'Extended': {
        bgColor: 'bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
        icon: <FaClock className="mr-1 text-xs" />
      },
      'Returned': {
        bgColor: 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
        icon: <FaCheck className="mr-1 text-xs" />
      }
    };

    const config = statusConfig[status] || statusConfig['Pending'];
    
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.bgColor}`}>
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
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDaysInfo = (status, daysOverdue, dueDate) => {
    if (status === 'Returned' || !dueDate) return null;
    
    if (status === 'Borrowed') {
      if (daysOverdue < 0) {
        return (
          <div className="text-xs text-red-500 dark:text-red-400">
            Overdue by {Math.abs(daysOverdue)} days
          </div>
        );
      } else if (daysOverdue >= 0) {
        return (
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {daysOverdue === 0 ? 'Due today' : `${daysOverdue} days remaining`}
          </div>
        );
      }
    }
    return null;
  };

  const statusButtons = [
    { key: '', label: 'All Requests', bgColor: '' },
    { key: 'pending', label: 'Pending', bgColor: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
    { key: 'borrowed', label: 'Borrowed', bgColor: 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
    { key: 'extended', label: 'Extended', bgColor: 'bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
    { key: 'overdue', label: 'Overdue', bgColor: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
    { key: 'returned', label: 'Returned', bgColor: 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' }
  ];

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
              <h1 className={`text-2xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Borrow Requests
              </h1>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
          {/* Filters and Search */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-6">
            {/* Status Filter Buttons */}
            <div className="border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center p-4 space-x-4 overflow-x-auto">
                {statusButtons.map((button) => (
                  <button
                    key={button.key}
                    onClick={() => setSelectedStatus(button.key)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                      selectedStatus === button.key
                        ? button.bgColor || 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700'
                    }`}
                  >
                    {button.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Bar */}
            <div className="p-4">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  placeholder="Search by user name, email, or book title..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Borrowings Table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600 dark:text-gray-400">Loading borrowings...</span>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-600">
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">User</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Book</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Borrow Date</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Due Date</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                      {borrowings.length > 0 ? (
                        borrowings.map((borrowing) => (
                          <tr key={borrowing.borrowing_id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all">
                            {/* User Info */}
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-600 flex items-center justify-center text-gray-500 dark:text-gray-400 mr-3">
                                  <FaUser />
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-gray-900 dark:text-white">{borrowing.user_name}</div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400">{borrowing.user_email}</div>
                                </div>
                              </div>
                            </td>

                            {/* Book Info */}
                            <td className="px-6 py-4">
                              <div>
                                <div className="text-sm font-medium text-gray-900 dark:text-white">{borrowing.book_title}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">by {borrowing.book_author}</div>
                              </div>
                            </td>

                            {/* Borrow Date */}
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900 dark:text-white">{formatDate(borrowing.borrow_date)}</div>
                            </td>

                            {/* Due Date */}
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900 dark:text-white">{formatDate(borrowing.due_date)}</div>
                              {formatDaysInfo(borrowing.status, borrowing.days_diff, borrowing.due_date)}
                            </td>

                            {/* Status */}
                            <td className="px-6 py-4">
                              {getStatusBadge(borrowing.display_status || borrowing.status, borrowing.days_diff)}
                            </td>

                            {/* Actions */}
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-3">
                                {/* View Details */}
                                <button 
                                  onClick={() => navigate(`/admin/borrows/${borrowing.borrowing_id}`)}
                                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                                  title="View Details"
                                >
                                  <FaEye className="mr-1" /> View Details
                                </button>

                                {/* Approve (for pending requests) */}
                                {borrowing.status === 'Pending' && (
                                  <button
                                    onClick={() => handleApproveBorrowing(borrowing.borrowing_id)}
                                    className="inline-flex items-center px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-all"
                                    title="Approve Request"
                                  >
                                    <FaCheck className="mr-1" /> Approve
                                  </button>
                                )}

                                {/* Extend (for borrowed books) */}
                                {borrowing.status === 'Borrowed' && (
                                  <button
                                    onClick={() => handleExtendBorrowing(borrowing.borrowing_id)}
                                    className="inline-flex items-center px-3 py-1 bg-purple-500 hover:bg-purple-600 text-white text-sm font-medium rounded-lg transition-all"
                                    title="Extend Borrowing Period"
                                  >
                                    <FaClock className="mr-1" /> Extend
                                  </button>
                                )}

                                {/* Return (for borrowed/extended/overdue books) */}
                                {(borrowing.status === 'Borrowed' || borrowing.status === 'Extended' || borrowing.display_status === 'Overdue') && (
                                  <button
                                    onClick={() => handleReturnBook(borrowing.borrowing_id)}
                                    className="inline-flex items-center px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-all"
                                    title="Return Book"
                                  >
                                    <FaUndo className="mr-1" /> Return
                                  </button>
                                )}

                                {/* Reject (for pending requests) */}
                                {borrowing.status === 'Pending' && (
                                  <button
                                    onClick={() => handleRejectBorrowing(borrowing.borrowing_id)}
                                    className="inline-flex items-center px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-all"
                                    title="Reject Request"
                                  >
                                    <FaTimes className="mr-1" /> Reject
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="px-6 py-12 text-center">
                            <div className="flex flex-col items-center">
                              <FaBook className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" />
                              <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">No borrowings found</p>
                              <p className="text-gray-500 dark:text-gray-400">
                                {searchTerm || selectedStatus
                                  ? "Try adjusting your search or filter criteria"
                                  : "No borrowing requests have been made yet"
                                }
                              </p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        Showing <span className="font-medium">{((pagination.currentPage - 1) * pagination.itemsPerPage) + 1}</span> to{' '}
                        <span className="font-medium">
                          {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)}
                        </span>{' '}
                        of <span className="font-medium">{pagination.totalItems}</span> results
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handlePageChange(pagination.currentPage - 1)}
                          disabled={pagination.currentPage === 1}
                          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Previous
                        </button>
                        
                        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-3 py-2 text-sm font-medium rounded-md ${
                              page === pagination.currentPage
                                ? 'text-white bg-blue-600 border border-blue-600'
                                : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                        
                        <button
                          onClick={() => handlePageChange(pagination.currentPage + 1)}
                          disabled={pagination.currentPage === pagination.totalPages}
                          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
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

export default AdminBorrows;