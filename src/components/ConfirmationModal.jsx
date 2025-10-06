import React from 'react';
import { FaExclamationTriangle, FaTimes } from 'react-icons/fa';

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirm Action", 
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmButtonColor = "red", // red, blue, green, yellow
  theme = "light"
}) => {
  if (!isOpen) return null;

  const getConfirmButtonStyles = () => {
    const baseStyles = "px-4 py-2 rounded-lg text-white font-medium transition-colors duration-200";
    switch (confirmButtonColor) {
      case 'red':
        return `${baseStyles} bg-red-600 hover:bg-red-700 focus:ring-red-500`;
      case 'blue':
        return `${baseStyles} bg-blue-600 hover:bg-blue-700 focus:ring-blue-500`;
      case 'green':
        return `${baseStyles} bg-green-600 hover:bg-green-700 focus:ring-green-500`;
      case 'yellow':
        return `${baseStyles} bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500`;
      default:
        return `${baseStyles} bg-red-600 hover:bg-red-700 focus:ring-red-500`;
    }
  };

  const getIconColor = () => {
    switch (confirmButtonColor) {
      case 'red':
        return 'text-red-500';
      case 'blue':
        return 'text-blue-500';
      case 'green':
        return 'text-green-500';
      case 'yellow':
        return 'text-yellow-500';
      default:
        return 'text-red-500';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className={`rounded-xl shadow-xl max-w-md w-full mx-4 ${
          theme === 'dark' 
            ? 'bg-gray-800 border border-gray-700' 
            : 'bg-white border border-gray-200'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`px-6 py-4 border-b ${
          theme === 'dark' ? 'border-gray-600' : 'border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <FaExclamationTriangle className={`text-lg ${getIconColor()}`} />
              </div>
              <h3 className={`text-lg font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {title}
              </h3>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                theme === 'dark' 
                  ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                  : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
              }`}
            >
              <FaTimes className="text-sm" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          <p className={`text-sm leading-relaxed ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className={`px-6 py-4 border-t flex items-center justify-end space-x-3 ${
          theme === 'dark' ? 'border-gray-600' : 'border-gray-200'
        }`}>
          <button
            onClick={onClose}
            className={`px-4 py-2 border rounded-lg font-medium transition-colors duration-200 ${
              theme === 'dark'
                ? 'border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`${getConfirmButtonStyles()} focus:outline-none focus:ring-2 focus:ring-offset-2`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;