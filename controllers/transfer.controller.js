const { v4: uuidv4 } = require('uuid');

const get = async (req, res) => {
    const assetID = req.params.assetID;

    const exist = await global.contract.evaluateTransaction('AssetExists', assetID);
    if (exist.toString() === 'false') {
        return res.json({ success: false, msg: 'asset do not exist' });
    }

    const result = await global.contract.evaluateTransaction('ReadAsset', assetID);
    return res.json(JSON.parse(result));
}

const getAll = async (req, res) => {
    const result = await global.contract.evaluateTransaction('GetAllAssets');

    return res.json(JSON.parse(result));
}

const create = async (req, res) => {
    const { ProductName, Owner, AppraisedValue } = req.body;

    const ID = uuidv4();
    const ProductLot = new Date().getTime().toString();
    let result = await global.contract.submitTransaction('CreateAsset', ID, ProductName, ProductLot, Owner, AppraisedValue);

    result = await global.contract.evaluateTransaction('ReadAsset', ID);

    return res.json(JSON.parse(result));
}


const update = async (req, res) => {
    const { ID, ProductName, Owner, AppraisedValue } = req.body;

    const exist = await global.contract.evaluateTransaction('AssetExists', ID);
    if (exist.toString() === 'false') {
        return res.json({ success: false, msg: 'asset do not exist' });
    }

    const { ProductLot } = JSON.parse(await global.contract.evaluateTransaction('ReadAsset', ID));

    let result = await global.contract.submitTransaction('UpdateAsset', ID, ProductName, ProductLot, Owner, AppraisedValue);

    result = await global.contract.evaluateTransaction('ReadAsset', ID);

    return res.json(JSON.parse(result));
}

const trans = async (req, res) => {
    const { ID, newOwner } = req.body;

    const exist = await global.contract.evaluateTransaction('AssetExists', ID);
    if (exist.toString() === 'false') {
        return res.json({ success: false, msg: 'asset do not exist' });
    }

    let result = await contract.submitTransaction('TransferAsset', ID, newOwner);

    result = await global.contract.evaluateTransaction('ReadAsset', ID);

    return res.json(JSON.parse(result));
}

module.exports = { get, getAll, create, update, trans };