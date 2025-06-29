import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../../api/api';
import '../../../../style/studentGames.css';
import ReviewExamResults from './ReviewExamResults';
import ReviewExamResultsStudent from '../student/ReviewExamResultsStudent';

const CourseGames = ({ course, setActiveSection, setGameId, goBack, setExamId }) => {
    const [exams, setExams] = useState([]);
    const [results, setResults] = useState([]);
    const [selectedResult, setSelectedResult] = useState(null);

    const flashcardGames = course.games?.filter(
        (game) => game?.type === 'card' && game?.isChallenge !== true && game?.isApproved
    ) || [];

    const challengeGames = course.games?.filter(
        (game) => game?.isChallenge === true && game?.isApproved
    ) || [];

    const handleGameClick = (gameId) => {
        setGameId(gameId);
        setActiveSection('CardGame');
    };

    const handleExamClick = (examId) => {
        setExamId(examId);
        setActiveSection('Exam');
    };

    const handleResultClick = (result) => {
        setSelectedResult(result);
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

    const approvedExams = exams.filter((exam) => exam.isApproved);

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
                <h2>🎯 Challenge Games</h2>
                <div className="game-grid">
                    {challengeGames.length > 0 ? (
                        challengeGames.map((game) => (
                            <div
                                key={game._id}
                                className="game-card"
                                onClick={() => handleGameClick(game._id)}
                            >
                                <h3>{game.title}</h3>
                                <p>🏆 {game.subject}</p>
                                <p className="desc">{game.description || 'No description provided.'}</p>
                            </div>
                        ))
                    ) : (
                        <p className="empty">No challenge games for this course.</p>
                    )}
                </div>
            </section>

            <section className="game-section">
                <h2>📝 Exams</h2>
                <div className="game-grid">
                    {approvedExams.length > 0 ? (
                        approvedExams.map((exam) => (
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
                        <p className="empty">No approved exams available for this course.</p>
                    )}
                </div>
            </section>

            <section className="game-section">
                <h2>📊 Your Submissions</h2>
                <div className="game-grid">
                    {results.length > 0 ? (
                        results.map((result) => (
                            <div
                                key={result._id}
                                className="game-card"
                                onClick={() => handleResultClick(result)}
                            >
                                <h3>{result.examId?.title || 'Untitled Exam'}</h3>
                                <p>📚 {result.examId?.subject || 'Unknown subject'}</p>
                                <p>📅 {new Date(result.submittedAt).toLocaleString()}</p>
                                <p>🧪 Score: {result.score !== null ? result.score : 'Not graded yet'}</p>
                                {result.endedDueToViolation && (
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

            {selectedResult && (
               <>
                <ReviewExamResultsStudent resultId={selectedResult?._id} />
               </>
            )}
        </div>
    );
};

export default CourseGames;
