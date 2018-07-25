require('babel-core/register')({
  "presets":["es2015", "react", "stage-1"]
});

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// PROXY
var httpProxy = require('http-proxy');
// REQUEST HANDLER FOR SERVER-SIDE RENDERING
var requestHandler = require('./requestHandler.js');

var app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// PROXY TO API
const apiProxy = httpProxy.createProxyServer({
  target:'http://localhost:3001'
});
app.use('/api', function(req, res){
  apiProxy.web(req, res);
})
//END PROXY TO API

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');

app.use(requestHandler);

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
