import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaBars,
  FaUser,
  FaLock,
  FaBell,
  FaCog,
  FaDatabase,
  FaShieldAlt,
  FaEnvelope,
  FaGlobe,
  FaPalette,
  FaHistory,
  FaDownload,
  FaUpload
} from 'react-icons/fa';
import { useTheme } from '../../hooks/useTheme.js';
import SidebarAdmin from '../../components/SidebarAdmin.jsx';

const AdminSettings = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [userData, setUserData] = useState(null);

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
  }, [navigate]);

  const settingsSections = [
    {
      title: 'Account Settings',
      icon: <FaUser />,
      items: [
        { label: 'Profile Information', description: 'Update your profile details and contact information', link: '#' },
        { label: 'Change Password', description: 'Update your account password and security settings', link: '#' },
        { label: 'Two-Factor Authentication', description: 'Enable or disable 2FA for enhanced security', link: '#' }
      ]
    },
    {
      title: 'System Configuration',
      icon: <FaCog />,
      items: [
        { label: 'General Settings', description: 'Configure basic system settings and preferences', link: '#' },
        { label: 'Library Information', description: 'Update library name, address, and contact details', link: '#' },
        { label: 'Operating Hours', description: 'Set library opening hours and holidays', link: '#' }
      ]
    },
    {
      title: 'User Management',
      icon: <FaShieldAlt />,
      items: [
        { label: 'User Roles & Permissions', description: 'Manage user roles and access permissions', link: '#' },
        { label: 'Registration Settings', description: 'Configure user registration and approval process', link: '#' },
        { label: 'Account Policies', description: 'Set password policies and account restrictions', link: '#' }
      ]
    },
    {
      title: 'Notifications',
      icon: <FaBell />,
      items: [
        { label: 'Email Notifications', description: 'Configure email notification settings', link: '#' },
        { label: 'System Alerts', description: 'Manage system alerts and warnings', link: '#' },
        { label: 'Reminder Settings', description: 'Set up book return reminders and overdue notices', link: '#' }
      ]
    },
    {
      title: 'Database & Backup',
      icon: <FaDatabase />,
      items: [
        { label: 'Database Settings', description: 'Configure database connection and settings', link: '#' },
        { label: 'Backup & Restore', description: 'Manage system backups and data restoration', link: '#' },
        { label: 'Data Export', description: 'Export library data and generate reports', link: '#' }
      ]
    },
    {
      title: 'Appearance',
      icon: <FaPalette />,
      items: [
        { label: 'Theme Settings', description: 'Customize the application theme and colors', link: '#' },
        { label: 'Logo & Branding', description: 'Upload library logo and customize branding', link: '#' },
        { label: 'Layout Configuration', description: 'Adjust layout and display preferences', link: '#' }
      ]
    },
    {
      title: 'Integration',
      icon: <FaGlobe />,
      items: [
        { label: 'API Settings', description: 'Configure API keys and external integrations', link: '#' },
        { label: 'Third-party Services', description: 'Manage connections to external services', link: '#' },
        { label: 'Import/Export', description: 'Configure data import and export settings', link: '#' }
      ]
    },
    {
      title: 'System Logs',
      icon: <FaHistory />,
      items: [
        { label: 'Activity Logs', description: 'View system activity and user actions', link: '#' },
        { label: 'Error Logs', description: 'Monitor system errors and issues', link: '#' },
        { label: 'Audit Trail', description: 'Track changes and administrative actions', link: '#' }
      ]
    }
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
        activeMenu="settings"
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
                Settings
              </h1>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {settingsSections.map((section, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                  {/* Section Header */}
                  <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                        {section.icon}
                      </div>
                      <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {section.title}
                      </h3>
                    </div>
                  </div>

                  {/* Section Items */}
                  <div className="p-6 space-y-4">
                    {section.items.map((item, itemIndex) => (
                      <a
                        key={itemIndex}
                        href={item.link}
                        className={`block p-4 rounded-lg border transition-colors ${
                          theme === 'dark'
                            ? 'border-gray-600 hover:border-gray-500 hover:bg-gray-700'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                              {item.label}
                            </h4>
                            <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                              {item.description}
                            </p>
                          </div>
                          <div className={`ml-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
                <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Quick Actions
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <button className="flex items-center justify-center p-4 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 rounded-lg transition-colors">
                    <FaDownload className="text-blue-600 dark:text-blue-400 mr-2" />
                    <span className={`text-sm font-medium ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                      Export Data
                    </span>
                  </button>
                  <button className="flex items-center justify-center p-4 bg-green-50 hover:bg-green-100 dark:bg-green-900/30 dark:hover:bg-green-900/50 rounded-lg transition-colors">
                    <FaUpload className="text-green-600 dark:text-green-400 mr-2" />
                    <span className={`text-sm font-medium ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                      Import Data
                    </span>
                  </button>
                  <button className="flex items-center justify-center p-4 bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/30 dark:hover:bg-purple-900/50 rounded-lg transition-colors">
                    <FaDatabase className="text-purple-600 dark:text-purple-400 mr-2" />
                    <span className={`text-sm font-medium ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>
                      Backup Now
                    </span>
                  </button>
                  <button className="flex items-center justify-center p-4 bg-orange-50 hover:bg-orange-100 dark:bg-orange-900/30 dark:hover:bg-orange-900/50 rounded-lg transition-colors">
                    <FaHistory className="text-orange-600 dark:text-orange-400 mr-2" />
                    <span className={`text-sm font-medium ${theme === 'dark' ? 'text-orange-400' : 'text-orange-600'}`}>
                      View Logs
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;