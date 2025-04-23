import React from 'react';
import RegisterForm from '../components/auth/RegisterForm';

const RegisterPage = () => {
  return (
    <div className="row justify-content-center">
      <div className="col-md-8 form-container">
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;