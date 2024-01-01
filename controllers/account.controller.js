const Account = require('../models/account');
const bcrypt = require('bcrypt');

const register = async (req, res) => {
    const { gmail, password, name, address, role } = req.body;
    const existAcc = await Account.findOne({ gmail });
    if (existAcc) {
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
    const { username, password } = req.body;

    try {
        const account = await Account.findOne({ gmail: username });

        if (!account || !bcrypt.compareSync(password, account.password)) {
            return res.json({ success: false, msg: 'Invalid username or password.' });
        }

        req.session.account = account;

        return res.json({ success: true });
    } catch (error) {
        return res.json({ success: false, msg: 'Internal Server Error.' });
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
    if (account) {
        return res.status(200).json({ success: true, msg: 'Get account successfully.', account });
    }
    return res.status(201).json({ success: true, msg: 'Account does not exist.', account });
};

const getAssetsByAccount = async (req, res) => {
    try {
        const account = await Account.findOne({ gmail: req.params.username });
        let assets = [];
        const assetPromises = account.assets.map(async (assetID) => {
            try {
                const asset = await global.contract.evaluateTransaction('ReadAsset', assetID);
                assets.push(JSON.parse(asset));
            } catch (e) {
                console.log(`Asset with ID ${assetID} does not exist.`);
                account.assets = account.assets.filter((ID) => {
                    return ID !== assetID;
                })
            }
        });
        await Promise.all(assetPromises);
        account.save();

        return res.status(200).json({ success: true, msg: `Get all assets by account successfully.`, assets });
    } catch (e) {
        return res.status(500).json({ success: false, msg: 'Internal Server Error.' });
    }
}

module.exports = { register, login, logout, get, getAssetsByAccount };