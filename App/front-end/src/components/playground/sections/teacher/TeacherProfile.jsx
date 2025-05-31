import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import axiosInstance from '../../../../api/api';
import CardGameControl from './CardGameControl';

const TeacherProfile = ({ setActiveSection }) => {
  const { user } = useAuth();
  const [createdGames, setCreatedGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState(null);
  const [activeTab, setActiveTab] = useState('My Games');

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordMsg, setPasswordMsg] = useState('');

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
    if (activeTab === 'My Games') fetchGames();
  }, [activeTab]);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordMsg('');
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return setPasswordMsg('Passwords do not match.');
    }
    try {
      await axiosInstance.post('/api/users/change-password', passwordData, {
        withCredentials: true,
      });
      setPasswordMsg('✅ Password updated successfully.');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      setPasswordMsg('❌ Error updating password.');
    }
  };

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

      <div className="tab-buttons">
        {['My Games', 'My Courses', 'Privacy'].map((tab) => (
          <button
            key={tab}
            className={`tab-button ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <section className="features">
        {activeTab === 'My Games' && (
          <>
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
                      className="feature-card game-card"
                      onClick={() => setSelectedGame(game)}
                    >
                      <div className="game-card-header">
                        <strong>{game.title}</strong>
                        <span
                          className={`approval-badge ${
                            game.isApproved ? 'approved' : 'not-approved'
                          }`}
                        >
                          {game.isApproved ? '✅ Approved' : '⏳ Not Approved'}
                        </span>
                      </div>
                      <div className="game-card-subject">{game.subject} Game</div>
                      {!game.isApproved && (
                        <div className="game-card-note">
                          This game is waiting for admin approval.
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
            <div className="final-cta container">
              <h2>Want to build more games?</h2>
              <button className="primary-btn" onClick={() => setActiveSection('Games')}>
                Create New Game 🎲
              </button>
            </div>
          </>
        )}

        {activeTab === 'My Courses' && (
          <>
            <h2>My Courses</h2>
            <p>📘 This section will list your courses. (Coming soon!)</p>
          </>
        )}

        {activeTab === 'Privacy' && (
          <>
            <h2>Change Password</h2>
            <form onSubmit={handlePasswordChange} className="password-form">
              <input
                type="password"
                placeholder="Current Password"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, currentPassword: e.target.value })
                }
                required
              />
              <input
                type="password"
                placeholder="New Password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, newPassword: e.target.value })
                }
                required
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                }
                required
              />
              <button type="submit" className="primary-btn">
                Update Password
              </button>
              {passwordMsg && <p>{passwordMsg}</p>}
            </form>
          </>
        )}
      </section>
    </div>
  );
};

export default TeacherProfile;
