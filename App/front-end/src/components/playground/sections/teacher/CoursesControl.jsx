import React, { useState } from 'react';
import axiosInstance from '../../../../api/api';
import '../../../../style/coursesControl.css';

const CoursesControl = ({ onCancel, onCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await axiosInstance.post('/api/courses/create', { title, description }, { withCredentials: true });
      onCreated();
    } catch (err) {
      console.error(err);
      setError('⚠️ Failed to create course. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="landing">
      <section className="hero container">
        <div className="hero-content">
          <h1>Create a New Course 📘✨</h1>
          <p>🎓 Let’s build something awesome together for your students! 🚀</p>
        </div>
      </section>

      <section className="features">
        <div className="form-wrapper">
          <form onSubmit={handleCreateCourse} className="course-form">
            <label htmlFor="course-title">📌 Course Title</label>
            <input
              id="course-title"
              type="text"
              placeholder="e.g. 🌱 Introduction to Biology"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <label htmlFor="course-description">📝 Course Description</label>
            <textarea
              id="course-description"
              placeholder="Write a short overview for your students 📄"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              required
              style={{ resize: 'none' }}
            ></textarea>

            {error && <p className="error-msg">{error}</p>}

            <button type="submit" className="primary-btn" disabled={submitting}>
              {submitting ? '⏳ Creating...' : '🚀 Create Course'}
            </button>
          </form>

          <button className="back-btn" onClick={onCancel}>
            ⬅️ Back to Dashboard
          </button>
        </div>
      </section>
    </div>
  );
};

export default CoursesControl;
