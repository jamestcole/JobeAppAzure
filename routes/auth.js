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
  
        // Check if the username or email already exists
        const userCheck = await pool.request()
            .input('username', sql.NVarChar, username)
            .input('email', sql.NVarChar, email)
            .query('SELECT * FROM Users WHERE Username = @username OR Email = @email');
  
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
        // If the user doesn't exist, proceed with signup
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user into the database
        await pool.request()
            .input('username', sql.NVarChar, username)
            .input('email', sql.NVarChar, email)
            .input('password', sql.NVarChar, hashedPassword)
            .query('INSERT INTO Users (Username, Email, PasswordHash) VALUES (@username, @email, @password)');

        // Only redirect if the user was successfully created
        if (username && email && password) {
            req.session.user = { username };
            return res.redirect('/signup');
        } else {
            // If something goes wrong, return to index page with an error message
            return res.render('index', {
                title: 'Login / Sign Up',
                error: 'Signup failed. Please try again.',
                username,
                email,
                userLoggedIn: false,
                opportunities: [] // Add your opportunities data here if needed
            });
        }

    } catch (err) {
        // Handle database errors (like the UNIQUE constraint violation)
        console.error('Signup failed:', err);
        return res.render('index', {
            title: 'Login / Sign Up',
            error: 'An error occurred during signup. Please try again.',
            username: '',
            email: '',
            userLoggedIn: false,
            opportunities: [] // Add your opportunities data here if needed
        });
    }
  });
  

module.exports = router;
