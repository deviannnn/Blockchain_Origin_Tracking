const express = require('express');
const router = express.Router();

const controller = require('../controllers/account.controller');
const auth = require('../middlewares/auth');

router.post('/login', controller.login);
router.post('/register', controller.register);
router.post('/logout', controller.logout);
router.get('/get/:username', auth.isLogged, controller.get);
router.get('/getAssetsByAccount/:username', auth.isLogged, controller.getAssetsByAccount);
router.post('/getAssetsByFarmer', auth.isLogged, controller.getAssetsByFarmer);

module.exports = router;