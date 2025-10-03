import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaBook, 
  FaUsers, 
  FaChartBar, 
  FaBookOpen,
  FaClock,
  FaBars,
  FaTimes,
  FaHome,
  FaBookmark,
  FaSignOutAlt,
  FaCog,
  FaPlus,
  FaList,
  FaUserCheck,
  FaArrowRight,
  FaUser,
  FaCalendar,
  FaExclamationTriangle
} from 'react-icons/fa';
import { useTheme } from '../../hooks/useTheme.js';
import { dashboardAPI } from '../../api/index.js';
import SidebarAdmin from '../../components/SidebarAdmin.jsx';

const AdminHome = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [userData, setUserData] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

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
    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await dashboardAPI.getAdminDashboard();
      if (response.success) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
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
        activeMenu="dashboard"
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
                Library Administration
              </h1>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          {/* Welcome Section */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 mb-8 text-white shadow-lg">
            <h1 className="text-2xl font-semibold mb-2">Library Administration</h1>
            <p className="text-gray-300">Monitor and manage library activities.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {dashboardData?.stats?.map((stat, index) => {
              const getIcon = (iconName) => {
                switch(iconName) {
                  case 'FaBook':
                    return <FaBook className="text-blue-600" />;
                  case 'FaBookOpen':
                    return <FaBookOpen className="text-green-600" />;
                  case 'FaClock':
                    return <FaClock className="text-yellow-600" />;
                  default:
                    return <FaBook className="text-blue-600" />;
                }
              };
              
              return (
                <div key={index} className={`rounded-xl shadow-sm p-6 border transition-all hover:shadow-md ${
                  theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
                }`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                      {stat.label}
                    </h3>
                    <div className={`p-3 rounded-xl ${
                      theme === 'dark' ? 'bg-gray-700' : 'bg-blue-50'
                    }`}>
                      {getIcon(stat.icon)}
                    </div>
                  </div>
                  <p className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {stat.number}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      {stat.description}
                    </p>
                    <a href={stat.link} className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                      {stat.linkText} <FaArrowRight className="text-xs" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recent Activities */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className={`rounded-xl shadow-sm border overflow-hidden ${
              theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
            }`}>
              <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                    Recent Activities
                  </h2>
                  <a href="#" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                    View all <FaArrowRight className="text-xs" />
                  </a>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {dashboardData?.recentActivities?.length > 0 ? (
                    dashboardData.recentActivities.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg ${
                          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                        }`}>
                          <FaUser className={`text-sm ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>
                            {activity.user}
                          </p>
                          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            {activity.book}
                          </p>
                          <div className="mt-1 flex items-center space-x-2">
                            <span className={`inline-flex px-2 py-1 text-xs rounded-full font-medium ${
                              activity.status === 'pending' ? 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                              activity.status === 'borrowed' ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                              activity.status === 'returned' ? 'bg-gray-50 text-gray-700 dark:bg-gray-700 dark:text-gray-300' :
                              'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            }`}>
                              {activity.status}
                            </span>
                            <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                              {activity.date}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className={`text-center py-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      <FaBookOpen className="mx-auto text-4xl mb-2 opacity-50" />
                      <p>No recent activities</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className={`rounded-xl shadow-sm border p-6 ${
              theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
            }`}>
              <h2 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                System Overview
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-red-50 dark:bg-red-900/20">
                  <div className="flex items-center space-x-2">
                    <FaExclamationTriangle className="text-red-500" />
                    <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      Overdue Books
                    </span>
                  </div>
                  <span className="text-sm font-bold text-red-600">
                    {dashboardData?.systemOverview?.overdueBooksCount || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                  <div className="flex items-center space-x-2">
                    <FaClock className="text-yellow-500" />
                    <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      Due Today
                    </span>
                  </div>
                  <span className="text-sm font-bold text-yellow-600">
                    {dashboardData?.systemOverview?.dueTodayCount || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                  <div className="flex items-center space-x-2">
                    <FaUsers className="text-green-500" />
                    <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      New Users This Week
                    </span>
                  </div>
                  <span className="text-sm font-bold text-green-600">
                    {dashboardData?.systemOverview?.newUsersThisWeekCount || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminHome;
