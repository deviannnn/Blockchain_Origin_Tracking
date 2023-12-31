const express = require('express');
const router = express.Router();

const controller = require('../controllers/transfer.controller');

router.get('/get/:assetID', controller.get);
router.get('/getAll', controller.getAll);
router.post('/create', controller.create);
router.post('/trans', controller.trans);
router.put('/update', controller.update);

module.exports = router;