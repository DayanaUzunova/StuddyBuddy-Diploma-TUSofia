import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useForm } from '../../hooks/useForm';
import { useAuth } from '../../context/AuthContext.jsx';
import axiosInstance from '../../api/api.jsx';
import '../../style/login.css';
import { lang } from '../../lang/lang.js';
import { useSelector } from 'react-redux';

const initialValues = { email: '', password: '' };

export default function Login() {
  const [error, setError] = useState('');
  const language = useSelector(state => state.general.language);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const loginHandler = async ({ email, password }) => {
    try {
      if (!email || !password) {
        setError(lang(language, 'error_fill_fields'));
        return;
      }

      const response = await axiosInstance.post(
        'http://localhost:3001/api/users/login',
        { email, password },
        { withCredentials: true }
      );

      if (!response?.data) {
        throw new Error('Invalid response from login!');
      }

      setUser(response.data);
    } catch (err) {
      setError(err.response?.data?.message || lang(language, 'login_failed'));
    }
  };

  const { values, changeHandler, submitHandler } = useForm(
    initialValues,
    loginHandler,
    true
  );

  return (
    <section id="login-page" className="auth-page">
      <form id="login" className="auth-form" onSubmit={submitHandler}>
        <div className="auth-container">
          <h1 className="auth-title">{lang(language, 'welcome_back_log')}</h1>
          <p className="auth-subtitle">{lang(language, 'login_to_continue')}</p>

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

          {error && <p className="auth-error">{error}</p>}

          <input type="submit" className="btn submit" value={lang(language, 'login_button')} />

          <p className="auth-switch">
            {lang(language, 'no_account')}{' '}
            <a href="/register">{lang(language, 'register_here')}</a>
          </p>
          <p className="auth-switch">
            {lang(language, 'forgot_password')}{' '}
            <a href="/forgot-password">{lang(language, 'reset_here')}</a>
          </p>
        </div>
      </form>
    </section>
  );
}
