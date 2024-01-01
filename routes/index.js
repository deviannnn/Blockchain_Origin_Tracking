const express = require('express');
const router = express.Router();

const accountRouter = require('./account');
const transferRouter = require('./transfer');
const auth = require('../middlewares/auth');
const controller = require('../controllers/view.controller');

router.get('/login', controller.loginView);
router.get('/register', controller.registerView);

router.get('/', auth.isLogged, controller.homeView);
router.get('/purchase', auth.isCompany, controller.purchaseView);
router.get('/inventory', auth.isLogged, controller.inventoryView);
router.get('/handle', auth.isFarmer, controller.handleView);

router.use('/account', accountRouter);
router.use('/transfer', auth.isLogged, transferRouter);

module.exports = router;