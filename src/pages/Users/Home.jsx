import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaBook, 
  FaBookOpen, 
  FaClock, 
  FaStar,
  FaBars,
  FaArrowRight
} from 'react-icons/fa';
import { useTheme } from '../../hooks/useTheme.js';
import { dashboardAPI } from '../../api/index.js';
import SidebarUser from '../../components/SidebarUser.jsx';

const UserHome = () => {
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
    // Check if user is authenticated and has user role
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (!token || !user) {
      navigate('/login');
      return;
    }

    const parsedUser = JSON.parse(user);
    if (parsedUser.role !== 'users') {
      navigate('/login');
      return;
    }

    setUserData(parsedUser);
    fetchDashboardData(parsedUser.users_id);
  }, [navigate]);

  const fetchDashboardData = async (userId) => {
    try {
      setLoading(true);
      const response = await dashboardAPI.getUserDashboard(userId);
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
      <SidebarUser 
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
                Welcome back, {userData?.name}!
              </h1>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          {/* Welcome Section */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 mb-8 text-white shadow-lg">
            <h1 className="text-2xl font-semibold mb-2">Welcome back, {userData?.name}!</h1>
            <p className="text-blue-100">Manage your library activities and discover new books.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {dashboardData?.stats?.map((stat, index) => {
              const getIcon = (iconName) => {
                switch(iconName) {
                  case 'FaBookOpen':
                    return <FaBookOpen className="text-blue-600" />;
                  case 'FaClock':
                    return <FaClock className="text-yellow-600" />;
                  default:
                    return <FaBookOpen className="text-blue-600" />;
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

          {/* Recent Activity */}
          <div className={`rounded-xl shadow-sm border overflow-hidden mb-6 ${
            theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
          }`}>
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                  Recent Activity
                </h2>
                <a href="#" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                  View all <FaArrowRight className="text-xs" />
                </a>
              </div>
            </div>

            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {dashboardData?.myBorrows?.length > 0 ? (
                dashboardData.myBorrows.map((borrow, index) => (
                  <div key={index} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <div className="flex items-start">
                      <div className={`p-2 rounded-lg mr-4 ${
                        theme === 'dark' ? 'bg-gray-700' : 'bg-blue-50'
                      }`}>
                        <FaBook className={`text-xl ${
                          theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h4 className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {borrow.title}
                        </h4>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          by {borrow.author}
                        </p>
                        <div className="mt-1 flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            borrow.status === 'pending' ? 'bg-yellow-50 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                            borrow.status === 'borrowed' ? 'bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                            'bg-gray-50 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                          }`}>
                            {borrow.status}
                          </span>
                          <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                            {borrow.borrowDate}
                          </span>
                        </div>
                      </div>
                      {borrow.status === 'borrowed' && borrow.dueDate && (
                        <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          Due: {borrow.dueDate}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className={`p-6 text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  <FaBookOpen className="mx-auto text-4xl mb-2 opacity-50" />
                  <p>No recent borrows</p>
                </div>
              )}
            </div>
          </div>

          {/* Recommendations */}
          <div className={`rounded-xl shadow-sm border p-6 ${
            theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
          }`}>
            <h2 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              Recommended for You
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {dashboardData?.recommendations?.length > 0 ? (
                dashboardData.recommendations.map((book, index) => (
                  <div key={index} className={`p-4 rounded-lg border transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 ${
                    theme === 'dark' ? 'border-gray-600' : 'border-gray-200'
                  }`}>
                    <h3 className={`font-semibold mb-1 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {book.title}
                    </h3>
                    <p className={`text-sm mb-2 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      by {book.author}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <FaStar className="text-yellow-500 text-xs" />
                        <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          {book.rating}
                        </span>
                      </div>
                      <button className="text-blue-500 hover:text-blue-600 text-sm font-medium">
                        View Details
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className={`text-center py-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  <FaBook className="mx-auto text-4xl mb-2 opacity-50" />
                  <p>No recommendations available</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserHome;
