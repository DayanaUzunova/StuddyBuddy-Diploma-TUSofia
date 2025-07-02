import React, { useEffect, useState, useRef } from 'react';
import '../../../../style/cardGame.css';
import axiosInstance from '../../../../api/api';

const shuffleAnswers = (correct, wrongs) => {
  const allAnswers = [correct, ...wrongs];
  return allAnswers.sort(() => Math.random() - 0.5);
};

const getTimePerQuestion = (game) => {
  return game?.timePerQuestion != null ? game.timePerQuestion : null;
};

const CardGame = ({ setActiveSection, gameId, setGameId }) => {
  const [game, setGame] = useState(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [timeExpired, setTimeExpired] = useState(false);
  const [incrementDone, setIncrementDone] = useState(false); // New state to avoid multiple increments
  const timerRef = useRef(null);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const res = await axiosInstance.get(`/api/game/${gameId}`, { withCredentials: true });
        setGame(res.data);
        const firstCard = res.data.cards[0];
        setAnswers(shuffleAnswers(firstCard.correctAnswer, firstCard.wrongAnswers));
        setTimeLeft(getTimePerQuestion(res.data));
      } catch (err) {
        console.error('Failed to load game', err);
      }
    };
    fetchGame();
  }, [gameId]);

  useEffect(() => {
    clearInterval(timerRef.current);
    const timePerQuestion = getTimePerQuestion(game);

    if (!selectedAnswer && !showResult && timePerQuestion != null) {
      setTimeLeft(timePerQuestion);

      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setTimeExpired(true);
            handleAnswerTimeout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setTimeLeft(null); // Infinite time
    }

    return () => clearInterval(timerRef.current);
  }, [currentCardIndex, selectedAnswer, game]);

  // Increment gamesPlayedCount once after game completion
  useEffect(() => {
    if (showResult && !incrementDone) {
      const incrementGamesPlayed = async () => {
        try {
          await axiosInstance.post('/api/user/increment-games-played', {}, { withCredentials: true });
          setIncrementDone(true);
          console.log('User gamesPlayedCount incremented.');
        } catch (err) {
          console.error('Failed to increment games played count:', err);
        }
      };

      incrementGamesPlayed();
    }
  }, [showResult, incrementDone]);

  // Achievement unlocking logic (optional, can keep or remove)
  useEffect(() => {
    if (showResult && game) {
      const unlock = async () => {
        try {
          await axiosInstance.post(`/api/achievements/unlock/${game.achievementId}`, {}, { withCredentials: true });
          console.log('Achievement unlocked!');
        } catch (err) {
          console.error('Error unlocking achievement:', err);
        }
      };

      if (game.achievementId && score >= game.cards.length * 0.7) {
        unlock();
      }
    }
  }, [showResult, game]);

  const handleAnswerTimeout = () => {
    setTimeout(() => {
      const nextIndex = currentCardIndex + 1;
      if (nextIndex < game.cards.length) {
        const nextCard = game.cards[nextIndex];
        setCurrentCardIndex(nextIndex);
        setAnswers(shuffleAnswers(nextCard.correctAnswer, nextCard.wrongAnswers));
        setSelectedAnswer(null);
        setTimeLeft(getTimePerQuestion(game));
        setTimeExpired(false);
      } else {
        setShowResult(true);
      }
    }, 1200);
  };

  const handleAnswerClick = (answer) => {
    clearInterval(timerRef.current);
    setSelectedAnswer(answer);

    if (answer === game.cards[currentCardIndex].correctAnswer) {
      setScore((prev) => prev + 1);
    }

    setTimeout(() => {
      const nextIndex = currentCardIndex + 1;
      if (nextIndex < game.cards.length) {
        const nextCard = game.cards[nextIndex];
        setCurrentCardIndex(nextIndex);
        setAnswers(shuffleAnswers(nextCard.correctAnswer, nextCard.wrongAnswers));
        setSelectedAnswer(null);
        setTimeLeft(getTimePerQuestion(game));
        setTimeExpired(false);
      } else {
        setShowResult(true);
      }
    }, 900);
  };

  const handlePlayAgain = () => {
    setCurrentCardIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    const firstCard = game.cards[0];
    setAnswers(shuffleAnswers(firstCard.correctAnswer, firstCard.wrongAnswers));
    setShowResult(false);
    setTimeLeft(getTimePerQuestion(game));
    setTimeExpired(false);
    setIncrementDone(false); // Reset increment flag for new game
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
        <button className="secondary-btn" onClick={() => setActiveSection('CourseGames')}>🏠 Back to Games</button>
      </div>
    );
  }

  const currentCard = game.cards[currentCardIndex];

  return (
    <div className="card-game-play">
      <h2>{game.title}</h2>
      <p className="card-question">{currentCard.question}</p>

      {timeLeft !== null && <div className="timer">⏳ Time Left: {timeLeft} sec</div>}

      <div className="answers-grid">
        {answers.map((answer, idx) => {
          const isCorrect = answer === currentCard.correctAnswer;
          const isSelected = answer === selectedAnswer;

          let btnClass = 'answer-btn';
          if (selectedAnswer || timeExpired) {
            if (isCorrect) btnClass += ' correct';
            else if (isSelected) btnClass += ' wrong';
            else btnClass += ' disabled';
          }

          return (
            <button
              key={idx}
              className={btnClass}
              disabled={!!selectedAnswer || timeExpired}
              onClick={() => handleAnswerClick(answer)}
            >
              {answer}
            </button>
          );
        })}
      </div>

      {timeExpired && (
        <div className="timeout-section">
          <p className="timeout-msg">⏰ Time’s up!</p>
          <button className="secondary-btn" onClick={() => setActiveSection('CourseGames')}>
            🏠 Back to Games
          </button>
        </div>
      )}

      <div className="progress">
        Question {currentCardIndex + 1} / {game.cards.length}
      </div>
    </div>
  );
};

export default CardGame;
