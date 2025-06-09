import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../../api/api';
import '../../../../style/studentGames.css';

const CourseGames = ({ course, setActiveSection, setGameId, goBack, setExamId }) => {
    const [exams, setExams] = useState([]);
    const [results, setResults] = useState([]);

    const flashcardGames = course.games?.filter((game) => game?.type === 'card') || [];

    const handleGameClick = (gameId) => {
        setGameId(gameId);
        setActiveSection('CardGame');
    };

    const handleExamClick = (examId) => {
        setExamId(examId);
        setActiveSection('Exam');
    };

    useEffect(() => {
        if (course?._id) {
            axiosInstance
                .get(`/api/exams/by-course/${course._id}`, { withCredentials: true })
                .then((res) => setExams(res.data))
                .catch((err) => console.error('Error loading exams:', err));

            axiosInstance
                .get(`/api/exam-results/mine/${course._id}`, { withCredentials: true })
                .then((res) => setResults(res.data))
                .catch((err) => console.error('Error loading exam results:', err));
        }
    }, [course]);

    return (
        <div className="student-games container">
            <section className="hero">
                <h1>🎮 Games and Exams for: {course.title}</h1>
                <p>Enjoy learning through fun and interactive games!</p>
                <button className="back-btn" onClick={goBack}>🔙 Back to Courses</button>
            </section>

            <section className="game-section">
                <h2>🃏 Flashcard Games</h2>
                <div className="game-grid">
                    {flashcardGames.length > 0 ? (
                        flashcardGames.map((game) => (
                            <div
                                key={game._id}
                                className="game-card"
                                onClick={() => handleGameClick(game._id)}
                            >
                                <h3>{game.title}</h3>
                                <p>📚 {game.subject}</p>
                                <p className="desc">{game.description || 'No description provided.'}</p>
                            </div>
                        ))
                    ) : (
                        <p className="empty">No flashcard games for this course.</p>
                    )}
                </div>
            </section>

            <section className="game-section">
                <h2>📝 Exams</h2>
                <div className="game-grid">
                    {exams.length > 0 ? (
                        exams.map((exam) => (
                            <div
                                key={exam._id}
                                className="game-card"
                                onClick={() => handleExamClick(exam._id)}
                            >
                                <h3>{exam.title}</h3>
                                <p>📚 {exam.subject}</p>
                                <p className="desc">{exam.questions?.length || 0} questions</p>
                            </div>
                        ))
                    ) : (
                        <p className="empty">No exams available for this course.</p>
                    )}
                </div>
            </section>

            {/* Student's Submissions */}
            <section className="game-section">
                <h2>📊 Your Submissions</h2>
                <div className="game-grid">
                    {results.length > 0 ? (
                        results.map((result) => (
                            <div key={result._id} className="game-card">
                                <h3>{result.examId?.title || 'Untitled Exam'}</h3>
                                <p>📚 {result.examId?.subject || 'Unknown subject'}</p>
                                <p>📅 {new Date(result.submittedAt).toLocaleString()}</p>
                                <p>🧪 Score: {result.score !== null ? result.score : 'Not graded yet'}</p>
                                {result.endedBy === 'tab-switch' && (
                                    <p style={{ color: 'red' }}>⚠️ Ended due to tab switch</p>
                                )}
                                {result?.feedback && (
                                    <p>💬 <strong>Feedback:</strong> {result?.feedback}</p>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="empty">You haven’t submitted any exams yet.</p>
                    )}

                </div>
            </section>
        </div>
    );
};

export default CourseGames;
