var createError = require('http-errors');
var express = require('express');
var cors = require('cors');
const rateLimit = require("express-rate-limit");
 
// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
// see https://expressjs.com/en/guide/behind-proxies.html
// app.set('trust proxy', 1);


var path = require('path');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var logger = require('./configs/winston');
const stream = {
  write: message => {
      logger.info(message)
  }
}

const pingService = require('./services/pingService')
pingService.init();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var pingRouter = require('./routes/ping');

var app = express();

const dotenv = require('dotenv');
dotenv.config();
if (process.env.NODE_ENV === 'development') {
  app.use(cors());
} else {
  app.use(cors({origin:"http://test.myserverdown.com"}));
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(morgan('combined', {stream}))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

let limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 1 // limit each IP to 1 requests per windowMs
});
if (process.env.NODE_ENV === 'development') {
  limiter = rateLimit({
    windowMs: 30 * 1000, // 30 seconds
    max: 1 // limit each IP to 1 requests per windowMs
  });
} else if (process.env.NODE_ENV === 'test') {
  limiter = rateLimit({
    windowMs: 1 * 1000, // 1 seconds
    max: 1000
  });
}
app.post('/users', limiter);

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/ping', pingRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
