import { useState } from 'react';
import axiosInstance from '../../api/api.jsx';
import '../../style/login.css';

export default function ForgotPassword() {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const resetMessages = () => {
        setError('');
        setMessage('');
    };

    const sendCode = async () => {
        try {
            resetMessages();

            if (!email.trim()) {
                setError('Email is required.');
                return;
            }

            setLoading(true);
            await axiosInstance.post('/api/users/forgot-password', { email });
            setMessage('Code sent to your email.');
            setStep(2);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Error sending code. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const verifyCode = async () => {
        try {
            resetMessages();

            if (!code.trim()) {
                setError('Code is required.');
                return;
            }

            setLoading(true);
            await axiosInstance.post('/api/users/verify-code', { email, code });
            setStep(3);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Invalid code. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const resetPassword = async () => {
        try {
            resetMessages();

            if (!newPassword.trim() || !confirmPassword.trim()) {
                setError('Both password fields are required.');
                return;
            }

            if (newPassword !== confirmPassword) {
                setError('Passwords do not match.');
                return;
            }

            setLoading(true);
            await axiosInstance.post('/api/users/reset-password', { email, code, newPassword });
            setMessage('Password changed successfully. You can now log in.');
            setStep(4);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Error resetting password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="forgot-page" className="auth-page">
            <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
                <div className="auth-container">
                    <h1 className="auth-title">🔁 Forgot Password</h1>

                    {step === 1 && (
                        <>
                            <label>Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                required
                            />
                            <button onClick={sendCode} className="btn submit" disabled={loading}>
                                {loading ? 'Sending...' : 'Send Code'}
                            </button>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <label>Enter the Code from Email</label>
                            <input
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder="Enter the code"
                                required
                            />
                            <button onClick={verifyCode} className="btn submit" disabled={loading}>
                                {loading ? 'Verifying...' : 'Verify Code'}
                            </button>
                        </>
                    )}

                    {step === 3 && (
                        <>
                            <label>New Password</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="New password"
                                required
                            />
                            <label>Confirm New Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm new password"
                                required
                            />
                            <button onClick={resetPassword} className="btn submit" disabled={loading}>
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </button>
                        </>
                    )}

                    {step === 4 && (
                        <>
                            <p className="auth-success">✅ {message}</p>
                        </>
                    )}

                    {error && <p className="auth-error">❌ {error}</p>}
                    {message && step !== 4 && <p className="auth-success">✅ {message}</p>}
                </div>
            </form>
        </section>
    );
}
