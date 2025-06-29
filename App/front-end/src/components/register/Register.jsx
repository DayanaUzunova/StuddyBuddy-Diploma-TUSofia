import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useForm } from "../../hooks/useForm";
import axiosInstance from '../../api/api';
import { useAuth } from '../../context/AuthContext';
import '../../style/register.css'

const initialValues = { username: '', email: '', password: '', confirmPassword: '', role: '' };

export default function Register() {
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { setUser } = useAuth();

  const registerHandler = async ({ username, email, password, confirmPassword, role }) => {
    try {
      if (!username || !email || !password || !confirmPassword || !role) {
        setError('All fields are required!');
        return;
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match!');
        return;
      }

      await axiosInstance.post("http://localhost:3001/api/users/register", {
        username,
        email,
        password,
        role
      });

      console.log("Registration successful", response.data);
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Registration failed!";
      setError(message);
    }
  };


  const { values, changeHandler, submitHandler } = useForm(initialValues, registerHandler);

  return (
    <section className="register-page">
      <div className="register-container">
        <h1 className="register-title">📝 Create an Account</h1>
        <form className="register-form" onSubmit={submitHandler}>
          <label htmlFor="username">👤 Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={values.username}
            onChange={changeHandler}
            placeholder="Enter your username"
            required
          />

          <label htmlFor="email">📧 Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={values.email}
            onChange={changeHandler}
            placeholder="Enter your email"
            required
          />

          <label htmlFor="password">🔑 Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={values.password}
            onChange={changeHandler}
            placeholder="Enter your password"
            required
          />

          <label htmlFor="confirmPassword">🔁 Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={values.confirmPassword}
            onChange={changeHandler}
            placeholder="Confirm your password"
            required
          />

          <label htmlFor="role">🎓 Role</label>
          <select
            id="role"
            name="role"
            value={values.role}
            onChange={changeHandler}
            required
          >
            <option value="">Select Role</option>
            <option value="student">👩‍🎓 Student</option>
            <option value="teacher">👨‍🏫 Teacher</option>
          </select>

          {error && <p className="register-error">{error}</p>}

          <button type="submit" className="primary-btn">🚀 Register</button>

          <p className="register-login-link">
            Already have an account? <a href="/login">🔐 Login here</a>
          </p>
        </form>
      </div>
    </section>
  );

}
