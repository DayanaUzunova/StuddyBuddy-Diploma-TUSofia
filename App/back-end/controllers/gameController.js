const Game = require('../models/Game');

const createGame = async (req, res) => {
    try {
        const { title, subject, description, cards } = req.body;
        const userId = req.user?.id;

        if (!title || !subject || !userId || !cards || cards.length < 2) {
            return res.status(400).json({ message: 'Missing required fields or insufficient cards.' });
        }

        for (let i = 0; i < cards.length; i++) {
            const card = cards[i];
            if (!card.question.trim() || !card.answer.trim()) {
                return res.status(400).json({ message: `❗ Card #${i + 1} is missing a question or answer.` });
            }
        }

        const newGame = new Game({
            title,
            subject,
            description,
            cards,
            createdBy: userId,
            isApproved: false
        });

        const savedGame = await newGame.save();
        res.status(201).json(savedGame);
    } catch (err) {
        console.error('Error creating game:', err);
        res.status(500).json({ message: err });
    };
};

const getMyGames = async (req, res) => {
    try {
        const userId = req.user.id;

        if (!userId) {
            throw new Error('Invalid user id in getMyGames!');
        };

        const games = await Game.find({ createdBy: userId });

        res.status(200).json(games);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err });
    }
};

const editCardGame = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, subject, description, cards } = req.body;

        if (!title || !subject || !cards || !Array.isArray(cards)) {
            return res.status(400).json({ message: 'Missing or invalid game data.' });
        };

        const updatedGame = await Game.findByIdAndUpdate(
            id,
            { title, subject, description, cards },
            { new: true }
        );

        if (updatedGame.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to edit this game.' });
        };

        if (!updatedGame) {
            return res.status(404).json({ message: 'Game not found.' });
        };

        res.status(200).json(updatedGame);
    } catch (err) {
        console.error('Error editing game:', err);
        res.status(500).json({ message: 'Failed to update game.' });
    }
};

const deleteCardGame = async (req, res) => {
    try {
        const gameId = req?.params?.id;

        if (!gameId) {
            throw new Error('Invalid game id!');
        };

        const deletedGame = await Game.findByIdAndDelete(gameId);

        if (!deletedGame) {
            throw new Error('Game not found!');
        };

        res.status(200).json({ message: 'Game deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err });
    }
};

module.exports = {
    createGame,
    getMyGames,
    editCardGame,
    deleteCardGame
};
