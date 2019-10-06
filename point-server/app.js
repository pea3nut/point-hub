var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes');
var mysql = require('./mysql');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(async function(req,res,next){
  res.set('Access-Control-Allow-Origin',req.headers.origin);
  res.set('Access-Control-Allow-Credentials','true');
  next();
});
app.use(logger('dev'));
app.use(express.json({ type:'*/*' }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(mysql);
app.use('/sdk', express.static(path.join(__dirname, '../sdk')));
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
