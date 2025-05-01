import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useForm } from "../../hooks/useForm";
import '../../styles/register.css';

const initialValues = { username: '', email: '', password: '', confirmPassword: '', role: '' };

export default function Register() {
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const registerHandler = async ({ username, email, password, confirmPassword, role }) => {
        if (!username || !email || !password || !confirmPassword || !role) {
            setError('All fields are required!');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match!');
            return;
        }

        // Validate email format
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            setError('Please enter a valid email address!');
            return;
        }

        try {
            const response = await fetch("http://localhost:3001/api/users/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password, role }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message);

            navigate("/"); 
        } catch (err) {
            setError(err.message || "Registration failed!");
        }
    };

    const { values, changeHandler, submitHandler } = useForm(initialValues, registerHandler);

    return (
        <section id="register-page" className="auth">
            <form id="register" onSubmit={submitHandler}>
                <div className="container">
                    <h1>Register</h1>

                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={values.username}
                        onChange={changeHandler}
                        placeholder="Enter your username.."
                        required
                    />

                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={values.email}
                        onChange={changeHandler}
                        placeholder="Enter your email.."
                        required
                    />

                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={values.password}
                        onChange={changeHandler}
                        placeholder="Enter your password.."
                        required
                    />

                    <label htmlFor="confirmPassword">Confirm Password:</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={values.confirmPassword}
                        onChange={changeHandler}
                        placeholder="Confirm your password.."
                        required
                    />

                    {/* Dropdown за избор на роля */}
                    <label htmlFor="role">Role:</label>
                    <select 
                        id="role" 
                        name="role" 
                        value={values.role} 
                        onChange={changeHandler} 
                        required
                    >
                        <option value="">Select Role</option>
                        <option value="student">Student</option>
                        <option value="teacher">Teacher</option>
                        <option value="admin">Admin</option>
                    </select>

                    {error && <p style={{ color: "red", fontSize: "14px" }}>{error}</p>}

                    <input type="submit" className="btn submit" value="Register" />

                    <p className="field">
                        <span>Already have an account? <a href="/login">Login here</a></span>
                    </p>
                </div>
            </form>
        </section>
    );
}
