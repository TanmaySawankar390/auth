import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Users, Database, ChevronRight, Key, Lock, UserCheck } from 'lucide-react';

export default function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="pt-16 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-700">
              Secure Authentication System
            </span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600">
            Enterprise-grade user authentication with robust admin approval workflow
          </p>
          
          <div className="mt-10">
            {isAuthenticated ? (
              <Link to="/dashboard" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 shadow-md transition-colors duration-200">
                Go to Dashboard
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            ) : (
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/login" className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 shadow-md transition-colors duration-200">
                  Sign In
                </Link>
                <Link to="/register" className="inline-flex items-center justify-center px-8 py-3 border border-gray-300 text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-gray-50 shadow-md transition-colors duration-200">
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Enterprise-Level Security Features
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Our platform provides comprehensive security measures to protect your data
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-md bg-indigo-600 text-white mb-4">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Secure Registration</h3>
              <p className="mt-2 text-gray-600">
                Enhanced security with email verification and Google reCAPTCHA integration to prevent automated attacks
              </p>
              <div className="mt-4 flex items-center text-indigo-600 font-medium">
                <Key className="h-4 w-4 mr-1" />
                <span>Multi-factor authentication</span>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-md bg-indigo-600 text-white mb-4">
                <UserCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Admin Approval</h3>
              <p className="mt-2 text-gray-600">
                Rigorous approval workflow ensures only authorized users gain access to the system
              </p>
              <div className="mt-4 flex items-center text-indigo-600 font-medium">
                <Users className="h-4 w-4 mr-1" />
                <span>Role-based access control</span>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-md bg-indigo-600 text-white mb-4">
                <Database className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">MongoDB Integration</h3>
              <p className="mt-2 text-gray-600">
                User data securely stored in MongoDB with encrypted credentials and session management
              </p>
              <div className="mt-4 flex items-center text-indigo-600 font-medium">
                <Lock className="h-4 w-4 mr-1" />
                <span>End-to-end encryption</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Access Link */}
      <div className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Link to="/admin/login" className="inline-flex items-center text-gray-500 hover:text-indigo-600 text-sm font-medium transition-colors duration-200">
            Administrator Access
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}