import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../../api/api';
import '../../../../style/cardCourseControl.css';
import CardGameBuilder from './CardGameBuilder';
import ExamBuilder from './ExamBuilder';
import ReviewExamResults from './ReviewExamResults';

const CardCourseControl = ({ course, onBack, onUpdate }) => {
    const [title, setTitle] = useState(course.title);
    const [description, setDescription] = useState(course.description);
    const [games, setGames] = useState(course.games || []);
    const [enrolledUsers, setEnrolledUsers] = useState([]);
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showGameBuilder, setShowGameBuilder] = useState(false);
    const [showExamBuilder, setShowExamBuilder] = useState(false);
    const [examResults, setExamResults] = useState([]);
    const [selectedResult, setSelectedResult] = useState(null);

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

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [usersRes, courseRes, examRes] = await Promise.all([
                    axiosInstance.get(`/api/courses/${course._id}/enrolled-users`, { withCredentials: true }),
                    axiosInstance.get(`/api/courses/${course._id}`, { withCredentials: true }),
                    axiosInstance.get(`/api/exams/by-course/${course._id}/results`, { withCredentials: true }),
                ]);
                setEnrolledUsers(usersRes.data);
                setGames(courseRes.data.games || []);
                setExamResults(examRes.data);
            } catch (err) {
                console.error('Error fetching course data:', err);
            }
        };
        fetchAll();
    }, [course._id]);

    if (selectedResult) {
        return (
            <div className="landing">
                <h2>🔍 Reviewing Exam Submission</h2>
                <ReviewExamResults
                    resultId={selectedResult.resultId}
                    examId={selectedResult.examId}
                />
                <div className="builder-actions">
                    <button className="back-btn same-size-btn" onClick={() => setSelectedResult(null)}>⬅️ Back to Course</button>
                </div>
            </div>
        );
    }

    if (showExamBuilder) {
        return (
            <div className="landing">
                <ExamBuilder courseId={course._id} />
                <div className="builder-actions">
                    <button className="back-btn same-size-btn" onClick={() => setShowExamBuilder(false)}>⬅️ Back to Course</button>
                </div>
            </div>
        );
    }

    if (showGameBuilder) {
        return (
            <div className="landing">
                <CardGameBuilder courseId={course._id} onBackToCourse={() => setShowGameBuilder(false)} />
                <div className="builder-actions">
                    <button className="back-btn same-size-btn" onClick={() => setShowGameBuilder(false)}>⬅️ Back to Course</button>
                </div>
            </div>
        );
    }

    return (
        <div className="landing">
            <section className="hero container">
                <div className="hero-content">
                    <h1>📘 {course.title}</h1>
                    <p>🧑‍🏫 Manage your course and inspire learners!</p>
                </div>
            </section>

            <section className="features form-wrapper">
                <div className="course-meta">
                    {editing ? (
                        <>
                            <label>✏️ Title</label>
                            <input value={title} onChange={(e) => setTitle(e.target.value)} className="wide-input" />
                            <label>📝 Description</label>
                            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="wide-input" />
                        </>
                    ) : (
                        <p className="course-description">{description}</p>
                    )}
                </div>

                <div className="course-section">
                    <h3>👥 Enrolled Students</h3>
                    {enrolledUsers.length === 0 ? (
                        <p>No students enrolled yet.</p>
                    ) : (
                        <div className="scroll-table-wrapper">
                            <table className="student-table">
                                <thead><tr><th>#</th><th>Username</th></tr></thead>
                                <tbody>
                                    {enrolledUsers.map((user, index) => (
                                        <tr key={user._id}><td>{index + 1}</td><td>{user.username}</td></tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <div className="course-section">
                    <h3>🎮 Linked Games</h3>
                    {games.length === 0 ? (
                        <p>No games linked yet.</p>
                    ) : (
                        <ul className="games-list">
                            {games.map(game => <li key={game._id}>🕹️ {game.title}</li>)}
                        </ul>
                    )}
                </div>

                <div className="course-section">
                    <h3>🧪 Exam Results</h3>
                    {examResults.length === 0 ? (
                        <p>No exam submissions yet.</p>
                    ) : (
                        <div className="scroll-table-wrapper">
                            <table className="student-table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Student</th>
                                        <th>Exam</th>
                                        <th>Score</th>
                                        <th>Violation</th>
                                        <th>Submitted At</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {examResults.map((result, index) => (
                                        <tr
                                            key={result._id}
                                            onClick={() => setSelectedResult({
                                                resultId: result._id,
                                                examId: result.examId?._id
                                            })}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <td>{index + 1}</td>
                                            <td>{result.studentId?.username || 'Unknown'}</td>
                                            <td>{result.examId?.title || 'Untitled'}</td>
                                            <td>{result.grade ?? 'Not graded'}</td>
                                            <td>{result.endedDueToViolation ? '⚠️ Yes' : '✅ No'}</td>
                                            <td>{new Date(result.submittedAt).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

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
                    <button className="primary-btn same-size-btn" onClick={() => setShowGameBuilder(true)}>🕹️ Create Game</button>
                    <button className="primary-btn same-size-btn" onClick={() => setShowExamBuilder(true)}>📝 Create Exam</button>
                    <button className="back-btn same-size-btn" onClick={onBack}>⬅️ Back</button>
                </div>
            </section>
        </div>
    );
};

export default CardCourseControl;
