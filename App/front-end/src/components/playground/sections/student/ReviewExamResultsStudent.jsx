import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../../api/api';
import '../../../../style/reviewExamResults.css';

const ReviewExamResultsStudent = ({ resultId }) => {
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [score, setScore] = useState('');
    const [feedback, setFeedback] = useState('');
    const [saving, setSaving] = useState(false);
    const [autoScore, setAutoScore] = useState(0);

    useEffect(() => {
        const fetchResult = async () => {
            try {
                const res = await axiosInstance.get(`/api/examResults/${resultId}`, { withCredentials: true });
                const data = res.data;
                setResult(data);
                setScore(data.grade || '');
                setFeedback(data.feedback || '');

                // Calculate auto-score
                let calculatedScore = 0;

                if (Array.isArray(data.answers)) {
                    data.answers.forEach((a) => {
                        if (a.type === 'multiple') {
                            const points = a.points || 1;
                            const correctAnswers = (a.correctAnswers || []).sort();
                            const studentAnswers = Array.isArray(a.studentAnswer)
                                ? [...a.studentAnswer].sort()
                                : [];

                            const isCorrect =
                                correctAnswers.length === studentAnswers.length &&
                                correctAnswers.every((ans, i) => ans === studentAnswers[i]);

                            if (isCorrect) calculatedScore += points;
                        }
                    });
                }

                setAutoScore(calculatedScore);
            } catch (err) {
                console.error('❌ Error fetching result:', err);
            } finally {
                setLoading(false);
            }
        };

        if (resultId) fetchResult();
    }, [resultId]);

    const submitGrade = async () => {
        if (!score) return alert('❗ Please enter a grade.');
        setSaving(true);
        try {
            await axiosInstance.put(
                `/api/examResults/grade/${resultId}`,
                { score, feedback },
                { withCredentials: true }
            );
            alert('✅ Grade and comment submitted!');
        } catch (err) {
            console.error('❌ Error submitting:', err);
            alert('❌ Error grading result.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <p className="loading">⏳ Loading result...</p>;
    if (!result) return <p className="error">❌ Result not found.</p>;

    return (
        <div className="review-exam-container">
            <h2>🧪 Exam Results</h2>

            <div className="info-box">
                <p><strong>👤 Student:</strong> {result.studentName || result.studentId?.username || 'Unknown'}</p>
                <p><strong>🕒 Submitted:</strong> {new Date(result.submittedAt).toLocaleString()}</p>
                <p><strong>⚠️ Violation:</strong> {result.endedDueToViolation ? 'Yes ❌' : 'No ✅'}</p>
            </div>

            <div className="answers-section">
                <h3>📋 Answers</h3>
                {Array.isArray(result.answers) && result.answers.length > 0 ? (
                    result.answers.map((a, index) => {
                        const points = a.points || 1;
                        const correctAnswers = (a.correctAnswers || []).sort();
                        const studentAnswers = Array.isArray(a.studentAnswer)
                            ? [...a.studentAnswer].sort()
                            : [a.studentAnswer];

                        const isCorrect =
                            a.type === 'multiple' &&
                            correctAnswers.length === studentAnswers.length &&
                            correctAnswers.every((ans, i) => ans === studentAnswers[i]);

                        return (
                            <div key={index} className="answer-block">
                                <p><strong>Q{index + 1}:</strong> {a.questionText}</p>
                                <p><strong>📌 Type:</strong> {a.type}</p>
                                <p><strong>📝 Student Answer:</strong> {studentAnswers.join(', ') || 'No answer'}</p>

                                {a.type === 'multiple' && (
                                    <>
                                        <p><strong>✅ Correct Answer(s):</strong> {correctAnswers.join(', ')}</p>
                                        <p>
                                            <strong>✔️ Correct:</strong> {isCorrect ? 'Yes ✅' : 'No ❌'} | <strong>Points:</strong> {points}
                                        </p>
                                    </>
                                )}

                                {a.type === 'open' && (
                                    <p className="manual-review-note">🧐 Open-ended question – review manually</p>
                                )}

                                <hr />
                            </div>
                        );
                    })
                ) : (
                    <p>❗ No answers submitted or data is malformed.</p>
                )}
            </div>
        </div>
    );
};

export default ReviewExamResultsStudent;
