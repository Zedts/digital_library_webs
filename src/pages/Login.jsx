import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaEye, FaEyeSlash, FaArrowLeft, FaUserPlus } from 'react-icons/fa';
import { authAPI } from '../api';

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      const parsedUser = JSON.parse(user);
      // Redirect based on role
      if (parsedUser.role === 'admin') {
        navigate('/admin/home');
      } else if (parsedUser.role === 'users') {
        navigate('/user/home');
      }
    }
  }, [navigate]);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await authAPI.login(formData.email, formData.password);

      if (response.success) {
        // Store token and user data
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));

        // Redirect based on user role
        if (response.data.role === 'admin') {
          navigate('/admin/home');
        } else if (response.data.role === 'users') {
          navigate('/user/home');
        } else {
          navigate('/');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Login gagal. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 relative">
      {/* Fixed Back Button - Top Left */}
      <div className="fixed top-4 left-4 z-50">
        <Link 
          to="/" 
          className="group inline-flex items-center gap-3 px-4 py-2.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-200 dark:hover:border-blue-700 hover:bg-blue-50/90 dark:hover:bg-blue-900/30 transition-all duration-300 no-underline shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <FaArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
          <span className="font-medium">Kembali ke Beranda</span>
        </Link>
      </div>
      
      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen py-12 px-4">
        <div className="max-w-md w-full animate-fade-in">
          {/* Header */}
          <div className="text-center mb-8 pt-16">
            <div className="text-4xl mb-4">📖</div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Masuk ke Akun Anda
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Akses koleksi digital perpustakaan terlengkap
            </p>
          </div>

        {/* Login Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type="text"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-300"
                  placeholder="Masukkan email"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-300"
                  placeholder="Masukkan password"
                  required
                />
                <button
                  type="button"
                  onClick={togglePassword}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-300"
                >
                  {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="text-left">
              <a href="#" className="text-sm text-blue-500 hover:text-blue-600 transition-colors duration-300 no-underline">
                Lupa password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-6 rounded-lg font-semibold focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 transition-all duration-300 ${
                isLoading 
                  ? 'bg-blue-400 cursor-not-allowed text-white' 
                  : 'bg-blue-500 text-white hover:bg-blue-600 hover:transform hover:-translate-y-px'
              }`}
            >
              {isLoading ? 'Memproses...' : 'Masuk'}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Belum punya akun?
              </p>
              <Link 
                to="/register" 
                className="group inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700 rounded-xl text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-gradient-to-r hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30 font-semibold transition-all duration-300 no-underline shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
              >
                <FaUserPlus className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                <span>Daftar sekarang</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            Dengan masuk, Anda menyetujui{' '}
            <a href="#" className="text-blue-500 hover:text-blue-600 transition-colors duration-300 no-underline">
              Syarat & Ketentuan
            </a>{' '}
            dan{' '}
            <a href="#" className="text-blue-500 hover:text-blue-600 transition-colors duration-300 no-underline">
              Kebijakan Privasi
            </a>
          </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
