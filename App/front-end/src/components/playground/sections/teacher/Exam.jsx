import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../../api/api';
import '../../../../style/exam.css';

const Exam = ({ examId, studentId, onFinish }) => {
    const [exam, setExam] = useState(null);
    const [answers, setAnswers] = useState({});
    const [message, setMessage] = useState('');
    const [isBlocked, setIsBlocked] = useState(false);
    const [warned, setWarned] = useState(false);

    useEffect(() => {
        const fetchExam = async () => {
            try {
                const res = await axiosInstance.get(`/api/exams/${examId}`, { withCredentials: true });
                setExam(res.data);
            } catch (err) {
                console.error('Error loading exam:', err);
                setMessage('❌ Failed to load exam.');
            }
        };

        fetchExam();
    }, [examId]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            const isForbidden =
                (e.ctrlKey && e.key === 'Tab') ||
                (e.metaKey && e.key === 'Tab') ||
                (e.altKey && e.key === 'Tab');

            if (isForbidden) {
                e.preventDefault();
                if (!warned) {
                    setWarned(true);
                    alert('⚠️ Shortcut keys like Ctrl+Tab are not allowed!');
                } else {
                    endExamDueToViolation('Used keyboard shortcut (Ctrl/Cmd/Alt + Tab)');
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [warned]);

    useEffect(() => {
        const handleVisibilityChange = async () => {
            if (document.visibilityState === 'hidden') {
                if (!warned) {
                    setWarned(true);
                    alert('⚠️ Switching tabs will end your exam if done again!');
                } else {
                    endExamDueToViolation('Tab switch during exam');
                }
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [warned]);

    const endExamDueToViolation = async (reason) => {
        try {
            setIsBlocked(true);
            setMessage('🚫 You violated the exam rules. Exam ended.');

            await axiosInstance.post('/api/submit-exam', {
                examId,
                studentId,
                answers,
                endedDueToViolation: true
            }, { withCredentials: true });
        } catch (err) {
            console.error('Failed to submit exam after violation:', err);
        }

        try {
            await axiosInstance.post('/api/log-exam-violation', {
                examId,
                studentId,
                reason
            }, { withCredentials: true });
        } catch (err) {
            console.error('Failed to log violation:', err);
        }
    };


    const handleChange = (qIndex, value) => {
        setAnswers(prev => ({ ...prev, [qIndex]: value }));
    };

    const handleCheckboxChange = (qIndex, value) => {
        const current = answers[qIndex] || [];
        const updated = current.includes(value)
            ? current.filter(v => v !== value)
            : [...current, value];

        setAnswers(prev => ({ ...prev, [qIndex]: updated }));
    };

    const handleSubmit = async () => {
        try {
            await axiosInstance.post('/api/submit-exam', {
                examId,
                studentId,
                answers
            }, { withCredentials: true });

            setMessage('✅ Exam submitted!');
            onFinish();
        } catch (err) {
            console.error('Submit error:', err);
            const errorMsg = err?.response?.data?.message || '❌ Failed to submit exam.';
            setMessage(errorMsg);
        }
    };

    if (!exam) return <div className="exam-container"><p>⌛ Loading exam...</p></div>;
    if (isBlocked) return <div className="exam-container"><p className="error-msg">{message}</p></div>;

    return (
        <div className="exam-container">
            <h1 className="exam-title">📝 {exam.title}</h1>
            <h3 className="exam-subject">📚 Subject: {exam.subject}</h3>

            {exam.questions.map((q, qIndex) => (
                <div key={qIndex} className="exam-question">
                    <p className="question-text"><strong>❓ Question {qIndex + 1}:</strong> {q.questionText}</p>

                    {q.type === 'multiple' ? (
                        <div className="checkbox-group">
                            {q.answers.map((a, aIndex) => (
                                <label key={aIndex} className="answer-option">
                                    <input
                                        type="checkbox"
                                        checked={(answers[qIndex] || []).includes(a.text)}
                                        onChange={() => handleCheckboxChange(qIndex, a.text)}
                                    />
                                    <span>🗳️ {a.text}</span>
                                </label>
                            ))}
                        </div>
                    ) : (
                        <textarea
                            className="open-answer"
                            placeholder="✍️ Type your answer here..."
                            value={answers[qIndex] || ''}
                            onChange={(e) => handleChange(qIndex, e.target.value)}
                        />
                    )}
                </div>
            ))}

            <button className="submit-btn" onClick={handleSubmit}>📨 Submit Exam</button>
            {message && <p className="feedback-msg">{message}</p>}
        </div>
    );
};

export default Exam;
