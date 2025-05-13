import React, { useState } from 'react';
import CardGameBuilder from './CardGameBuilder';

const TeacherGames = () => {
    const [activeBuilder, setActiveBuilder] = useState(null); // 'quiz' | 'flashcard' | null

    if (activeBuilder === 'flashcard') {
        return (
            <div className="builder-screen container">
                <CardGameBuilder />
                <div className="cta-buttons" style={{ marginTop: '20px' }}>
                    <button className="secondary-btn" onClick={() => setActiveBuilder(null)}>
                        ⬅️ Back to Game Panel
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="landing">
            <section className="hero container">
                <div className="hero-content">
                    <h1>🧑‍🏫 Game Creation Panel</h1>
                    <p>Create fun and educational games to engage your students and boost their learning.</p>
                    <div className="cta-buttons">
                        <button className="primary-btn" onClick={() => setActiveBuilder('quiz')}>Create New Quiz Game ✍️</button>
                        <button className="secondary-btn" onClick={() => setActiveBuilder('flashcard')}>Create Flashcard Game 🃏</button>
                    </div>
                </div>
            </section>

            <section className="features">
                <h2>Your Tools</h2>
                <div className="feature-grid">
                    <div className="feature-card">📊 Monitor Student Progress</div>
                    <div className="feature-card">🛠 Customize Game Settings</div>
                    <div className="feature-card">🔁 Edit & Reuse Previous Games</div>
                </div>
            </section>

            <section className="final-cta container">
                <h2>Start Building Your Educational Games Today</h2>
                <button className="primary-btn" onClick={() => setActiveBuilder('flashcard')}>Go to Game Builder 🎮</button>
            </section>
        </div>
    );
};

export default TeacherGames;
