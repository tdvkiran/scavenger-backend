const User = require('../models/userModel');


const logout = async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => {
            return token.token !== req.token; //removing particular
        })

        await req.user.save();

        res.send('you are logged out');
    } catch (e) {
        res.status(500).send('error in logging out');
    }
}

const login = async (req, res) => {
    try {
        console.log('login')
        const user = await User.findByCredential(req.body.branchName, req.body.password);
        console.log('user');
        const token = await user.generateAuthToken();
        console.log('token');
        res.send({ user, token });
    }
    catch (err) {
        res.status(400).send(err);
    }
}

module.exports = {
    login,
    logout
}