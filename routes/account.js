const express = require('express');
const router = express.Router();

const controller = require('../controllers/account.controller');

router.get('/login', controller.login);
router.get('/register', controller.register);
router.post('/logout', controller.logout);
router.get('/get/:username', controller.get);
router.get('/getAssetsByAccount/:username', controller.getAssetsByAccount);

module.exports = router;