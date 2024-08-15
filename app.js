var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const sql = require('mssql');
const router = express.Router();
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// Importing the db.js file to use the poolPromise
const { poolPromise } = require('./db.js');

// Session middleware - should be placed before routes
app.use(session({
  secret: 'your-secret-key', // Replace with a secure secret key
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Session middleware - should be placed before routes
app.use(session({
  secret: 'your-secret-key', // Replace with a secure secret key
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));

app.use(express.static(path.join(__dirname, 'public')));

// Render signup page (optional if you have a signup form in EJS)
router.get('/signup', (req, res) => {
  res.render('signup'); // Make sure you have a signup.ejs file
});

//
app.use('/', indexRouter);
app.use('/users', usersRouter);

// Signup route (moved into indexRouter)
indexRouter.post('/signup', async (req, res, next) => {
  try {
    const { username, password, age, sex, status } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Get a connection from the pool
    const pool = await poolPromise;

    // Insert new user into the database
    await pool.request()
      .input('Username', username)
      .input('Password', hashedPassword)
      .input('Age', age)
      .input('Sex', sex)
      .input('Status', status)
      .query(`
        INSERT INTO Users (Username, Password, Age, Sex, Status)
        VALUES (@Username, @Password, @Age, @Sex, @Status)
      `);

    // Redirect or send response on successful signup
    res.redirect('/login'); // Redirect to login page after signup
  } catch (err) {
    console.error('Signup failed:', err);
    next(err); // Forward error to the error handler
  }
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

