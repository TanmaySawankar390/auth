import React, { useState, useEffect } from 'react';
import { fetchPendingUsers, approveUser, rejectUser } from '../utils/api';
import Alert from '../components/Layout/Alert';

const AdminDashboardPage = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('info');
  
  // Fetch pending users on component mount
  useEffect(() => {
    loadPendingUsers();
  }, []);

  const loadPendingUsers = async () => {
    try {
      setLoading(true);
      console.log('Fetching pending users...');
      const data = await fetchPendingUsers();
      console.log('Pending users data:', data);
      setPendingUsers(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching pending users:', err);
      setError('Failed to load pending approval requests');
      setAlertMessage('Failed to load pending approval requests. Please try again.');
      setAlertType('danger');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    try {
      await approveUser(userId);
      setAlertMessage('User approved successfully');
      setAlertType('success');
      // Refresh the list of pending users
      loadPendingUsers();
    } catch (err) {
      console.error('Error approving user:', err);
      setAlertMessage('Failed to approve user. Please try again.');
      setAlertType('danger');
    }
  };

  const handleReject = async (userId) => {
    try {
      await rejectUser(userId);
      setAlertMessage('User rejected successfully');
      setAlertType('warning');
      // Refresh the list of pending users
      loadPendingUsers();
    } catch (err) {
      console.error('Error rejecting user:', err);
      setAlertMessage('Failed to reject user. Please try again.');
      setAlertType('danger');
    }
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading pending approval requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Admin Dashboard</h2>
      
      {alertMessage && (
        <Alert 
          type={alertType} 
          message={alertMessage} 
          onClose={() => setAlertMessage('')} 
        />
      )}
      
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Pending Approval Requests</h5>
          <button 
            className="btn btn-outline-primary btn-sm" 
            onClick={loadPendingUsers}
          >
            Refresh
          </button>
        </div>
        <div className="card-body">
          {error ? (
            <div className="alert alert-danger">{error}</div>
          ) : pendingUsers.length === 0 ? (
            <p className="text-center mb-0">No pending approval requests</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>State</th>
                    <th>City</th>
                    <th>Registered</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingUsers.map((user) => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.state}</td>
                      <td>{user.city}</td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button
                          className="btn btn-success btn-sm me-2"
                          onClick={() => handleApprove(user._id)}
                        >
                          Approve
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleReject(user._id)}
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;