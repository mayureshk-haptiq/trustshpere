// src/pages/Login.js
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const { login } = useContext(AuthContext);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (formData) => {
    try {
      const { email, password } = formData;
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });
      login(res.data.token);
      navigate('/'); // Redirect to the dashboard page after successful login
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  return (
    <div className='container-md auth'>
      <div className="auth-container row col-6 align-items-center">
        <h1 className='mb-4 text-center'>Login</h1>
        <hr />
        {error && <p className="alert alert-danger">{error}</p>}

        <AuthForm onSubmit={handleLogin} buttonText="Login" type="login" />
      </div>
    </div>
  );
};

export default Login;
