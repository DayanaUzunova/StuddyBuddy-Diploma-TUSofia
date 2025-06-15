import React, { useState, useEffect } from 'react';
import '../../../../style/cardGameBuilder.css';
import axiosInstance from '../../../../api/api';

const CardGameBuilder = ({ courseId, game, onBackToCourse }) => {
  const isEditing = !!game;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('');
  const [timePerQuestion, setTimePerQuestion] = useState(15);
  const [hasTimer, setHasTimer] = useState(true);
  const [isChallenge, setIsChallenge] = useState(false);
  const [cards, setCards] = useState([{ question: '', correctAnswer: '', wrongAnswers: ['', ''] }]);
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const subjectOptions = [
    'Math', 'Science', 'History', 'Geography',
    'Language', 'Art', 'Music', 'Technology'
  ];

  useEffect(() => {
    if (isEditing && game) {
      setTitle(game.title || '');
      setDescription(game.description || '');
      setSubject(game.subject || '');
      setTimePerQuestion(game.timePerQuestion || 15);
      setHasTimer(!!game.timePerQuestion);
      setIsChallenge(game.isChallenge || false);
      setCards(game.cards || [{ question: '', correctAnswer: '', wrongAnswers: ['', ''] }]);
    }
  }, [game]);

  const handleCardChange = (index, field, value, wrongIndex = null) => {
    const updatedCards = [...cards];
    if (field === 'wrongAnswers' && wrongIndex !== null) {
      updatedCards[index].wrongAnswers[wrongIndex] = value;
    } else {
      updatedCards[index][field] = value;
    }
    setCards(updatedCards);
    setFormError('');
  };

  const addCard = () => {
    setCards([...cards, { question: '', correctAnswer: '', wrongAnswers: ['', ''] }]);
  };

  const removeCard = (index) => {
    const updatedCards = [...cards];
    updatedCards.splice(index, 1);
    setCards(updatedCards);
  };

  const handleSubmit = async () => {
    try {
      if (!title.trim()) return setFormError('❗ Please enter a game title.');
      if (!subject.trim()) return setFormError('❗ Please select a subject.');
      if (cards.length < 2) return setFormError('❗ Please add at least 2 flashcards.');

      if (hasTimer && (!timePerQuestion || timePerQuestion < 5)) {
        return setFormError('❗ Time per question must be at least 5 seconds.');
      }

      for (let i = 0; i < cards.length; i++) {
        const { question, correctAnswer, wrongAnswers } = cards[i];
        if (!question.trim() || !correctAnswer.trim() || wrongAnswers.some(w => !w.trim())) {
          return setFormError(`❗ Fill in all fields for card #${i + 1}.`);
        }
      }

      const formattedCards = cards.map(card => ({
        question: card.question,
        correctAnswer: card.correctAnswer,
        wrongAnswers: card.wrongAnswers
      }));

      const gameData = {
        title,
        subject,
        description,
        cards: formattedCards,
        type: 'card',
        courseId,
        timePerQuestion: hasTimer ? parseInt(timePerQuestion) : null,
        isChallenge
      };

      if (isEditing) {
        await axiosInstance.post(`/api/games/edit/${game._id}`, gameData, { withCredentials: true });
        setSuccessMessage('✅ Game updated!');
      } else {
        await axiosInstance.post('/api/create-game', gameData, { withCredentials: true });
        setSuccessMessage('✅ Game created and linked to course!');
      }

      setFormError('');

      setTimeout(() => {
        onBackToCourse?.();
      }, 1500);
    } catch (error) {
      console.error('Error saving game:', error);
      setFormError('❗ Failed to save the game. Please try again later.');
    }
  };

  return (
    <div className="card-game-builder container">
      <h1>{isEditing ? '✏️ Edit Flashcard Game' : '🃏 Create a Flashcard Game'}</h1>

      <div className="builder-section">
        <label>🎮 Game Title</label>
        <input type="text" value={title} placeholder="e.g. French Vocabulary" onChange={(e) => setTitle(e.target.value)} />

        <label>🗂️ Subject</label>
        <select className="dropdown" value={subject} onChange={(e) => setSubject(e.target.value)}>
          <option value="">Select a subject</option>
          {subjectOptions.map((subj) => (
            <option key={subj} value={subj}>{subj}</option>
          ))}
        </select>

        <label>📝 Description</label>
        <textarea
          className="description-textarea"
          placeholder="e.g. This game helps beginners learn essential vocabulary."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={hasTimer}
              onChange={(e) => setHasTimer(e.target.checked)}
            />
            ⏱️ Enable Timer Per Question
          </label>
          <label>
            <input
              type="checkbox"
              checked={isChallenge}
              onChange={(e) => setIsChallenge(e.target.checked)}
            />
            🏆 Mark as Challenge
          </label>
        </div>

        {hasTimer && (
          <>
            <label>⏲️ Time per Question (seconds)</label>
            <input
              type="number"
              min="5"
              value={timePerQuestion}
              onChange={(e) => setTimePerQuestion(e.target.value)}
              placeholder="e.g. 15"
            />
          </>
        )}
      </div>

      <div className="builder-section">
        <h2>🃏 Cards</h2>
        {cards.map((card, index) => (
          <div className="card-entry" key={index}>
            <input type="text" placeholder="❓ Question" value={card.question} onChange={(e) => handleCardChange(index, 'question', e.target.value)} />
            <input type="text" placeholder="✅ Correct Answer" value={card.correctAnswer} onChange={(e) => handleCardChange(index, 'correctAnswer', e.target.value)} />
            {card.wrongAnswers.map((wrong, i) => (
              <input key={i} type="text" placeholder={`❌ Wrong Answer ${i + 1}`} value={wrong} onChange={(e) => handleCardChange(index, 'wrongAnswers', e.target.value, i)} />
            ))}
            {cards.length > 1 && (
              <button className="remove-btn" onClick={() => removeCard(index)}>✖</button>
            )}
          </div>
        ))}
        <button className="add-btn" onClick={addCard}>➕ Add Card</button>
      </div>

      {formError && <div className="form-error">{formError}</div>}
      {successMessage && <div className="form-success">{successMessage}</div>}

      <div className="builder-actions">
        <button className="primary-btn" onClick={handleSubmit}>
          {isEditing ? '💾 Update Game' : '💾 Save Game'}
        </button>
      </div>

      {onBackToCourse && (
        <button className="back-btn" onClick={onBackToCourse}>⬅️ Back</button>
      )}
    </div>
  );
};

export default CardGameBuilder;
