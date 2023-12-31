const Account = require('../models/account');
const bcrypt = require('bcrypt');

const register = async (req, res) => {
    const { gmail, password, name, address, role } = req.body;

    try {
        const hashedPassword = bcrypt.hashSync(password, 10);

        const newAccount = new Account({
            gmail: gmail,
            password: hashedPassword,
            name: name,
            address: address,
            role: role
        });

        await newAccount.save();

        return res.status(201).json({ success: true, msg: 'Account registered successfully.', account: newAccount });
    } catch (error) {
        return res.status(500).json({ success: false, msg: 'Internal Server Error' });
    }
}

const login = async (req, res, next) => {
    const { username, password } = req.body;

    try {
        const account = await Account.findOne({ gmail: username });

        if (!account || !bcrypt.compareSync(password, account.password)) {
            return res.status(400).json({ success: false, msg: 'Invalid username or password.' });
        }

        req.session.account = account;

        return res.status(200).json({ success: true });
    } catch (error) {
        return res.status(500).json({ success: false, msg: 'Internal Server Error' });
    }
}

const logout = (req, res) => {
    const token = req.cookies['jwt'];

    revokedTokens.add(token);

    res.clearCookie('jwt');
    return res.redirect('/');
};

module.exports = { register, login, logout };