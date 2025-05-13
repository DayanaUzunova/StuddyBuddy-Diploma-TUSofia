const User = require('../models/User');
const jwt = require('jsonwebtoken');

const getUserOnLogin = async (email) => {
    try {
        const user = await User.findOne({ email: email });

        if (!user) {
            throw new Error('User not found');
        };

        return user;
    } catch (err) {
        throw err;
    }
};


const authenticateUser = (req, res, next) => {
    try {
        const token = req.cookies.token;
        
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: No token' });
        };
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        next();
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};

module.exports = {
    getUserOnLogin,
    authenticateUser
};