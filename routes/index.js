const express = require('express');
const router = express.Router();

const transferRouter = require('./transfer');
const accountRouter = require('./account');

router.use('/transfer', transferRouter);
router.use('/account', accountRouter);

module.exports = router;