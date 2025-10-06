import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaBook, 
  FaHome,
  FaBookOpen,
  FaBookmark,
  FaHistory,
  FaSignOutAlt,
  FaUser,
  FaCog,
  FaArrowRight
} from 'react-icons/fa';
import { useTheme } from '../hooks/useTheme.js';

const SidebarUser = ({ 
  isSidebarOpen, 
  setIsSidebarOpen, 
  isSidebarCollapsed, 
  setIsSidebarCollapsed, 
  userData,
  activeMenu = 'dashboard' 
}) => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const menuItems = [
    { icon: <FaHome />, label: 'Dashboard', key: 'dashboard', link: '#' },
    { icon: <FaBook />, label: 'Browse Books', key: 'browse', link: '#' },
    { icon: <FaBookOpen />, label: 'My Borrows', key: 'borrows', link: '#' },
    { icon: <FaBookmark />, label: 'Bookmarks', key: 'bookmarks', link: '#' },
    { icon: <FaHistory />, label: 'History', key: 'history', link: '#' },
    { icon: <FaCog />, label: 'Settings', key: 'settings', link: '#' }
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isSidebarOpen && window.innerWidth < 1024 && (
        <div 
          className="fixed inset-0 bg-gray-900/50 z-20 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 transform lg:translate-x-0 lg:relative transition-all duration-300 ease-in-out flex flex-col shadow-xl lg:shadow-none ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } ${
        isSidebarCollapsed && isSidebarOpen ? 'w-16' : 'w-64'
      } ${
        theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } border-r`}>
        
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className={`flex items-center space-x-3 ${isSidebarCollapsed ? 'hidden' : ''}`}>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                <FaBook className="text-xl text-white" />
              </div>
              <div>
                <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>My Library</h2>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Digital Collection</p>
              </div>
            </div>
            <button 
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className={`hidden lg:flex p-2 rounded-lg transition-colors ${
                theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
            >
              <FaArrowRight className={`text-gray-400 text-sm transition-transform ${
                isSidebarCollapsed ? '' : 'rotate-180'
              }`} />
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-6 py-6 space-y-2">
          {menuItems.map((item, index) => (
            <a
              key={index}
              href={item.link}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors group ${
                item.key === activeMenu
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                  : theme === 'dark'
                    ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {!isSidebarCollapsed && <span className="font-medium">{item.label}</span>}
            </a>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <div className={`flex items-center space-x-3 ${isSidebarCollapsed ? 'justify-center' : ''}`}>
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <FaUser className="text-white text-sm" />
            </div>
            {!isSidebarCollapsed && (
              <div className="flex-1">
                <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {userData?.name}
                </p>
                <p className="text-xs text-blue-500">Member</p>
              </div>
            )}
            {!isSidebarCollapsed && (
              <button
                onClick={handleLogout}
                className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
              >
                <FaSignOutAlt className="text-sm" />
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SidebarUser;