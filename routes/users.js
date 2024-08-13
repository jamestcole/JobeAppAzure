const express = require('express');
const router = express.Router();
const { poolPromise } = require('../db'); // Adjust the path to your database connection module

// GET user profile page
router.get('/profile', async (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/');
  }
  
  try {
    const pool = await poolPromise;
    const userId = req.session.user.id; // Assume user ID is stored in the session
    const userResult = await pool.request()
      .input('id', userId)
      .query('SELECT * FROM Users WHERE Id = @id');
      
    res.render('profile', {
      title: 'User Profile',
      user: userResult.recordset[0]
    });
  } catch (err) {
    next(err);
  }
});

// POST login
router.post('/login', async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const pool = await poolPromise;
    const userResult = await pool.request()
      .input('username', username)
      .input('password', password) // You should hash and compare passwords securely
      .query('SELECT * FROM Users WHERE Username = @username AND Password = @password');
    
    if (userResult.recordset.length > 0) {
      req.session.user = userResult.recordset[0]; // Store user data in session
      res.redirect('/dashboard');
    } else {
      res.redirect('/'); // Redirect to login page or show error
    }
  } catch (err) {
    next(err);
  }
});

// GET logout
router.get('/logout', (req, res, next) => {
  req.session.destroy(err => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

module.exports = router;
