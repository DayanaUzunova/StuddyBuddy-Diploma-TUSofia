import React from 'react';
import { useAuth } from '../../../../context/AuthContext';

const TeacherProfile = () => {
  const { user } = useAuth();

  // Mocked games — replace this with real data later
  const createdGames = [
    { title: 'Math Quiz - Fractions', type: 'Quiz', id: 1 },
    { title: 'Flashcards: World Capitals', type: 'Flashcard', id: 2 },
  ];

  return (
    <div className="landing">
      <section className="hero container">
        <div className="hero-content">
          <h1>Hello, {user?.username || 'Teacher'} 👋</h1>
          <p>Welcome to your dashboard. Create games, track progress, and inspire learning.</p>
        </div>
      </section>

      <section className="features">
        <h2>My Games</h2> 
        <div className="feature-grid">
          {createdGames.length === 0 ? (
            <div className="feature-card">You haven’t created any games yet. 🎮</div>
          ) : (
            createdGames.map((game) => (
              <div key={game.id} className="feature-card">
                <strong>{game.title}</strong>
                <div style={{ marginTop: '6px', color: '#777' }}>{game.type} Game</div>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="final-cta container">
        <h2>Want to build more games?</h2>
        <button className="primary-btn">Create New Game 🎲</button>
      </section>
    </div>
  );
};

export default TeacherProfile;
