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
        const { username } = req.body;
        const pool = await poolPromise;
  
        // Check if the username already exists
        const userCheck = await pool.request()
            .input('username', username)
            .query('SELECT * FROM Users WHERE Username = @username');
  
        if (userCheck.recordset.length > 0) {
                // Username already exists
            return res.render('index', {
                title: 'Login / Sign Up',
                error: 'Username already exists. Please choose another username.',
                username,
                email: '',  // Email left empty since this check is before email input
                userLoggedIn: false,
                opportunities: [] 
            });
        }
        // Optionally, you can start a session or handle as needed
        req.session.user = { username };
        // Username doesn't exist, render signup page
        res.render('signup', {
          title: 'Complete Your Registration',
          username,
          email: '',  // Email can be left empty or passed from index.ejs if available
        });
      // Render the signup.ejs page

    } catch (err) {
      next(err);
    }
  });
  

module.exports = router;
