import axios from 'axios';

// Create api instance with base URL
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response);
    // Handle 401 Unauthorized errors (token expired, etc.)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      // Optionally redirect to login page
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Admin API functions
export const fetchPendingUsers = async () => {
  try {
    const response = await api.get('/admin/pending-approvals');
    return response.data;
  } catch (error) {
    console.error('Error fetching pending users:', error.message);
    if (error.response && error.response.data && error.response.data.msg) {
      throw new Error(error.response.data.msg);
    }
    throw error;
  }
};

export const approveUser = async (userId) => {
  try {
    const response = await api.put(`/admin/approve/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error approving user:', error.message);
    if (error.response && error.response.data && error.response.data.msg) {
      throw new Error(error.response.data.msg);
    }
    throw error;
  }
};

export const rejectUser = async (userId) => {
  try {
    const response = await api.delete(`/admin/reject/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error rejecting user:', error.message);
    if (error.response && error.response.data && error.response.data.msg) {
      throw new Error(error.response.data.msg);
    }
    throw error;
  }
};

// User API functions
export const fetchUserProfile = async () => {
  try {
    const response = await api.get('/users/me');
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error.message);
    if (error.response && error.response.data && error.response.data.msg) {
      throw new Error(error.response.data.msg);
    }
    throw error;
  }
};

export default api;
