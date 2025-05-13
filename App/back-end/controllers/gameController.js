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
        res.status(500).json({ message: 'Server error while creating game.' });
    };
};

module.exports = {
    createGame
};
