import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../../api/api';
import '../../../../style/studentCourses.css';

const SUBJECTS = [
  "Math", "Science", "History", "Geography",
  "Language", "Art", "Music", "Technology", 'Other'
];

const StudentCourses = ({ setActiveSection, setSelectedCourse }) => {
  const [courses, setCourses] = useState([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('All');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axiosInstance.get('/api/courses/all', { withCredentials: true });
        setCourses(res.data);
        const myIds = res.data
          .filter(course => course.enrolled)
          .map(course => course._id);
        setEnrolledCourseIds(myIds);
      } catch (err) {
        console.error('Failed to fetch courses:', err);
      }
    };
    fetchCourses();
  }, []);

  const handleEnroll = async (courseId) => {
    try {
      await axiosInstance.post(`/api/courses/${courseId}/enroll`, {}, { withCredentials: true });
      setEnrolledCourseIds(prev => [...prev, courseId]);
    } catch (err) {
      console.error('Failed to enroll:', err);
    }
  };

  const handleCourseClick = (course) => {
    if (enrolledCourseIds.includes(course._id)) {
      setSelectedCourse(course);
      setActiveSection('CourseGames');
    }
  };

  const filteredCourses = selectedSubject === 'All'
    ? courses
    : courses.filter(course => course.subject === selectedSubject);

  return (
    <div className="student-courses container">
      <section className="hero">
        <h1>📘 Available Courses</h1>
        <p>Click a course to view its games.</p>

        <div className="sort-dropdown">
          <label htmlFor="subjectFilter">🎯 Filter by Subject: </label>
          <select
            id="subjectFilter"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
          >
            <option value="All">All</option>
            {SUBJECTS.map((subject) => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
        </div>
      </section>

      <div className="course-grid">
        {filteredCourses.map(course => {
          const isEnrolled = enrolledCourseIds.includes(course._id);

          return (
            <div
              key={course._id}
              className={`course-card ${isEnrolled ? 'clickable' : 'disabled'}`}
              onClick={() => handleCourseClick(course)}
            >
              <h3>{course.title}</h3>
              <p className="desc">{course.description}</p>
              <p className="subject">📚 {course.subject}</p>

              {isEnrolled ? (
                <p className="enrolled-msg">✅ Enrolled</p>
              ) : (
                <button
                  className="enroll-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEnroll(course._id);
                  }}
                >
                  ➕ Enroll
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StudentCourses;
