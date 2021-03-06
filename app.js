const express = require('express');
const path = require('path');
const logger = require('morgan');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const session = require("express-session");
const index = require('./routes/index');
const usersController = require('./routes/usersController');
const itemsController = require('./routes/itemsController');
const passport = require("./helpers/passport.js");
const LocalStrategy = require("passport-local").Strategy;
const auth = require('./helpers/auth.js');
const bcrypt = require('bcrypt');
const flash = require('connect-flash');
const MongoStore = require("connect-mongo")(session);
const apiController = require("./routes/apiController");
const dashboardController = require("./routes/dashboardController");

const dotenv = require('dotenv');

dotenv.config();
dotenv.load();
const app = express();

mongoose.connect(process.env.MONGODB_URI);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(expressLayouts);
app.set('layout', 'layouts/main-layout');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(__dirname + '/public/favicon.ico'));


//session and passport
app.use(session({
  secret: "our-passport-local-strategy-app",
  resave: true,
  saveUninitialized: true
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(auth.setAPIkey);
app.use(auth.setCurrentUser);


app.use('/', index);
app.use("/", dashboardController);
app.use('/items', itemsController);
app.use('/users', usersController);
app.use("/api", apiController);


// catch 404 and forward to error handler
app.use((req, res, next) =>{
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
