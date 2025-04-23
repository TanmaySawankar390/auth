import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Shield, 
  Users, 
  Database, 
  ChevronRight, 
  Key, 
  Lock, 
  UserCheck,
  ArrowRight
} from 'lucide-react';

export default function LandingPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <Shield className="h-8 w-8 text-indigo-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">CertificateAuth</span>
              </Link>
            </div>
            <div className="flex items-center">
              {isAuthenticated ? (
                <Link 
                  to="/dashboard" 
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
                >
                  Dashboard
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors duration-200"
                  >
                    Sign In
                  </Link>
                  <Link 
                    to="/register" 
                    className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-indigo-600 to-blue-700 overflow-hidden">
        <div className="absolute inset-0">
          <svg 
            className="absolute bottom-0 left-0 transform translate-x-80 -translate-y-20 opacity-20" 
            width="400" 
            height="400" 
            fill="none" 
            viewBox="0 0 400 400"
          >
            <circle cx="200" cy="200" r="200" fill="white" />
          </svg>
          <svg 
            className="absolute top-0 right-0 transform translate-x-32 translate-y-12 opacity-20" 
            width="300" 
            height="300" 
            fill="none" 
            viewBox="0 0 300 300"
          >
            <circle cx="150" cy="150" r="150" fill="white" />
          </svg>
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <div className="md:max-w-2xl lg:max-w-3xl">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Certification Authentication System
            </h1>
            <p className="mt-6 text-xl text-indigo-100 max-w-3xl">
              Enjoy Certification Approval with our robust authentication platform featuring
              admin approval workflow and comprehensive security measures.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              {isAuthenticated ? (
                <Link 
                  to="/dashboard" 
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-md text-indigo-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                >
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              ) : (
                <>
                  <Link 
                    to="/register" 
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-md text-indigo-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                  >
                    Start Free Trial
                  </Link>
                  <Link 
                    to="/login" 
                    className="inline-flex items-center justify-center px-6 py-3 border border-white text-base font-medium rounded-md shadow-md text-white hover:bg-indigo-500 transition-colors duration-200"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Security Features</h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Enterprise-Level Protection
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Our comprehensive security measures protect your data and ensure only authorized access
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="relative bg-white p-8 rounded-2xl shadow-lg border border-gray-100 overflow-hidden group hover:border-indigo-100 transition-all duration-300">
              <div className="absolute right-0 top-0 h-20 w-20 bg-indigo-50 rounded-bl-full opacity-70 group-hover:bg-indigo-100 transition-colors duration-300"></div>
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-indigo-100 text-indigo-600 mb-5">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Secure Registration</h3>
                <p className="mt-3 text-gray-600 leading-relaxed">
                  Enhanced security with email verification and Google reCAPTCHA integration to prevent automated attacks
                </p>
                <div className="mt-5 flex items-center text-indigo-600 font-medium">
                  <Key className="h-4 w-4 mr-2" />
                  <span>Multi-factor authentication</span>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="relative bg-white p-8 rounded-2xl shadow-lg border border-gray-100 overflow-hidden group hover:border-indigo-100 transition-all duration-300">
              <div className="absolute right-0 top-0 h-20 w-20 bg-indigo-50 rounded-bl-full opacity-70 group-hover:bg-indigo-100 transition-colors duration-300"></div>
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-indigo-100 text-indigo-600 mb-5">
                  <UserCheck className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Admin Approval</h3>
                <p className="mt-3 text-gray-600 leading-relaxed">
                  Rigorous approval workflow ensures only authorized users gain access to critical systems and data
                </p>
                <div className="mt-5 flex items-center text-indigo-600 font-medium">
                  <Users className="h-4 w-4 mr-2" />
                  <span>Role-based access control</span>
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="relative bg-white p-8 rounded-2xl shadow-lg border border-gray-100 overflow-hidden group hover:border-indigo-100 transition-all duration-300">
              <div className="absolute right-0 top-0 h-20 w-20 bg-indigo-50 rounded-bl-full opacity-70 group-hover:bg-indigo-100 transition-colors duration-300"></div>
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-indigo-100 text-indigo-600 mb-5">
                  <Database className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Secure Data Storage</h3>
                <p className="mt-3 text-gray-600 leading-relaxed">
                  User data securely stored in MongoDB with encrypted credentials and robust session management
                </p>
                <div className="mt-5 flex items-center text-indigo-600 font-medium">
                  <Lock className="h-4 w-4 mr-2" />
                  <span>End-to-end encryption</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-50">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-20 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block text-indigo-600">Create your account today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200"
              >
                Get started
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link
                to="/demo"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 transition-colors duration-200"
              >
                Request Demo
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="mt-8 border-t border-gray-100 pt-8">
            <p className="text-sm text-gray-500 text-center">
              &copy; {new Date().getFullYear()} SecureAuth. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}