import React, { useState } from 'react';
import '../../../../style/examBuilder.css';
import axiosInstance from '../../../../api/api';

const subjectOptions = ['Math', 'Science', 'History', 'Language', 'Geography'];

const ExamBuilder = ({ courseId, onBackToCourse, existingExam }) => {
  const [title, setTitle] = useState(existingExam?.title || '');
  const [subject, setSubject] = useState(existingExam?.subject || '');
  const [questions, setQuestions] = useState(
    existingExam?.questions?.length > 0
      ? existingExam.questions
      : [
        {
          questionText: '',
          type: 'multiple',
          points: 1,
          answers: [
            { text: '', isCorrect: false },
            { text: '', isCorrect: false }
          ]
        }
      ]
  );
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    if (field === 'type' && value === 'open') {
      updated[index].answers = [];
    } else if (field === 'type' && value === 'multiple' && updated[index].answers.length === 0) {
      updated[index].answers = [
        { text: '', isCorrect: false },
        { text: '', isCorrect: false }
      ];
    }
    setQuestions(updated);
  };

  const handleAnswerChange = (qIndex, aIndex, value) => {
    const updated = [...questions];
    updated[qIndex].answers[aIndex].text = value;
    setQuestions(updated);
  };

  const toggleCorrect = (qIndex, aIndex) => {
    const updated = [...questions];
    updated[qIndex].answers[aIndex].isCorrect = !updated[qIndex].answers[aIndex].isCorrect;
    setQuestions(updated);
  };

  const deleteAnswer = (qIndex, aIndex) => {
    const updated = [...questions];
    updated[qIndex].answers.splice(aIndex, 1);
    setQuestions(updated);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: '',
        type: 'multiple',
        points: 1,
        answers: [
          { text: '', isCorrect: false },
          { text: '', isCorrect: false }
        ]
      }
    ]);
  };

  const deleteQuestion = (index) => {
    const updated = [...questions];
    updated.splice(index, 1);
    setQuestions(updated);
  };

  const addAnswer = (qIndex) => {
    const updated = [...questions];
    updated[qIndex].answers.push({ text: '', isCorrect: false });
    setQuestions(updated);
  };

  const handleSubmit = async () => {
    setFormError('');
    setSuccessMessage('');

    if (!title.trim() || !subject.trim()) {
      return setFormError('❗ Please fill in title and subject.');
    }

    if (!courseId) {
      return setFormError('❗ Missing course ID.');
    }

    try {
      const examData = {
        title,
        subject,
        questions,
        courseId,
      };

      if (existingExam && existingExam._id) {
        await axiosInstance.put(`/api/exams/edit/${existingExam._id}`, examData, { withCredentials: true });
        setSuccessMessage('✅ Exam updated!');
      } else {
        await axiosInstance.post('/api/create-exam', examData, { withCredentials: true });
        setSuccessMessage('✅ Exam created!');
      }
    } catch (err) {
      console.error(err);
      setFormError('❌ Failed to submit exam.');
    }
  };

  const totalPoints = questions.reduce((sum, q) => sum + (parseInt(q.points) || 0), 0);

  return (
    <div className="exam-builder container">
      <h1>📝 Create Exam 📚</h1>

      <div className="builder-section">
        <label>📘 Exam Title</label>
        <input
          type="text"
          value={title}
          placeholder="e.g. Final Test"
          onChange={(e) => setTitle(e.target.value)}
        />

        <label>📂 Subject</label>
        <select value={subject} onChange={(e) => setSubject(e.target.value)} className="dropdown">
          <option value="">Select a subject</option>
          {subjectOptions.map((subj) => (
            <option key={subj} value={subj}>{subj}</option>
          ))}
        </select>
      </div>

      <div className="builder-section">
        <h2>❓ Questions</h2>
        {questions.map((q, qIndex) => (
          <div key={qIndex} className="question-block">
            <div className="question-header">
              <label>🧠 Question {qIndex + 1}</label>
              <button className="delete-btn" onClick={() => deleteQuestion(qIndex)}>🗑️ Delete</button>
            </div>

            <textarea
              placeholder={`Write question ${qIndex + 1}`}
              value={q.questionText}
              onChange={(e) => handleQuestionChange(qIndex, 'questionText', e.target.value)}
            />

            <label>🏅 Points</label>
            <input
              type="number"
              min="0"
              value={q.points || ''}
              onChange={(e) => handleQuestionChange(qIndex, 'points', parseInt(e.target.value) || 1)}
              className="points-input"
            />

            <label>🧩 Type</label>
            <select value={q.type} onChange={(e) => handleQuestionChange(qIndex, 'type', e.target.value)} className="dropdown">
              <option value="multiple">🗳️ Multiple Choice</option>
              <option value="open">🗣️ Open Answer</option>
            </select>

            {q.type === 'multiple' ? (
              <>
                {q.answers.map((a, aIndex) => (
                  <div key={aIndex} className="answer-row">
                    <input
                      type="text"
                      placeholder={`Answer ${aIndex + 1}`}
                      value={a.text}
                      onChange={(e) => handleAnswerChange(qIndex, aIndex, e.target.value)}
                    />
                    <label className="correct-label">
                      <input
                        type="checkbox"
                        checked={a.isCorrect}
                        onChange={() => toggleCorrect(qIndex, aIndex)}
                      />
                      <span>✅ Correct</span>
                    </label>
                    <button className="delete-btn small" onClick={() => deleteAnswer(qIndex, aIndex)}>🗑️</button>
                  </div>
                ))}
                <button className="add-btn" onClick={() => addAnswer(qIndex)}>➕ Add Answer</button>
              </>
            ) : (
              <p className="open-answer-hint">✍️ Student will write a free-text answer.</p>
            )}
          </div>
        ))}

        <button className="add-btn" onClick={addQuestion}>➕ Add Question</button>
      </div>

      <p className="total-points">🎯 Total Points: <strong>{totalPoints}</strong></p>

      {formError && <p className="form-error">{formError}</p>}
      {successMessage && <p className="form-success">{successMessage}</p>}

      <div className="builder-actions">
        <button className="primary-btn" onClick={handleSubmit}>💾 Save Exam</button>
        {onBackToCourse && (
          <button className="back-btn" onClick={onBackToCourse}>⬅️ Back</button>
        )}
      </div>
    </div>
  );
};

export default ExamBuilder;
