import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useForm } from '../../hooks/useForm';
import { useAuth } from '../../context/AuthContext.jsx';
import axiosInstance from '../../api/api.jsx';
import '../../style/login.css';

const initialValues = { email: '', password: '' };

export default function Login() {
  const [error, setError] = useState('');

  const { setToken } = useAuth();
  const navigate = useNavigate();

  const loginHandler = async ({ email, password }) => {
    if (!email || !password) {
      setError('Both email and password are required!');
      return;
    }

    try {
      const response = await axiosInstance.post('http://localhost:3001/api/users/login', { email, password });

      if (!response?.data) {
        throw new Error('Invalid response from login!');
      }

      const jwt = response?.data?.token;
      setToken(jwt);

      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed!');
    }
  };

  const { values, changeHandler, submitHandler } = useForm(
    initialValues,
    loginHandler
  );

  return (
    <section id="login-page" className="auth-page">
      <form id="login" className="auth-form" onSubmit={submitHandler}>
        <div className="auth-container">
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Log in to continue your learning journey</p>

          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={values.email}
            onChange={changeHandler}
            placeholder="Enter your email"
            required
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={values.password}
            onChange={changeHandler}
            placeholder="Enter your password"
            required
          />

          {error && <p className="auth-error">{error}</p>}

          <input type="submit" className="btn submit" value="Login" />

          <p className="auth-switch">
            Don’t have an account? <a href="/register">Register here</a>
          </p>
        </div>
      </form>
    </section>
  );
}
