import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../../../style/cardGame.css';
import axiosInstance from '../../../../api/api';

const shuffleAnswers = (correct, wrongs) => {
    const allAnswers = [correct, ...wrongs];
    return allAnswers.sort(() => Math.random() - 0.5);
};

const CardGame = ({ setActiveSection, gameId, setGameId }) => {
    const [game, setGame] = useState(null);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);

    useEffect(() => {
        const fetchGame = async () => {
            try {
                const res = await axiosInstance.get(`/api/game/${gameId}`, { withCredentials: true });
                setGame(res.data);
                setAnswers(shuffleAnswers(
                    res.data.cards[0].correctAnswer,
                    res.data.cards[0].wrongAnswers
                ));
            } catch (err) {
                console.error('Failed to load game', err);
            }
        };
        fetchGame();
    }, [gameId]);

    const handleAnswerClick = (answer) => {
        setSelectedAnswer(answer);

        if (answer === game.cards[currentCardIndex].correctAnswer) {
            setScore(prev => prev + 1);
        }

        setTimeout(() => {
            const nextIndex = currentCardIndex + 1;
            if (nextIndex < game.cards.length) {
                setCurrentCardIndex(nextIndex);
                setAnswers(shuffleAnswers(
                    game.cards[nextIndex].correctAnswer,
                    game.cards[nextIndex].wrongAnswers
                ));
                setSelectedAnswer(null);
            } else {
                setShowResult(true);
            }
        }, 900);
    };

    const handlePlayAgain = () => {
        setCurrentCardIndex(0);
        setScore(0);
        setSelectedAnswer(null);
        setAnswers(shuffleAnswers(
            game.cards[0].correctAnswer,
            game.cards[0].wrongAnswers
        ));
        setShowResult(false);
    };

    if (!game) {
        return <div className="card-game-play">Loading game...</div>;
    }

    if (showResult) {
        return (
            <div className="card-game-play result-screen">
                <h2>🎉 Game Complete!</h2>
                <p>Your Score: <strong>{score}</strong> / {game.cards.length}</p>
                <button className="primary-btn" onClick={handlePlayAgain}>🔁 Play Again</button>
                <button className="secondary-btn" onClick={() => setActiveSection('Games')}>🏠 Back to Games</button>
            </div>
        );
    }

    const currentCard = game.cards[currentCardIndex];

    return (
        <div className="card-game-play">
            <h2>{game.title}</h2>
            <p className="card-question">{currentCard.question}</p>

            <div className="answers-grid">
                {answers.map((answer, idx) => {
                    const isCorrect = answer === currentCard.correctAnswer;
                    const isSelected = answer === selectedAnswer;

                    let btnClass = 'answer-btn';
                    if (selectedAnswer) {
                        if (isCorrect) btnClass += ' correct';
                        else if (isSelected) btnClass += ' wrong';
                        else btnClass += ' disabled';
                    }

                    return (
                        <button
                            key={idx}
                            className={btnClass}
                            disabled={!!selectedAnswer}
                            onClick={() => handleAnswerClick(answer)}
                        >
                            {answer}
                        </button>
                    );
                })}
            </div>

            <div className="progress">
                Question {currentCardIndex + 1} / {game.cards.length}
            </div>
        </div>
    );
};

export default CardGame;
