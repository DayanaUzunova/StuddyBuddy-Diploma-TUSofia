import React from 'react';
import '../../style/landing.css'

export default function LandingPage() {
    return (
        <div className="landing">
            <section className="hero container">
                <div className="hero-content">
                    <h1>Your Personal Learning Companion</h1>
                    <p>Organize your studies, chat with students or teachers, and have fun while learning.</p>
                    <div className="cta-buttons">
                        <button className="primary-btn">Get Started</button>
                        <button className="secondary-btn">Sign Up Free</button>
                    </div>
                </div>
            </section>

            <section className="features">
                <h2>What You Get</h2>
                <div className="feature-grid">
                    <div className="feature-card">💬 Chat with Students & Teachers</div>
                    <div className="feature-card">🎮 Play Educational Games</div>
                    <div className="feature-card">🏆 Level Up & Earn Achievements</div>
                    <div className="feature-card">📝 Test Your Knowledge by Solving Exams</div>
                </div>
            </section>

            <section className="final-cta container">
                <h2>Ready to improve your study game?</h2>
                <button className="primary-btn">Join Now</button>
            </section>
        </div>

    );
}
