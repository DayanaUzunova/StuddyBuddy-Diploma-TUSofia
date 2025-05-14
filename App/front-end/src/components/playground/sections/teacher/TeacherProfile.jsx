import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import axiosInstance from '../../../../api/api';
import CardGameControl from './CardGameControl';

const TeacherProfile = ({ setActiveSection }) => {
  const { user } = useAuth();
  const [createdGames, setCreatedGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState(null);

  const fetchGames = async () => {
    try {
      const res = await axiosInstance.get('/api/games/my', { withCredentials: true });
      setCreatedGames(res.data);
    } catch (error) {
      console.error('Failed to fetch games:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  // Pass fetchGames to refresh after edit/delete
  if (selectedGame) {
    return (
      <CardGameControl
        game={selectedGame}
        onBack={() => setSelectedGame(null)}
        onUpdate={fetchGames}
      />
    );
  }

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
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="feature-grid">
            {createdGames?.length === 0 ? (
              <div className="feature-card">You haven’t created any games yet. 🎮</div>
            ) : (
              createdGames.map((game) => (
                <div
                  key={game._id}
                  className="feature-card"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelectedGame(game)}
                >
                  <strong>{game.title}</strong>
                  <div style={{ marginTop: '6px', color: '#777' }}>{game.subject} Game</div>
                </div>
              ))
            )}
          </div>
        )}
      </section>

      <section className="final-cta container">
        <h2>Want to build more games?</h2>
        <button className="primary-btn" onClick={() => setActiveSection('Games')}>
          Create New Game 🎲
        </button>
      </section>
    </div>
  );
};

export default TeacherProfile;
