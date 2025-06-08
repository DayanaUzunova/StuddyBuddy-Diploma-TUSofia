import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import axiosInstance from '../../../../api/api';
import CardGameControl from './CardGameControl';
import CoursesControl from './CoursesControl';
import CardCourseControl from './CardCourseControl'; // ✅ Added

const TeacherProfile = ({ setActiveSection }) => {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('My Courses');
  const [createdGames, setCreatedGames] = useState([]);
  const [createdCourses, setCreatedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [creatingCourse, setCreatingCourse] = useState(false);

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

  const fetchCourses = async () => {
    try {
      const res = await axiosInstance.get('/api/courses/my', { withCredentials: true });
      setCreatedCourses(res.data);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    } finally {
      setCoursesLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'My Courses') fetchCourses();
  }, [activeTab]);

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordMsg, setPasswordMsg] = useState('');

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
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
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

  if (creatingCourse) {
    return (
      <CoursesControl
        onCancel={() => setCreatingCourse(false)}
        onCreated={() => {
          fetchCourses();
          setCreatingCourse(false);
        }}
      />
    );
  }

  if (selectedCourse) {
    return (
      <CardCourseControl
        course={selectedCourse}
        onBack={() => {
          setSelectedCourse(null);
          fetchCourses();
        }}
        onUpdate={() => {
          fetchCourses();
        }}
      />
    );
  }

  return (
    <div className="landing">
      <section className="hero container">
        <div className="hero-content">
          <h1>Hello, {user?.username || 'Teacher'} 👋</h1>
          <p>Welcome to your dashboard. Create games, build courses, and inspire learning.</p>
        </div>
      </section>

      <div className="tab-buttons">
        {['My Courses', 'Privacy'].map((tab) => (
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
        {activeTab === 'My Courses' && (
          <>
            <h2>My Courses</h2>
            {coursesLoading ? (
              <p>Loading...</p>
            ) : (
              <div className="feature-grid">
                {createdCourses.length === 0 ? (
                  <div className="feature-card">You haven’t created any courses yet. 📘</div>
                ) : (
                  createdCourses.map((course) => (
                    <div
                      key={course._id}
                      className="feature-card course-card"
                      onClick={() => setSelectedCourse(course)}
                    >
                      <div className="course-card-header">
                        <strong>{course.title}</strong>
                      </div>
                      <p className="course-card-description">{course.description}</p>
                      <p className="course-card-meta">
                        🎮 {course.games?.length || 0} game(s) | 👥 {course.enrolledUsers?.length || 0} learner(s)
                      </p>
                    </div>
                  ))
                )}
              </div>
            )}
            <div className="final-cta container">
              <h2>Want to build a new course?</h2>
              <button className="primary-btn" onClick={() => setCreatingCourse(true)}>
                Create New Course 📚
              </button>
            </div>
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
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                required
              />
              <input
                type="password"
                placeholder="New Password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                required
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                required
              />
              <button type="submit" className="primary-btn">Update Password</button>
              {passwordMsg && <p>{passwordMsg}</p>}
            </form>
          </>
        )}
      </section>
    </div>
  );
};

export default TeacherProfile;
