import React, { useState } from 'react';
import '../../../../style/cardGameBuilder.css';
import axiosInstance from '../../../../api/api';
import { useNavigate } from 'react-router-dom';

const CardGameBuilder = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('');
  const [cards, setCards] = useState([{ question: '', answer: '' }]);
  const [formError, setFormError] = useState('');

  const navigate = useNavigate();

  const subjectOptions = [
    'Math',
    'Science',
    'History',
    'Geography',
    'Language',
    'Art',
    'Music',
    'Technology'
  ];

  const handleCardChange = (index, field, value) => {
    const updatedCards = [...cards];
    updatedCards[index][field] = value;
    setCards(updatedCards);
    setFormError('');
  };

  const addCard = () => {
    setCards([...cards, { question: '', answer: '' }]);
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
        const card = cards[i];
        if (!card.question.trim() || !card.answer.trim()) {
          setFormError(`❗ Please fill in both the question and answer for card #${i + 1}.`);
          return;
        }
      }

      setFormError('');

      const gameData = {
        title,
        subject,
        description,
        cards
      };

      await axiosInstance.post('/api/create-game', gameData, { withCredentials: true });

      navigate('/playground');

    } catch (error) {
      console.error('Error creating game:', error);
      setFormError('❗ Failed to save the game. Please try again later.');
    };
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
          onChange={(e) => {
            setTitle(e.target.value);
            setFormError('');
          }}
        />

        <label>🗂️ Subject</label>
        <select
          className="dropdown"
          value={subject}
          onChange={(e) => {
            setSubject(e.target.value);
            setFormError('');
          }}
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
          onChange={(e) => {
            setDescription(e.target.value);
            setFormError('');
          }}
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
              placeholder="💡 Answer"
              value={card.answer}
              onChange={(e) => handleCardChange(index, 'answer', e.target.value)}
            />
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

      <div className="builder-actions">
        <button className="primary-btn" onClick={handleSubmit}>💾 Save Game</button>
      </div>
    </div>
  );
};

export default CardGameBuilder;
