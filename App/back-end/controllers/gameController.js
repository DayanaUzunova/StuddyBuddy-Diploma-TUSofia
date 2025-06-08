const Course = require('../models/Course');
const Game = require('../models/Game');


const createGame = async (req, res) => {
    try {
        const { title, subject, type, description, cards, courseId } = req.body;
        const userId = req.user?.id;

        if (!title || !subject || !type || !cards || !Array.isArray(cards) || !userId || !courseId) {
            return res.status(400).json({ message: 'Missing required fields.' });
        }

        for (const card of cards) {
            if (
                !card.question || !card.correctAnswer ||
                !Array.isArray(card.wrongAnswers) || card.wrongAnswers.length !== 2
            ) {
                return res.status(400).json({ message: 'Invalid card format.' });
            }
        }

        const newGame = new Game({
            title,
            subject,
            type,
            description,
            cards,
            createdBy: userId,
            isApproved: false
        });

        const savedGame = await newGame.save();

        // 🔗 Link to course
        await Course.findByIdAndUpdate(courseId, {
            $addToSet: { games: savedGame._id }
        });

        res.status(201).json(savedGame);
    } catch (err) {
        console.error('Error creating game:', err);
        res.status(500).json({ message: 'Server error while creating game.' });
    }
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
        }

        for (const card of cards) {
            if (
                !card.question || !card.correctAnswer ||
                !Array.isArray(card.wrongAnswers) || card.wrongAnswers.length !== 2
            ) {
                return res.status(400).json({ message: 'Invalid card format.' });
            }
        }

        const updatedGame = await Game.findById(id);
        if (!updatedGame) {
            return res.status(404).json({ message: 'Game not found.' });
        }

        if (updatedGame.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to edit this game.' });
        }

        updatedGame.title = title;
        updatedGame.subject = subject;
        updatedGame.description = description;
        updatedGame.cards = cards;

        const savedGame = await updatedGame.save();
        res.status(200).json(savedGame);
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

const getGames = async (req, res) => {
    try {
        const games = await Game.find({ isApproved: true }).sort({ createdAt: -1 });
        res.status(200).json(games);
    } catch (err) {
        console.error('Error fetching games:', err);
        res.status(500).json({ message: 'Server error while fetching games.' });
    }
};

const getCardGame = async (req, res) => {
    try {
        const gameId = req?.params?.gameId;

        if (!gameId) {
            return res.status(400).json({ message: 'Invalid or missing game ID.' });
        }

        const game = await Game.findById(gameId);

        if (!game) {
            return res.status(404).json({ message: 'Game not found.' });
        }

        res.status(200).json(game);
    } catch (err) {
        console.error('Error fetching game:', err);
        res.status(500).json({ message: 'Server error while fetching card game.' });
    }
};

const approveGame = async (req, res) => {
    try {
        const { id } = req.params;

        const updatedGame = await Game.findByIdAndUpdate(
            id,
            { isApproved: true },
            { new: true }
        );

        if (!updatedGame) {
            return res.status(404).json({ message: "Game not found" });
        }

        res.status(200).json(updatedGame);
    } catch (err) {
        console.error("Error approving game:", err);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    createGame,
    getMyGames,
    editCardGame,
    deleteCardGame,
    getGames,
    getCardGame,
    approveGame
};
