import React, { useState } from 'react';
import '../../../../style/cardGameControl.css';
import axiosInstance from '../../../../api/api';

const CardGameControl = ({ game, onBack, onUpdate }) => {
    const [title, setTitle] = useState(game.title);
    const [subject, setSubject] = useState(game.subject);
    const [description, setDescription] = useState(game.description);
    const [cards, setCards] = useState(game.cards);

    const handleCardChange = (index, field, value) => {
        const updated = [...cards];
        updated[index][field] = value;
        setCards(updated);
    };

    const handleAddCard = () => {
        setCards([...cards, { question: '', answer: '' }]);
    };

    const handleRemoveCard = (index) => {
        setCards(cards.filter((_, i) => i !== index));
    };

    const handleSave = async () => {
        try {
            const payload = { title, subject, description, cards };
            const response = await axiosInstance.post(`/api/games/edit/${game._id}`, payload, {
                withCredentials: true,
            });
            console.log('Game updated:', response.data);
            onUpdate?.(); // Refresh game list
            onBack();     // Go back to list
        } catch (error) {
            console.error('Failed to save game:', error);
        }
    };

    const handleDelete = async () => {
        try {
            if (!window.confirm('Are you sure you want to delete this game?')) return;

            await axiosInstance.post(`/api/games/delete/${game._id}`, {}, {
                withCredentials: true,
            });

            onUpdate?.(); // Refresh game list
            onBack();     // Go back to list
        } catch (error) {
            console.error('Failed to delete game:', error);
        }
    };

    return (
        <div className="card-game-builder">
            <h1>🛠️ Edit Game</h1>

            <div className="builder-section">
                <label>🎮 Game Title</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} type="text" />

                <label>🗂️ Subject</label>
                <input value={subject} onChange={(e) => setSubject(e.target.value)} type="text" />

                <label>📝 Description</label>
                <textarea
                    className="description-textarea"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <label>🃏 Cards</label>
                {cards.map((card, index) => (
                    <div key={index} className="card-entry">
                        <input
                            type="text"
                            placeholder="❓ Question"
                            value={card.question}
                            onChange={(e) => handleCardChange(index, 'question', e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="✅ Answer"
                            value={card.answer}
                            onChange={(e) => handleCardChange(index, 'answer', e.target.value)}
                        />
                        <button className="remove-btn" onClick={() => handleRemoveCard(index)}>🗑️</button>
                    </div>
                ))}

                <button className="add-btn" onClick={handleAddCard}>➕ Add Card</button>
            </div>

            <div className="builder-actions">
                <button className="action-btn primary-btn" onClick={handleSave}>💾 Save Game</button>
                <button className="action-btn primary-btn" onClick={onBack}>🔙 Back</button>
                <button className="action-btn danger-btn" onClick={handleDelete}>🗑️ Delete Game</button>
            </div>
        </div>
    );
};

export default CardGameControl;
