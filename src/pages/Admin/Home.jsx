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
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
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
                    Activity Trends (Last 7 Days)
                  </h2>
                </div>
              </div>
              <div className="p-6">
                {dashboardData?.activityTrends?.length > 0 ? (
                  <div>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={dashboardData.activityTrends}>
                        <CartesianGrid 
                          strokeDasharray="3 3" 
                          stroke={theme === 'dark' ? '#374151' : '#E5E7EB'} 
                          opacity={0.3}
                        />
                        <XAxis 
                          dataKey="date" 
                          axisLine={false}
                          tickLine={false}
                          tick={{ 
                            fill: theme === 'dark' ? '#9CA3AF' : '#6B7280', 
                            fontSize: 12 
                          }}
                        />
                        <YAxis 
                          axisLine={false}
                          tickLine={false}
                          tick={{ 
                            fill: theme === 'dark' ? '#9CA3AF' : '#6B7280', 
                            fontSize: 12 
                          }}
                        />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
                            border: `1px solid ${theme === 'dark' ? '#374151' : '#E5E7EB'}`,
                            borderRadius: '8px',
                            color: theme === 'dark' ? '#F3F4F6' : '#111827',
                            fontSize: '12px'
                          }}
                        />
                        <Legend 
                          wrapperStyle={{
                            color: theme === 'dark' ? '#F3F4F6' : '#111827',
                            fontSize: '12px'
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="requests" 
                          stroke="#3B82F6" 
                          strokeWidth={2}
                          dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                          name="Requests"
                          opacity={0.8}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="borrows" 
                          stroke="#10B981" 
                          strokeWidth={2}
                          dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                          name="Borrows"
                          opacity={0.8}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="returns" 
                          stroke="#8B5CF6" 
                          strokeWidth={2}
                          dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                          name="Returns"
                          opacity={0.8}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                    <div className="mt-3 flex flex-wrap justify-center gap-4 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500 opacity-80"></div>
                        <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>Borrows</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500 opacity-80"></div>
                        <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>Requests</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-purple-500 opacity-80"></div>
                        <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>Returns</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className={`text-center py-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    <FaChartBar className="mx-auto text-4xl mb-2 opacity-50" />
                    <p>No activity data available</p>
                  </div>
                )}
              </div>
            </div>

            {/* System Overview */}
            <div className={`rounded-xl shadow-sm border overflow-hidden ${
              theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
            }`}>
              <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                <h2 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                  System Overview
                </h2>
              </div>
              <div className="p-6">
                {dashboardData?.systemOverview?.chartData?.length > 0 ? (
                  <div>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={dashboardData.systemOverview.chartData}>
                        <CartesianGrid 
                          strokeDasharray="3 3" 
                          stroke={theme === 'dark' ? '#374151' : '#E5E7EB'} 
                          opacity={0.3}
                        />
                        <XAxis 
                          dataKey="status" 
                          axisLine={false}
                          tickLine={false}
                          tick={{ 
                            fill: theme === 'dark' ? '#9CA3AF' : '#6B7280', 
                            fontSize: 12 
                          }}
                        />
                        <YAxis 
                          axisLine={false}
                          tickLine={false}
                          tick={{ 
                            fill: theme === 'dark' ? '#9CA3AF' : '#6B7280', 
                            fontSize: 12 
                          }}
                        />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
                            border: `1px solid ${theme === 'dark' ? '#374151' : '#E5E7EB'}`,
                            borderRadius: '8px',
                            color: theme === 'dark' ? '#F3F4F6' : '#111827',
                            fontSize: '12px'
                          }}
                        />
                        <Bar 
                          dataKey="count" 
                          fill="#3B82F6"
                          opacity={0.8}
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-red-50 dark:bg-red-900/20">
                        <FaExclamationTriangle className="text-red-500 text-sm" />
                        <div>
                          <div className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            Overdue: {dashboardData?.systemOverview?.chartData?.find(item => item.status === 'Overdue')?.count || 0}
                          </div>
                          <div className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                            Books overdue
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                        <FaClock className="text-yellow-500 text-sm" />
                        <div>
                          <div className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            Due Today: {dashboardData?.systemOverview?.chartData?.find(item => item.status === 'Due Today')?.count || 0}
                          </div>
                          <div className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                            Books due today
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-green-50 dark:bg-green-900/20">
                        <FaBookOpen className="text-green-500 text-sm" />
                        <div>
                          <div className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            Active: {dashboardData?.systemOverview?.chartData?.find(item => item.status === 'Active')?.count || 0}
                          </div>
                          <div className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                            Active borrows
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                        <FaUser className="text-blue-500 text-sm" />
                        <div>
                          <div className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            Pending: {dashboardData?.systemOverview?.chartData?.find(item => item.status === 'Pending')?.count || 0}
                          </div>
                          <div className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                            Pending requests
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className={`text-center py-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    <FaChartBar className="mx-auto text-4xl mb-2 opacity-50" />
                    <p>No system overview data available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminHome;
