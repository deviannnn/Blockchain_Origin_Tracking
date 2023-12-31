const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const logger = require('morgan');
const mongoose = require('mongoose');
require('dotenv').config();

const database = require('./configs/database')
const { hbsEngine } = require('./configs/handlebars')
const indexRouter = require('./routes/index');

const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const { buildCAClient, registerAndEnrollUser, enrollAdmin } = require('../fabric-samples/test-application/javascript/CAUtil.js');
const { buildCCPOrg1, buildWallet } = require('../fabric-samples/test-application/javascript/AppUtil.js');

const channelName = process.env.CHANNEL_NAME || 'mychannel';
const chaincodeName = process.env.CHAINCODE_NAME || 'basic';

const mspOrg1 = 'Org1MSP';
const walletPath = path.join(__dirname, 'wallet');
const org1UserId = 'javascriptAppUser';

const app = express();

// database setup
switch (app.get('env')) {
  case 'development':
    mongoose.connect(database.development.connectionString).then(() => console.log('Connected Development DB!'));
    break;
  case 'production':
    mongoose.connect(database.production.connectionString).then(() => console.log('Connected Production DB!'));
    break;
  default:
    throw new Error('Unknown execution environment ' + app.get('env'));
}

async function main() {
  try {
    const ccp = buildCCPOrg1();

    const caClient = buildCAClient(FabricCAServices, ccp, 'ca.org1.example.com');

    const wallet = await buildWallet(Wallets, walletPath);

    await enrollAdmin(caClient, wallet, mspOrg1);
    await registerAndEnrollUser(caClient, wallet, mspOrg1, org1UserId, 'org1.department1');

    const gateway = new Gateway();

    await gateway.connect(ccp, {
      wallet,
      identity: org1UserId,
      discovery: { enabled: true, asLocalhost: true }
    });

    const network = await gateway.getNetwork(channelName);

    global.contract = network.getContract(chaincodeName);

    await global.contract.submitTransaction('InitLedger');
  } catch (error) {
    console.log(`******** FAILED to run the application: ${error}`);
    throw new Error();
  }
}

main().then(() => {
  console.log(`Connected Fabric`);
});

// view engine setup
app.engine('handlebars', hbsEngine);
app.set('view engine', 'handlebars');

// common setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({ secret: process.env.SESSION_KEY, resave: false, saveUninitialized: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;