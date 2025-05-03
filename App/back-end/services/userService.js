const User = require('../models/User');

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


module.exports = {
    getUserOnLogin
};