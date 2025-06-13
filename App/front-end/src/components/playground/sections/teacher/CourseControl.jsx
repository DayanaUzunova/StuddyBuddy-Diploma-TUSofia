import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../../api/api';
import '../../../../style/coursesControl.css';

const SUBJECTS = [
    "Math", "Science", "History", "Geography",
    "Language", "Art", "Music", "Technology", 'Other'
];

const CoursesControl = ({ onCancel, onCreated }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [subject, setSubject] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const handleCreateCourse = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');
        setSubmitting(true);

        try {
            const res = await axiosInstance.post(
                '/api/courses/create',
                { title, description, subject },
                { withCredentials: true }
            );

            if (res.status === 201) {
                setSuccessMsg('✅ Course created successfully! 🎉');
                setTitle('');
                setDescription('');
                setSubject('');
                onCreated?.();
            } else {
                throw new Error('Unexpected response');
            }
        } catch (err) {
            console.error(err);
            setErrorMsg('❌ Failed to create course. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    useEffect(() => {
        if (successMsg) {
            const timeout = setTimeout(() => setSuccessMsg(''), 3000);
            return () => clearTimeout(timeout);
        }
    }, [successMsg]);

    const isFormValid = title.trim() && description.trim() && subject;

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
                        />

                        <label htmlFor="subject-select">📚 Subject</label>
                        <select
                            id="subject-select"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            required
                        >
                            <option value="">-- Select a subject --</option>
                            {SUBJECTS.map((subj) => (
                                <option key={subj} value={subj}>{subj}</option>
                            ))}
                        </select>

                        {errorMsg && <div className="toast toast-error">{errorMsg}</div>}
                        {successMsg && <div className="toast toast-success">{successMsg}</div>}

                        <button
                            type="submit"
                            className="primary-btn"
                            disabled={!isFormValid || submitting}
                        >
                            {submitting ? '⏳ Creating...' : '🚀 Create Course'}
                        </button>
                    </form>

                    <button type="button" className="back-btn" onClick={onCancel}>
                        ⬅️ Back to Dashboard
                    </button>
                </div>
            </section>
        </div>
    );
};

export default CoursesControl;
