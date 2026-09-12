import React from 'react';
import { useNavigate } from 'react-router-dom';
import AuthModal from '../components/AuthModal';

const Login = () => {
  const navigate = useNavigate();

  return (
    <AuthModal
      isOpen
      mode="login"
      onClose={() => navigate('/')}
    />
  );
};

export default Login;