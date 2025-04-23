import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchUserProfile } from '../utils/api';
import Alert from '../components/Layout/Alert';

const DashboardPage = () => {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const userData = await fetchUserProfile();
        setUser(userData);
      } catch (err) {
        setError('Failed to load user profile');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getUserProfile();
  }, []);

  if (loading) {
    return <div className="text-center">Loading dashboard...</div>;
  }

  return (
    <div className="row justify-content-center">
      <div className="col-lg-8">
        {error && <Alert type="danger" message={error} onClose={() => setError('')} />}
        
        <div className="card">
          <div className="card-body dashboard-card">
            <div className="dashboard-welcome">
              <h2>Welcome, {authUser?.name || 'User'}!</h2>
              <p className="text-muted">
                Your account has been approved and is now active.
              </p>
            </div>
            
            <div className="dashboard-info">
              <h4>Your Profile Information</h4>
              
              <div className="card">
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">
                    <strong>Name:</strong> {user?.name}
                  </li>
                  <li className="list-group-item">
                    <strong>Email:</strong> {user?.email}
                  </li>
                  <li className="list-group-item">
                    <strong>Location:</strong> {user?.city}, {user?.state}
                  </li>
                  <li className="list-group-item">
                    <strong>Account Status:</strong>{' '}
                    <span className="badge bg-success">Approved</span>
                  </li>
                  <li className="list-group-item">
                    <strong>Registration Date:</strong>{' '}
                    {user?.createdAt && new Date(user.createdAt).toLocaleDateString()}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;