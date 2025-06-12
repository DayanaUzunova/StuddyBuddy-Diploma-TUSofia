import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import axiosInstance from '../../../../api/api';

const StudentProfile = () => {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('Enrolled Courses');
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const fetchEnrolledCourses = async () => {
    setLoadingCourses(true);
    try {
      const res = await axiosInstance.get('/api/courses/enrolled', { withCredentials: true });
      setEnrolledCourses(res.data);
    } catch (error) {
      console.error('Failed to fetch enrolled courses:', error);
    } finally {
      setLoadingCourses(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'Enrolled Courses') {
      fetchEnrolledCourses();
    }
  }, [activeTab]);

  if (selectedCourse) {
    return (
      <CourseDetailControl
        course={selectedCourse}
        onBack={() => {
          setSelectedCourse(null);
          fetchEnrolledCourses();
        }}
      />
    );
  }

  return (
    <div className="landing">
      <section className="hero container">
        <div className="hero-content">
          <h1>Hello, {user?.username || 'Learner'} 👋</h1>
          <p>Explore your courses, track progress, and enjoy learning.</p>
        </div>
      </section>

      <div className="tab-buttons">
        {['Enrolled Courses', 'Profile'].map((tab) => (
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
        {activeTab === 'Enrolled Courses' && (
          <>
            <h2>Your Courses</h2>
            {loadingCourses ? (
              <p>Loading courses...</p>
            ) : enrolledCourses.length === 0 ? (
              <div className="feature-card">You are not enrolled in any courses yet. 😕</div>
            ) : (
              <div className="feature-grid">
                {enrolledCourses.map((course) => (
                  <div
                    key={course._id}
                    className="feature-card course-card"
                    onClick={() => setSelectedCourse(course)}
                  >
                    <div className="course-card-header">
                      <strong>📚 {course.title}</strong>
                    </div>
                    <p className="course-card-description">{course.description}</p>
                    <p className="course-card-meta">
                      🎮 {course.games?.length || 0} game(s) | 📝 {course.exams?.length || 0} exam(s)
                    </p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'Profile' && (
          <>
            <h2>Your Profile</h2>
            <p><strong>Username:</strong> {user?.username}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            {/* Add more profile info or edit form here */}
          </>
        )}
      </section>
    </div>
  );
};

export default StudentProfile;
