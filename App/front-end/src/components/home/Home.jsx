import React, { useEffect } from 'react';
import '../../style/landing.css'
import { useAuth } from '../../context/AuthContext';
import { useSelector } from 'react-redux';
import { lang } from '../../lang/lang';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
    const language = useSelector(state => state.general.language);
    const { user } = useAuth();

    const navigate = useNavigate();

    return (
        <div className="landing">
            <section className="hero container">
                <div className="hero-content" style={{ marginTop: '20px' }}>
                    <h1>{lang(language, 'your_pers_learning_companion')}</h1>
                    <p>{lang(language, 'organize_and_study')}</p>

                </div>
            </section>

            <section className="features">
                <h2>{lang(language, 'what_you_get')}</h2>
                <div className="feature-grid">
                    <div className="feature-card">💬 Chat with Students & Teachers</div>
                    <div className="feature-card">🎮 Play Educational Games</div>
                    <div className="feature-card">🏆 Level Up & Earn Achievements</div>
                    <div className="feature-card">📝 Test Your Knowledge by Solving Exams</div>
                </div>
            </section>

            <section className="final-cta container">
                <h2>Ready to improve your study game?</h2>
                <button className="primary-btn"  onClick={() => navigate('/playground')}>{!user ? "Join Now" : 'Jump to the Playground! 🕹️'}</button>
            </section>
        </div>

    );
}
