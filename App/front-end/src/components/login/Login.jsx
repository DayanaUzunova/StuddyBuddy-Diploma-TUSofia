import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useForm } from "../../hooks/useForm";
import { useAuth } from "../../context/AuthContext.jsx"; 
import '../../styles/login.css';

const initialValues = { email: '', password: '' };

export default function Login() {
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();  

    const loginHandler = async ({ email, password }) => {
        if (!email || !password) {
            setError('Both email and password are required!');
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message);

            login(data); 
            navigate("/"); 
        } catch (err) {
            setError(err.message || "Login failed!");
        }
    };

    const { values, changeHandler, submitHandler } = useForm(initialValues, loginHandler);

    return (
        <section id="login-page" className="auth">
            <form id="login" onSubmit={submitHandler}>
                <div className="container">
                    <h1>Login</h1>

                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={values.email}
                        onChange={changeHandler}
                        placeholder="Enter your email here.."
                        required
                    />

                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={values.password}
                        onChange={changeHandler}
                        placeholder="Enter your password here.."
                        required
                    />

                    {error && <p style={{ color: "red", fontSize: "14px" }}>{error}</p>}

                    <input type="submit" className="btn submit" value="Login" />

                    <p className="field">
                        <span>Don’t have an account? <a href="/register">Register here</a></span>
                    </p>
                </div>
            </form>
        </section>
    );
}
