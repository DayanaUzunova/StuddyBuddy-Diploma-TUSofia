import React, { useState } from 'react';
import '../../../../style/cardGameBuilder.css';
import axiosInstance from '../../../../api/api';
import { useNavigate } from 'react-router-dom';

const CardGameBuilder = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('');
  const [cards, setCards] = useState([
    { question: '', correctAnswer: '', wrongAnswers: ['', ''] }
  ]);
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();

  const subjectOptions = [
    'Math', 'Science', 'History', 'Geography',
    'Language', 'Art', 'Music', 'Technology'
  ];

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
      if (!title.trim()) {
        setFormError('❗ Please enter a game title.');
        return;
      }

      if (!subject.trim()) {
        setFormError('❗ Please select a subject.');
        return;
      }

      if (cards.length < 2) {
        setFormError('❗ Please add at least 2 flashcards.');
        return;
      }

      for (let i = 0; i < cards.length; i++) {
        const { question, correctAnswer, wrongAnswers } = cards[i];
        if (!question.trim() || !correctAnswer.trim() || wrongAnswers.some(w => !w.trim())) {
          setFormError(`❗ Fill in all fields for card #${i + 1}.`);
          return;
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
        type: 'card'
      };

      await axiosInstance.post('/api/create-game', gameData, { withCredentials: true });

      setSuccessMessage('✅ Thank you for creating a game! It’s now awaiting admin approval.');
      setFormError('');

      // Optionally reset form
      setTitle('');
      setSubject('');
      setDescription('');
      setCards([{ question: '', correctAnswer: '', wrongAnswers: ['', ''] }]);

    } catch (error) {
      console.error('Error creating game:', error);
      setFormError('❗ Failed to save the game. Please try again later.');
    }
  };

  return (
    <div className="card-game-builder container">
      <h1>🃏 Create a Flashcard Game</h1>

      <div className="builder-section">
        <label>🎮 Game Title</label>
        <input
          type="text"
          value={title}
          placeholder="e.g. French Vocabulary - Basics"
          onChange={(e) => setTitle(e.target.value)}
        />

        <label>🗂️ Subject</label>
        <select
          className="dropdown"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        >
          <option value="">Select a subject</option>
          {subjectOptions.map((subj) => (
            <option key={subj} value={subj}>{subj}</option>
          ))}
        </select>

        <label>📝 Description</label>
        <textarea
          className="description-textarea"
          placeholder="e.g. This game helps beginners learn essential French words."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="builder-section">
        <h2>🃏 Cards</h2>
        {cards.map((card, index) => (
          <div className="card-entry" key={index}>
            <input
              type="text"
              placeholder="❓ Question"
              value={card.question}
              onChange={(e) => handleCardChange(index, 'question', e.target.value)}
            />
            <input
              type="text"
              placeholder="✅ Correct Answer"
              value={card.correctAnswer}
              onChange={(e) => handleCardChange(index, 'correctAnswer', e.target.value)}
            />
            {card.wrongAnswers.map((wrong, i) => (
              <input
                key={i}
                type="text"
                placeholder={`❌ Wrong Answer ${i + 1}`}
                value={wrong}
                onChange={(e) => handleCardChange(index, 'wrongAnswers', e.target.value, i)}
              />
            ))}
            {cards.length > 1 && (
              <button className="remove-btn" onClick={() => removeCard(index)}>✖</button>
            )}
          </div>
        ))}
        <button className="add-btn" onClick={addCard}>➕ Add Card</button>
      </div>

      {formError && (
        <div className="form-error">{formError}</div>
      )}

      {successMessage && (
        <div className="form-success">{successMessage}</div>
      )}

      <div className="builder-actions">
        <button className="primary-btn" onClick={handleSubmit}>💾 Save Game</button>
      </div>
    </div>
  );
};

export default CardGameBuilder;
