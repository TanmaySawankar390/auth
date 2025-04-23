import React from 'react';
import LoginForm from '../components/auth/LoginForm';

const LoginPage = () => {
  return (
    <div className="row justify-content-center">
      <div className="col-md-6 form-container">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;