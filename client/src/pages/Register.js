// src/pages/Register.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";

const Register = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (formData) => {
    try {
      const { firstname, lastname, username, email, password } = formData;
      await axios.post("http://localhost:5000/api/auth/register", {
        firstname,
        lastname,
        username,
        email,
        password,
      });
      navigate("/login");
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  return (
    <div className="container-md auth">
      <div className="auth-container row col-6 align-items-center">
        <h2>Register</h2>
        {error && <p className="alert alert-danger">{error}</p>}
        <AuthForm
          onSubmit={handleRegister}
          buttonText="Register"
          type="register"
        />
      </div>
    </div>
  );
};

export default Register;
