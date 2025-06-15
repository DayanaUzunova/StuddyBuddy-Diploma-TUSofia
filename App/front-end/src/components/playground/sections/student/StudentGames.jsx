import React, { useEffect, useState } from 'react';
import '../../../../style/studentGames.css'; // Create this CSS file
import axiosInstance from '../../../../api/api';

const StudentGames = ({ setActiveSection, setGameId }) => {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchGames = async () => {
        try {
            const response = await axiosInstance.get('/api/games', { withCredentials: true });

            if (!response) {
                throw new Error("Cannot find any games at this time!");
            }

            setGames(response?.data.filter(game => game.isApproved));
        } catch (error) {
            console.error('Error fetching games:', error);
        } finally {
            setLoading(false);
        };
    };


    useEffect(() => {
        fetchGames();
    }, []);

    const handleGameClick = (gameId) => {
        setActiveSection('CardGame');
        setGameId(gameId);
    };

    const flashcardGames = games.filter((game) => game?.type === 'card');
    const quizGames = games.filter((game) => game?.type === 'quiz');

    return (
        <div className="student-games container">
            <section className="hero">
                <h1>🎯 Explore Games</h1>
                <p>Choose a game below to test your knowledge and have fun while learning!</p>
            </section>

            {loading ? (
                <p className="loading">⏳ Loading games...</p>
            ) : (
                <>
                    <section className="game-section">
                        <h2>🃏 Flashcard Games</h2>
                        <div className="game-grid">
                            {flashcardGames?.length > 0 ? (
                                flashcardGames.map((game) => (
                                    <div
                                        key={game?._id}
                                        className="game-card"
                                        onClick={() => handleGameClick(game?._id)}
                                    >
                                        <h3>{game?.title}</h3>
                                        <p>{game?.subject}</p>
                                        <p className="desc">{game?.description || 'No description provided.'}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="empty">No flashcard games available.</p>
                            )}
                        </div>
                    </section>

                    <section className="game-section">
                        <h2>✍️ Quiz Games</h2>
                        <div className="game-grid">
                            {quizGames?.length > 0 ? (
                                quizGames?.map((game) => (
                                    <div
                                        key={game?._id}
                                        className="game-card"
                                        onClick={() => handleGameClick(game?._id)}
                                    >
                                        <h3>{game?.title}</h3>
                                        <p>{game?.subject}</p>
                                        <p className="desc">{game?.description || 'No description provided.'}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="empty">No quiz games available.</p>
                            )}
                        </div>
                    </section>
                </>
            )}
        </div>
    );
};

export default StudentGames;
