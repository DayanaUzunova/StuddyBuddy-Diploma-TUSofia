import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../../api/api';
import '../../../../style/cardCourseControl.css';

const CardCourseControl = ({ course, onBack, onUpdate }) => {
    const [title, setTitle] = useState(course.title);
    const [description, setDescription] = useState(course.description);
    const [games, setGames] = useState(course.games || []);
    const [enrolledUsers, setEnrolledUsers] = useState([])
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleUpdateCourse = async () => {
        setLoading(true);
        try {
            await axiosInstance.put(`/api/courses/${course._id}`, { title, description }, { withCredentials: true });
            setEditing(false);
            onUpdate();
        } catch (err) {
            console.error(err);
            setError('❌ Failed to update course.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCourse = async () => {
        if (!window.confirm('Are you sure you want to delete this course?')) return;
        try {
            await axiosInstance.delete(`/api/courses/${course._id}`, { withCredentials: true });
            onBack();
            onUpdate();
        } catch (err) {
            console.error(err);
            setError('❌ Failed to delete course.');
        }
    };

    return (
        <div className="landing">
            <section className="hero container">
                <div className="hero-content">
                    <h1>📘 {course.title}</h1>
                    <p>🧑‍🏫 Manage your course and inspire learners!</p>
                </div>
            </section>

            <section className="features">
                <div className="form-wrapper">

                    <div className="course-section">
                        <h3>👥 Enrolled Students</h3>
                        {enrolledUsers.length === 0 ? (
                            <p>No students enrolled yet.</p>
                        ) : (
                            <div className="table-wrapper">
                                <table className="student-table">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Username</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {enrolledUsers.map((user, index) => (
                                            <tr key={user._id}>
                                                <td>{index + 1}</td>
                                                <td>{user.username}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        <h3>🎮 Linked Games</h3>
                        {games.length === 0 ? (
                            <p>No games linked yet.</p>
                        ) : (
                            <ul>
                                {games.map((game) => (
                                    <li key={game._id}>{game.title}</li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {editing ? (
                        <>
                            <label>✏️ Title</label>
                            <input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="wide-input"
                            />
                            <label>📝 Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={4}
                                className="wide-input"
                            />
                        </>
                    ) : (
                        <h2 className="course-description">{course.description}</h2>
                    )}

                    {error && <p className="error-msg">{error}</p>}

                    <div className="button-group">
                        {editing ? (
                            <>
                                <button className="primary-btn same-size-btn" onClick={handleUpdateCourse} disabled={loading}>
                                    {loading ? '⏳ Saving...' : '💾 Save Changes'}
                                </button>
                                <button className="back-btn same-size-btn" onClick={() => setEditing(false)}>❌ Cancel</button>
                            </>
                        ) : (
                            <>
                                <button className="primary-btn same-size-btn" onClick={() => setEditing(true)}>✏️ Edit</button>
                                <button className="danger-btn same-size-btn" onClick={handleDeleteCourse}>🗑️ Delete</button>
                            </>
                        )}
                        <button className="back-btn same-size-btn" onClick={onBack}>⬅️ Back</button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default CardCourseControl;