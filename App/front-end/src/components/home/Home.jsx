import React, { useEffect } from 'react';
import '../../style/landing.css'
import { useAuth } from '../../context/AuthContext';
import { useSelector } from 'react-redux';
import { lang } from '../../lang/lang';

export default function LandingPage() {

    const language = useSelector(state => state.general.language);
    const { user } = useAuth();
    
    useEffect(() => { 
        console.log(language);
        
    }, [language])

    return (
        <div className="landing">
            <section className="hero container">
                <div className="hero-content">
                    <h1>{lang(language, 'your_pers_learning_companion')}</h1>
                    <p>{lang(language, 'organize_and_study')}</p>
                    <div className="cta-buttons">
                        <button className="primary-btn">
                            {!user ? 'Sign Up for Free 📝' : lang(language, 'view_profile')}
                        </button>
                    </div>
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
                <button className="primary-btn">{!user ? "Join Now" : 'Jump to the Playground! 🕹️'}</button>
            </section>
        </div>

    );
}
