const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { poolPromise } = require('../db');

// Login route
router.post('/login', async function(req, res, next) {
  try {
    const { username, password } = req.body;
    const pool = await poolPromise;

    // Fetch user from the database
    const result = await pool.request()
      .input('username', username)
      .query('SELECT * FROM Users WHERE Username = @username');

    const user = result.recordset[0];

    if (user && await bcrypt.compare(password, user.PasswordHash)) {
      req.session.user = { username: user.Username };
      res.redirect('/dashboard');
    } else {
      res.render('index', { 
        title: 'Login / Sign Up',
        error: 'Invalid username or password',
        username,
        email: '', 
        userLoggedIn: false,
        opportunities: [] 
      });
    }
  } catch (err) {
    next(err);
  }
});

router.post('/signup', async function(req, res, next) {
    try {
      const { username, email, password } = req.body;
      const pool = await poolPromise;
  
      // Check if the username or email already exists
      const userCheck = await pool.request()
        .input('username', username)
        .input('email', email)
        .query('SELECT * FROM Users WHERE Username = @username OR Email = @email');
  
      if (userCheck.recordset.length > 0) {
        // Username or email already exists
        return res.render('index', {
          title: 'Login / Sign Up',
          error: 'Username or email already exists',
          username,
          email,
          userLoggedIn: false,
          opportunities: [] 
        });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Insert the new user into the database
      await pool.request()
        .input('username', username)
        .input('email', email)
        .input('password', hashedPassword)
        .query('INSERT INTO Users (Username, Email, PasswordHash) VALUES (@username, @email, @password)');
  
      // Optionally, you can start a session or handle as needed
      req.session.user = { username };
  
      // Render the signup.ejs page
      res.render('signup', { 
        title: 'Welcome!', 
        username,
        email 
      });
    } catch (err) {
      next(err);
    }
  });
  

module.exports = router;
