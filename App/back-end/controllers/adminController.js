const Game = require('../models/Game');
const User = require('../models/User');

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, 'firstName lastName email role username'); // only return needed fields

        const formattedUsers = users.map(user => ({
            id: user._id,
            name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
            username: user.username,
            email: user.email,
            role: user.role
        }));

        res.status(200).json(formattedUsers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch users" });
    }
};

const getAllGames = async (req, res) => {
    try {
        const games = await Game.find().sort({ createdAt: -1 });
        res.json(games);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to fetch games' });
    }
};

const updateUser = async (req, res) => {
    const { id } = req.params;
    const { username, role } = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { username, role },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to update user" });
    }
};

// Delete user
const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const deleted = await User.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to delete user" });
    }
};

module.exports = {
    getAllUsers,
    getAllGames,
    updateUser,
    deleteUser
};