const { v4: uuidv4 } = require('uuid');
const Account = require('../models/account');

const get = async (req, res) => {
    try {
        const assetID = req.params.assetID;
        // removable
        const exist = await global.contract.evaluateTransaction('AssetExists', assetID);
        if (exist.toString() === 'false') {
            return res.json({ success: false, msg: 'Asset does not exist.' });
        }

        const result = await global.contract.evaluateTransaction('ReadAsset', assetID);
        return res.json(JSON.parse(result));
    } catch (e) {
        return res.json({ success: false, msg: 'Cannot get asset.' });
    }
}

const getAll = async (req, res) => {
    try {
        const result = await global.contract.evaluateTransaction('GetAllAssets');
        return res.json(JSON.parse(result));
    } catch (e) {
        return res.json({ success: false, msg: 'Cannot get all assets.' });
    }
}

const create = async (req, res) => {
    try {
        const { ProductName, AppraisedValue } = req.body;
        const Owner = req.session.account;
        const ID = uuidv4();
        const ProductLot = new Date().getTime().toString();

        await global.contract.submitTransaction('CreateAsset', ID, ProductName, ProductLot, Owner.gmail, AppraisedValue);
        const account = await Account.findOne({ gmail: Owner.gmail });
        if (!account.assets.includes(ID)) {
            account.assets.push(ID);
        }
        account.save();

        return res.json(JSON.parse(await global.contract.evaluateTransaction('ReadAsset', ID)));
    } catch (e) {
        return res.json({ success: false, msg: 'Cannot create asset.' });
    }
}


const update = async (req, res) => {
    try {
        const { ID, ProductName, AppraisedValue } = req.body;
        // removable
        const exist = await global.contract.evaluateTransaction('AssetExists', ID);
        if (exist.toString() === 'false') {
            return res.json({ success: false, msg: 'Asset does not exist.' });
        }

        const { Owner, ProductLot } = JSON.parse(await global.contract.evaluateTransaction('ReadAsset', ID));
        await global.contract.submitTransaction('UpdateAsset', ID, ProductName, ProductLot, Owner, AppraisedValue);

        return res.json(JSON.parse(await global.contract.evaluateTransaction('ReadAsset', ID)));
    } catch (e) {
        return res.json({ success: false, msg: 'Cannot update asset.' });
    }
}

const trans = async (req, res) => {
    try {
        const { ID, newOwner } = req.body;
        // removable
        const exist = await global.contract.evaluateTransaction('AssetExists', ID);
        if (exist.toString() === 'false') {
            return res.json({ success: false, msg: 'Asset does not exist.' });
        }

        const { Owner: oldOwner } = JSON.parse(await global.contract.evaluateTransaction('ReadAsset', ID));
        await contract.submitTransaction('TransferAsset', ID, newOwner);

        const newAccount = await Account.findOne({ gmail: newOwner });
        if (!newAccount.assets.includes(ID)) {
            newAccount.assets.push(ID);
        }
        newAccount.save();

        const oldAccount = await Account.findOne({ gmail: oldOwner });
        if (oldAccount.assets.includes(ID)) {
            oldAccount.assets = oldAccount.assets.filter((assetID) => {
                return assetID !== ID;
            })
        }
        oldAccount.save();

        return res.json(JSON.parse(await global.contract.evaluateTransaction('ReadAsset', ID)));
    } catch (e) {
        return res.json({ success: false, msg: 'Cannot transfer asset owner.' });
    }
}

module.exports = { get, getAll, create, update, trans };