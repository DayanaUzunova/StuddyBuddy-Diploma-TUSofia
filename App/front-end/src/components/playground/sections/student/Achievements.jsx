import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import axiosInstance from '../../../../api/api';
import '../../../../style/achievements.css';

const Achievements = () => {
  const { user } = useAuth();
  const [completedGames, setCompletedGames] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      setCompletedGames(0);
      setError(null);
      return;
    }

    let isCancelled = false;
    const fetchGameStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axiosInstance.get('/api/games/completed/count', {
          withCredentials: true,
        });
        if (!isCancelled) {
          const count = res.data.gamesPlayedCount || 0;
          setCompletedGames(count);
        }
      } catch (err) {
        if (!isCancelled) {
          console.error('Error fetching completed games:', err);
          setError('Failed to load your progress.');
          setCompletedGames(0);
        }
      } finally {
        if (!isCancelled) setLoading(false);
      }
    };

    fetchGameStats();

    return () => {
      isCancelled = true;
    };
  }, [user]);

  const achievements = useMemo(() => [
    { title: '🎮 First Game!', description: 'Complete your first game', achieved: completedGames >= 1 },
    { title: '🔥 Game On', description: 'Complete 5 games', achieved: completedGames >= 5 },
    { title: '🏅 Pro Player', description: 'Complete 10 games', achieved: completedGames >= 10 },
    { title: '🎯 Game Master', description: 'Complete 25 games', achieved: completedGames >= 25 },
  ], [completedGames]);

  if (!user) {
    return (
      <main className="achievements container" aria-live="polite">
        <section className="hero">
          <h1>🏆 Achievements</h1>
          <p>Please log in to see your achievements.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="achievements container" aria-live="polite">
      <section className="hero">
        <h1>🏆 Achievements</h1>
        <p>Track your milestones and unlock new trophies!</p>
        {loading && <p>Loading your progress...</p>}
        {error && <p role="alert" style={{ color: 'red' }}>{error}</p>}
      </section>

      <section className="achievements-grid">
        {achievements.map(({ title, description, achieved }, idx) => (
          <article
            key={idx}
            className={`achievement-card ${achieved ? 'unlocked' : 'locked'}`}
            aria-label={`${title} achievement is ${achieved ? 'unlocked' : 'locked'}`}
          >
            <h3>{title}</h3>
            <p>{description}</p>
            <p className="status">{achieved ? '✅ Unlocked' : '🔒 Locked'}</p>
          </article>
        ))}
      </section>
    </main>
  );
};

export default Achievements;
