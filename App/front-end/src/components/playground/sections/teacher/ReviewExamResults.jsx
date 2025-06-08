import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../../api/api';
import '../../../../style/reviewExamResults.css';

const ReviewExamResults = ({ examId, resultId }) => {
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [grade, setGrade] = useState('');

    useEffect(() => {
        const fetchResult = async () => {
            try {
                const res = await axiosInstance.get(`/api/examResults/${resultId}`, { withCredentials: true });
                setResult(res.data);
                setGrade(res.data.grade || '');
            } catch (err) {
                console.error('❌ Error fetching result:', err);
            } finally {
                setLoading(false);
            }
        };

        if (resultId) fetchResult();
    }, [resultId]);

    const submitGrade = async () => {
        if (!grade) return alert('❗ Please enter a grade.');
        try {
            await axiosInstance.put(`/api/examResults/grade/${resultId}`, { grade }, { withCredentials: true });
            alert('✅ Grade submitted!');
        } catch (err) {
            console.error('❌ Grade error:', err);
            alert('❌ Error grading result.');
        }
    };

    if (loading) return <p className="loading">⏳ Loading result...</p>;
    if (!result) return <p className="error">❌ Result not found.</p>;

    return (
        <div className="review-exam-container">
            <h2>🧪 Exam Results Review</h2>

            <div className="info-box">
                <p><strong>👤 Student:</strong> {result.studentName || result.studentId?.username || 'Unknown'}</p>
                <p><strong>🕒 Submitted:</strong> {new Date(result.submittedAt).toLocaleString()}</p>
                <p><strong>⚠️ Violation:</strong> {result.endedDueToViolation ? 'Yes ❌' : 'No ✅'}</p>
            </div>

            <div className="answers-section">
                <h3>📋 Answers</h3>
                {Array.isArray(result.answers) ? (
                    result.answers.map((answer, index) => (
                        <div key={index} className="answer-block">
                            <p><strong>Q{index + 1}:</strong> {answer.questionText}</p>
                            <p><strong>📝 Answer:</strong> {answer.answerText}</p>
                        </div>
                    ))
                ) : (
                    <p>❗ No answers submitted or data is malformed.</p>
                )}
            </div>

            <div className="grade-section">
                <label htmlFor="grade-input">🏁 Grade:</label>
                <input
                    id="grade-input"
                    type="text"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    placeholder="Enter grade here..."
                />
                <button onClick={submitGrade}>✅ Submit Grade</button>
            </div>
        </div>
    );
};

export default ReviewExamResults;
