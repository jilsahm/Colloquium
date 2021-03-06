var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

var indexRouter = require('./routes/index');
var overviewRouter = require('./routes/overview');
var authRouter = require('./routes/auth');
var detailsRouter = require('./routes/details');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Insert session
app.use(session({
  key: 'admin_uid',
  secret: 'thecolloquium',
  resave: false,
  saveUninitialized: false,
  cookie: {
      expires: 6000000
  }
}));

app.use('/', indexRouter);
app.use('/overview', overviewRouter);
app.use('/auth', authRouter);
app.use('/details', detailsRouter);

// Clear session
app.use((req, res, next) => {
  if (req.cookies.admin_uid && !req.session.admin) {
      res.clearCookie('admin_uid');        
  }
  next();
});

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
