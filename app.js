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
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
