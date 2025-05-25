const Conversation = require('../models/Conversations');

const createConversation = async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const conversation = new Conversation({
            title,
            description,
            createdBy: req.user.id,
        });

        await conversation.save();

        res.status(201).json(conversation);
    } catch (err) {
        console.error('Create Conversation Error:', err);
        res.status(500).json({ message: 'Failed to create conversation' });
    }
};

const deleteConversation = async (req, res) => {
    try {
        const { id } = req.params;

        const conversation = await Conversation.findById(id);

        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found.' });
        }

        if (String(conversation.createdBy) !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this conversation.' });
        }

        await Conversation.findByIdAndDelete(id);

        res.status(200).json({ message: 'Conversation deleted successfully.' });
    } catch (err) {
        console.error('Delete Conversation Error:', err);
        res.status(500).json({ message: 'Server error. Could not delete conversation.' });
    }
};


const closeConversation = async (req, res) => {
    try {
        const { id } = req.params;

        const conversation = await Conversation.findById(id);

        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found.' });
        }

        if (String(conversation.createdBy) !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to close this conversation.' });
        }

        if (conversation.isClosed) {
            return res.status(400).json({ message: 'Conversation is already closed.' });
        }

        conversation.isClosed = true;
        await conversation.save();

        res.status(200).json({ message: 'Conversation closed successfully.', conversation });
    } catch (err) {
        console.error('Close Conversation Error:', err);
        res.status(500).json({ message: 'Server error. Could not close conversation.' });
    }
};



const getConversations = async (req, res) => {
    try {
        const conversations = await Conversation.find()
            .sort({ createdAt: -1 })
            .populate('createdBy', 'username');

        res.status(200).json(conversations);
    } catch (err) {
        console.error('Get Conversations Error:', err);
        res.status(500).json({ message: 'Failed to get conversations' });
    }
};

const addComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { text } = req.body;

        if (!text || !text.trim()) {
            return res.status(400).json({ message: 'Comment cannot be empty.' });
        }

        const conversation = await Conversation.findById(id);
        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found.' });
        }

        if (conversation.isClosed) {
            return res.status(403).json({ message: 'This conversation is closed.' });
        }

        const newComment = {
            text: text.trim(),
            userId: req.user._id,
            username: req.user.username || 'Anonymous'
        };

        conversation.comments.push(newComment);
        await conversation.save();

        res.status(201).json({ message: 'Comment added successfully.', conversation });
    } catch (err) {
        console.error('Add Comment Error:', err);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

const getConversation = async (req, res) => {
    try {
        const { id } = req.params;

        const conversation = await Conversation.findById(id).populate('createdBy', 'username').populate('comments.userId', 'username');

        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found.' });
        }

        res.status(200).json(conversation);
    } catch (err) {
        console.error('Get Conversation Error:', err);
        res.status(500).json({ message: 'Internal server error.' });
    }
};


module.exports = {
    createConversation,
    deleteConversation,
    closeConversation,
    getConversations,
    addComment,
    getConversation
};