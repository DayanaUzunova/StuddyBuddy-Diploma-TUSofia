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
    const [exams, setExams] = useState([]);
    const [enrolledUsers, setEnrolledUsers] = useState([]);
    const [examResults, setExamResults] = useState([]);
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showGameBuilder, setShowGameBuilder] = useState(false); // false or { game }
    const [showExamBuilder, setShowExamBuilder] = useState(false); // false or { exam }
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

    const handleEditGame = (game) => {
        setShowGameBuilder({ game });
    };

    const handleDeleteGame = async (gameId) => {
        if (!window.confirm('Delete this game?')) return;
        try {
            await axiosInstance.delete(`/api/games/${gameId}`, { withCredentials: true });
            setGames(games.filter((g) => g._id !== gameId));
        } catch (err) {
            console.error(err);
            setError('❌ Failed to delete game.');
        }
    };

    const handleEditExam = (exam) => {
        setShowExamBuilder({ exam });
    };

    const handleDeleteExam = async (examId) => {
        if (!window.confirm('Delete this exam?')) return;
        try {
            await axiosInstance.delete(`/api/exams/${examId}`, { withCredentials: true });
            setExams(exams.filter((e) => e._id !== examId));
        } catch (err) {
            console.error(err);
            setError('❌ Failed to delete exam.');
        }
    };

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [usersRes, courseRes, examRes, allExamsRes] = await Promise.all([
                    axiosInstance.get(`/api/courses/${course._id}/enrolled-users`, { withCredentials: true }),
                    axiosInstance.get(`/api/courses/${course._id}`, { withCredentials: true }),
                    axiosInstance.get(`/api/exams/by-course/${course._id}/results`, { withCredentials: true }),
                    axiosInstance.get(`/api/exams/by-course/${course._id}`, { withCredentials: true }),
                ]);
                setEnrolledUsers(usersRes.data);
                setGames(courseRes.data.games || []);
                setExamResults(examRes.data);
                setExams(allExamsRes.data);
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
                <ExamBuilder courseId={course._id} existingExam={showExamBuilder.exam} />
                <div className="builder-actions">
                    <button className="back-btn same-size-btn" onClick={() => setShowExamBuilder(false)}>⬅️ Back to Course</button>
                </div>
            </div>
        );
    }

    if (showGameBuilder) {
        return (
            <div className="landing">
                <CardGameBuilder courseId={course._id} existingGame={showGameBuilder.game} onBackToCourse={() => setShowGameBuilder(false)} />
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
                    <h3>🎮 Games</h3>
                    {games.length === 0 ? (
                        <p>No games yet.</p>
                    ) : (
                        <ul className="games-list">
                            {games.map((game) => (
                                <li key={game._id}>
                                    🕹️ {game.title}
                                    <button className="small-btn" onClick={() => handleEditGame(game)}>✏️</button>
                                    <button className="small-btn danger-btn" onClick={() => handleDeleteGame(game._id)}>🗑️</button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="course-section">
                    <h3>📝 Exams</h3>
                    {exams.length === 0 ? (
                        <p>No exams yet.</p>
                    ) : (
                        <ul className="games-list">
                            {exams.map((exam) => (
                                <li key={exam._id}>
                                    🧪 {exam.title} – {exam.subject}
                                    <button className="small-btn" onClick={() => handleEditExam(exam)}>✏️</button>
                                    <button className="small-btn danger-btn" onClick={() => handleDeleteExam(exam._id)}>🗑️</button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="course-section">
                    <h3>🧪 Exam Submissions</h3>
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
                                            <td>{result.score ?? 'Not graded'}</td>
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
                    <button className="primary-btn same-size-btn" onClick={() => setShowGameBuilder({})}>🕹️ Create Game</button>
                    <button className="primary-btn same-size-btn" onClick={() => setShowExamBuilder({})}>📝 Create Exam</button>
                    <button className="back-btn same-size-btn" onClick={onBack}>⬅️ Back</button>
                </div>
            </section>
        </div>
    );
};

export default CardCourseControl;
