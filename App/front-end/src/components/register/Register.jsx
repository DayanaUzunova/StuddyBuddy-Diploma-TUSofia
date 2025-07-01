import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useForm } from "../../hooks/useForm";
import axiosInstance from '../../api/api';
import { useAuth } from '../../context/AuthContext';
import '../../style/register.css';
import { useSelector } from 'react-redux';
import { lang } from '../../lang/lang';

const initialValues = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: ''
};

export default function Register() {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const language = useSelector(state => state.general.language);

  const registerHandler = async ({ username, email, password, confirmPassword, role }) => {
    try {
      if (!username || !email || !password || !confirmPassword || !role) {
        setError(lang(language, 'error_fill_fields'));
        return;
      }

      if (password !== confirmPassword) {
        setError(lang(language, 'error_password_mismatch'));
        return;
      }

      const response = await axiosInstance.post("http://localhost:3001/api/users/register", {
        username,
        email,
        password,
        role
      });

      console.log("Registration successful", response.data);
      navigate('/login');
    } catch (err) {
      const message = err.response?.data?.message || err.message || lang(language, 'register_failed');
      setError(message);
    }
  };

  const { values, changeHandler, submitHandler } = useForm(initialValues, registerHandler);

  return (
    <section className="register-page">
      <div className="register-container">
        <h1 className="register-title">{lang(language, 'register_title')}</h1>
        <form className="register-form" onSubmit={submitHandler}>
          <label htmlFor="username">{lang(language, 'username_title')}</label>
          <input
            type="text"
            id="username"
            name="username"
            value={values.username}
            onChange={changeHandler}
            placeholder={lang(language, 'enter_username')}
            required
          />

          <label htmlFor="email">{lang(language, 'email_title')}</label>
          <input
            type="email"
            id="email"
            name="email"
            value={values.email}
            onChange={changeHandler}
            placeholder={lang(language, 'enter_email')}
            required
          />

          <label htmlFor="password">{lang(language, 'password_title')}</label>
          <input
            type="password"
            id="password"
            name="password"
            value={values.password}
            onChange={changeHandler}
            placeholder={lang(language, 'enter_password')}
            required
          />

          <label htmlFor="confirmPassword">{lang(language, 'confirm_password_title')}</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={values.confirmPassword}
            onChange={changeHandler}
            placeholder={lang(language, 'confirm_password_placeholder')}
            required
          />

          <label htmlFor="role">{lang(language, 'role_title')}</label>
          <select
            id="role"
            name="role"
            value={values.role}
            onChange={changeHandler}
            required
          >
            <option value="">{lang(language, 'select_role')}</option>
            <option value="student">{lang(language, 'role_student')}</option>
            <option value="teacher">{lang(language, 'role_teacher')}</option>
          </select>

          {error && <p className="register-error">{error}</p>}

          <button type="submit" className="primary-btn">{lang(language, 'register_button')}</button>

          <p className="register-login-link">
            {lang(language, 'already_have_account')}{' '}
            <a href="/login">{lang(language, 'login_here')}</a>
          </p>
        </form>
      </div>
    </section>
  );
}
