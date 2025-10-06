import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaBars,
  FaSearch,
  FaEye,
  FaCheck,
  FaTimes,
  FaTrash,
  FaUser,
  FaEnvelope,
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaUserPlus
} from 'react-icons/fa';
import { useTheme } from '../../hooks/useTheme.js';
import { registrationAPI } from '../../api/index.js';
import SidebarAdmin from '../../components/SidebarAdmin.jsx';
import ConfirmationModal from '../../components/ConfirmationModal.jsx';
import useConfirmation from '../../hooks/useConfirmation.js';
import { toast } from 'react-toastify';

const AdminRegistrationRequests = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [userData, setUserData] = useState(null);
  const [registrations, setRegistrations] = useState([]);
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

  const fetchRegistrations = useCallback(async (search = '', status = '', page = currentPage) => {
    try {
      setLoading(true);
      const response = await registrationAPI.getRegistrations(page, 10, status, search);
      if (response.success) {
        setRegistrations(response.data);
        setPagination(response.pagination);
      }
    } catch (error) {
      console.error('Error fetching registrations:', error);
      toast.error('Failed to fetch registration requests');
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  const applyFilters = useCallback(() => {
    setCurrentPage(1); 
    fetchRegistrations(searchTerm, selectedStatus, 1);
  }, [searchTerm, selectedStatus, fetchRegistrations]);

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
    fetchRegistrations();
  }, [navigate, fetchRegistrations]);

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
    fetchRegistrations(searchTerm, selectedStatus, page);
  };

  const handleApproveRegistration = async (registrationId) => {
    showConfirmation({
      title: "Approve Registration Request",
      message: "Are you sure you want to approve this registration request? This will create a new user account and allow the user to login.",
      confirmText: "Approve",
      cancelText: "Cancel",
      confirmButtonColor: "green",
      onConfirm: async () => {
        try {
          const response = await registrationAPI.approveRegistration(registrationId);
          if (response.success) {
            toast.success('Registration approved successfully!');
            fetchRegistrations(searchTerm, selectedStatus, currentPage);
          }
        } catch (error) {
          toast.error(error.message || 'Failed to approve registration');
        }
      }
    });
  };

  const handleRejectRegistration = async (registrationId) => {
    showConfirmation({
      title: "Reject Registration Request",
      message: "Are you sure you want to reject this registration request? The status will be changed to rejected.",
      confirmText: "Reject",
      cancelText: "Cancel",
      confirmButtonColor: "red",
      onConfirm: async () => {
        try {
          const response = await registrationAPI.rejectRegistration(registrationId);
          if (response.success) {
            toast.success('Registration request rejected successfully!');
            fetchRegistrations(searchTerm, selectedStatus, currentPage);
          }
        } catch (error) {
          toast.error(error.message || 'Failed to reject registration request');
        }
      }
    });
  };

  const handleDeleteRegistration = async (registrationId) => {
    showConfirmation({
      title: "Delete Registration Request",
      message: "Are you sure you want to permanently delete this registration request? This action cannot be undone.",
      confirmText: "Delete",
      cancelText: "Cancel",
      confirmButtonColor: "red",
      onConfirm: async () => {
        try {
          const response = await registrationAPI.deleteRegistration(registrationId);
          if (response.success) {
            toast.success('Registration request deleted successfully!');
            fetchRegistrations(searchTerm, selectedStatus, currentPage);
          }
        } catch (error) {
          toast.error(error.message || 'Failed to delete registration request');
        }
      }
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Pending': {
        bgColor: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
        icon: <FaHourglassHalf className="mr-1 text-xs" />
      },
      'Approved': {
        bgColor: 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        icon: <FaCheckCircle className="mr-1 text-xs" />
      },
      'Rejected': {
        bgColor: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400',
        icon: <FaTimesCircle className="mr-1 text-xs" />
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

  const statusButtons = [
    { key: '', label: 'All Requests', bgColor: '' },
    { key: 'pending', label: 'Pending', bgColor: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
    { key: 'approved', label: 'Approved', bgColor: 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
    { key: 'rejected', label: 'Rejected', bgColor: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400' }
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
        activeMenu="registration"
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
                Registration Requests
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
                  placeholder="Search by name or email..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Registration Requests Table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600 dark:text-gray-400">Loading registration requests...</span>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-600">
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Username</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Email</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Requested Role</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Request Date</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                      {registrations.length > 0 ? (
                        registrations.map((registration) => (
                          <tr key={registration.register_id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all">
                            {/* Username */}
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-600 flex items-center justify-center text-gray-500 dark:text-gray-400 mr-3">
                                  <FaUser />
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-gray-900 dark:text-white">{registration.name}</div>
                                </div>
                              </div>
                            </td>

                            {/* Email */}
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <FaEnvelope className="text-gray-400 dark:text-gray-500 mr-2" />
                                <div className="text-sm text-gray-900 dark:text-white">{registration.email}</div>
                              </div>
                            </td>

                            {/* Requested Role */}
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                <FaUserPlus className="mr-1 text-xs" />
                                {registration.requested_role || 'User'}
                              </span>
                            </td>

                            {/* Request Date */}
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <FaCalendarAlt className="text-gray-400 dark:text-gray-500 mr-2" />
                                <div className="text-sm text-gray-900 dark:text-white">{formatDate(registration.register_date)}</div>
                              </div>
                            </td>

                            {/* Status */}
                            <td className="px-6 py-4">
                              {getStatusBadge(registration.status)}
                            </td>

                            {/* Actions */}
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-3">
                                {/* Approve (for pending requests) */}
                                {registration.status === 'Pending' && (
                                  <button
                                    onClick={() => handleApproveRegistration(registration.register_id)}
                                    className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all"
                                    title="Approve Registration"
                                  >
                                    <FaCheck className="text-sm" />
                                  </button>
                                )}

                                {/* Reject (for pending requests) */}
                                {registration.status === 'Pending' && (
                                  <button
                                    onClick={() => handleRejectRegistration(registration.register_id)}
                                    className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all"
                                    title="Reject Registration"
                                  >
                                    <FaTimes className="text-sm" />
                                  </button>
                                )}

                                {/* Delete (for rejected requests) */}
                                {registration.status === 'Rejected' && (
                                  <button
                                    onClick={() => handleDeleteRegistration(registration.register_id)}
                                    className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all"
                                    title="Delete Registration"
                                  >
                                    <FaTrash className="text-sm" />
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
                              <FaUserPlus className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" />
                              <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">No registration requests found</p>
                              <p className="text-gray-500 dark:text-gray-400">
                                {searchTerm || selectedStatus
                                  ? "Try adjusting your search or filter criteria"
                                  : "No registration requests have been made yet"
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
        onClose={hideConfirmation}
        onConfirm={handleConfirm}
        title={confirmationState.title}
        message={confirmationState.message}
        confirmText={confirmationState.confirmText || "Yes, Proceed"}
        cancelText={confirmationState.cancelText || "Cancel"}
        confirmButtonColor={confirmationState.confirmButtonColor || "red"}
        theme={theme}
      />
    </div>
  );
};

export default AdminRegistrationRequests;