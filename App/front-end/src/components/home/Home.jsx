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
                    <div className="feature-card">{lang(language, 'chat_with_students' )}</div>
                    <div className="feature-card">{lang(language, 'play_edu_games')}</div>
                    <div className="feature-card">{lang(language, 'level_up_and_earn')}</div>
                    <div className="feature-card">{lang(language, 'test_your_know')}</div>
                </div>
            </section>

            <section className="final-cta container">
                <h2>{lang(language, 'ready_to_play')}</h2>
                <button className="primary-btn"  onClick={() => navigate('/playground')}>{!user ? "Join Now" : 'Jump to the Playground! 🕹️'}</button>
            </section>
        </div>

    );
}
