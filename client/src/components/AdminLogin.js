import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Shield, LogIn, ChevronLeft, AlertCircle } from 'lucide-react';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const { email, password } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/admin/login', {
        email,
        password
      });

      localStorage.setItem('adminToken', res.data.token);
      localStorage.setItem('admin', JSON.stringify(res.data.admin));
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      setIsLoading(false);
    }
  };

  const handleFocus = (field) => {
    setFocusedField(field);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  const isFieldActive = (field) => {
    return focusedField === field || (field === 'email' && email) || (field === 'password' && password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-indigo-100">
            <Shield className="h-6 w-6 text-indigo-600" />
          </div>
          <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Administrator Access
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to manage users and system settings
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-lg shadow-sm animate-fadeIn">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white py-8 px-6 shadow rounded-lg border border-gray-100">
          <form className="space-y-6" onSubmit={onSubmit}>
            <div className="space-y-5">
              <div className="relative">
                <label 
                  htmlFor="email" 
                  className={`absolute left-3 transition-all duration-300 ${
                    isFieldActive('email') 
                      ? 'transform -translate-y-6 scale-75 text-indigo-600 z-10 px-1 bg-white' 
                      : 'top-3 text-gray-500'
                  }`}
                >
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={onChange}
                  onFocus={() => handleFocus('email')}
                  onBlur={handleBlur}
                  className={`appearance-none relative block w-full px-3 pt-3 pb-2 border ${
                    isFieldActive('email') ? 'border-indigo-500' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 sm:text-sm`}
                />
              </div>
              
              <div className="relative">
                <label 
                  htmlFor="password" 
                  className={`absolute left-3 transition-all duration-300 ${
                    isFieldActive('password') 
                      ? 'transform -translate-y-6 scale-75 text-indigo-600 z-10 px-1 bg-white' 
                      : 'top-3 text-gray-500'
                  }`}
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={onChange}
                  onFocus={() => handleFocus('password')}
                  onBlur={handleBlur}
                  className={`appearance-none relative block w-full px-3 pt-3 pb-2 border ${
                    isFieldActive('password') ? 'border-indigo-500' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 sm:text-sm`}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Forgot password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors duration-200"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <LogIn className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" />
                </span>
                {isLoading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </div>
                ) : 'Sign in securely'}
              </button>
            </div>
          </form>
        </div>

        <div className="text-center mt-4">
          <Link to="/" className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to main site
          </Link>
          <div className="mt-2">
            <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-indigo-500 transition-colors duration-200">
              Not an admin? Go to User Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;