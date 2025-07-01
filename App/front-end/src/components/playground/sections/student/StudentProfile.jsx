import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import axiosInstance from '../../../../api/api';
import CourseGames from '../teacher/CourseGames';
import Exam from '../teacher/Exam';
import { useSelector } from 'react-redux';
import { lang } from '../../../../lang/lang';

const StudentProfile = () => {
  const { user } = useAuth();
  const language = useSelector(state => state.general.language);

  const [activeTab, setActiveTab] = useState('Enrolled Courses');
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [gameId, setGameId] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [examId, setExamId] = useState(null);
  const [activeSection, setActiveSection] = useState('');

  const fetchEnrolledCourses = async () => {
    try {
      setLoadingCourses(true);
      const res = await axiosInstance.get('/api/courses/my/student', {
        withCredentials: true,
      });
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
      <CourseGames
        course={selectedCourse}
        setActiveSection={setActiveSection}
        setGameId={setGameId}
        setExamId={setExamId}
        goBack={() => {
          setSelectedCourse(null);
          setActiveSection('Courses');
        }}
      />
    );
  }

  return (
    <div className="landing">
      <section className="hero container">
        <div className="hero-content">
          <h1>{lang(language, 'hello')}, {user?.username || lang(language, 'learner')} 👋</h1>
          <p>{lang(language, 'student_profile_intro')}</p>
        </div>
      </section>

      <div className="tab-buttons">
        {[lang(language, 'enrolled_courses'), lang(language, 'profile')].map((tabLabel, index) => {
          const tab = index === 0 ? 'Enrolled Courses' : 'Profile';
          return (
            <button
              key={tab}
              className={`tab-button ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tabLabel}
            </button>
          );
        })}
      </div>

      <section className="features">
        {activeTab === 'Enrolled Courses' && (
          <>
            <h2>{lang(language, 'your_courses')}</h2>
            {loadingCourses ? (
              <p>{lang(language, 'loading_courses')}</p>
            ) : enrolledCourses.length === 0 ? (
              <div className="feature-card">{lang(language, 'no_courses')} 😕</div>
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
                      🎮 {course.games?.length || 0} {lang(language, 'games')} | 📝 {course.exams?.length || 0} {lang(language, 'exams')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'Profile' && (
          <>
            <h2>👤 {lang(language, 'your_profile')}</h2>
            <p>
              <strong>🆔 {lang(language, 'username')}:</strong> {user?.username}
            </p>
            <p>
              <strong>📧 {lang(language, 'email_title')}:</strong> {user?.email}
            </p>
          </>
        )}
      </section>
    </div>
  );
};

export default StudentProfile;
