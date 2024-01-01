const Account = require('../models/account');
const bcrypt = require('bcrypt');

const register = async (req, res) => {
    const { gmail, password, name, address, role } = req.body;
    const existAcc = await Account.findOne({ gmail });
    if(existAcc) {
        return res.status(200).json({ success: false, msg: 'Account\'s already existed.' });
    }

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
        console.log(error.message)
        return res.status(500).json({ success: false, msg: 'Internal Server Error.' });
    }
}

const login = async (req, res, next) => {
    if(req.session.account) {
        console.log("Logged in!!!")
        return res.redirect('/');
    }
    const { username, password } = req.body;

    try {
        const account = await Account.findOne({ gmail: username });

        if (!account || !bcrypt.compareSync(password, account.password)) {
            return res.status(400).json({ success: false, msg: 'Invalid username or password.' });
        }

        req.session.account = account;

        return res.status(200).json({ success: true });
    } catch (error) {
        return res.status(500).json({ success: false, msg: 'Internal Server Error.' });
    }
}

const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
          console.error('Error destroying session:', err);
          res.status(500).send('Internal Server Error.');
        } else {
          res.send('Session cleared successfully.');
        }
    })
    return res.redirect('/');
};

const get = async (req, res) => {
    const account = await Account.findOne({ gmail: req.params.username });
    if(account) {
        return res.status(200).json({ success: true, msg: 'Get account successfully.', account });
    }
    return res.status(201).json({ success: true, msg: 'Account does not exist.', account });
};

const getAssetsByAccount = async (req, res) => {
    const account = await Account.findOne({ gmail: req.params.username });
    let assets = [];

    account.assets.forEach(async (assetID) => {
        try {
            const asset = await global.contract.evaluateTransaction('ReadAsset', assetID);
            assets.push(asset)
        } catch (e) {
            console.log(`Asset with ID ${assetID} does not exist.`)
        }
    });
    
    return res.status(200).json({ success: true, msg: `Get all assets by account successfully.`, assets });
}

module.exports = { register, login, logout, get, getAssetsByAccount };