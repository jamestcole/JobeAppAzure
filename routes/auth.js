var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');
const { poolPromise } = require('../db'); // Adjust path as needed
// Mock login and signup functions (replace with real logic)
async function loginUser(username, password) {
    // Replace with actual authentication logic
    if (username === 'test' && password === 'password') {
        return { success: true, username };
    }
    return { success: false, error: 'Invalid credentials' };
}

async function signupUser(username, email, password) {
    // Replace with actual signup logic
    return { success: true, username };
}
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
      // Password is correct
      req.session.user = { username: user.Username };
      res.redirect('/dashboard');
    } else {
      // Invalid credentials
      res.redirect('/'); // Redirect to home or login with an error message
    }
  } catch (err) {
    next(err);
  }
});

// Signup route
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
      return res.redirect('/'); // Redirect to home or signup with an error message
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    await pool.request()
      .input('username', username)
      .input('email', email)
      .input('password', hashedPassword)
      .query('INSERT INTO Users (Username, Email, PasswordHash) VALUES (@username, @email, @password)');

    // Redirect to login page or automatically log in the user
    req.session.user = { username };
    res.redirect('/dashboard');
  } catch (err) {
    next(err);
  }
});
router.post('/auth', async function (req, res, next) {
    const { username, email, password, actionType } = req.body;

    try {
        if (actionType === 'login') {
            const result = await loginUser(username, password);
            if (result.success) {
                req.session.user = { username: result.username };
                res.redirect('/dashboard');
            } else {
                res.render('index', { 
                    title: 'Login / Sign Up', 
                    error: result.error, 
                    username, 
                    email, 
                    userLoggedIn: false,
                    opportunities: []  // Add your opportunities data here
                });
            }
        } else if (actionType === 'signup') {
            const result = await signupUser(username, email, password);
            if (result.success) {
                req.session.user = { username: result.username };
                res.redirect('/dashboard');
            } else {
                res.render('index', { 
                    title: 'Login / Sign Up', 
                    error: result.error, 
                    username, 
                    email, 
                    userLoggedIn: false,
                    opportunities: []  // Add your opportunities data here
                });
            }
        } else {
            res.redirect('/');
        }
    } catch (err) {
        next(err); // Pass the error to the error handler
    }
});
module.exports = router;
