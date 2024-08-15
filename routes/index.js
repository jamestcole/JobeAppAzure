const express = require('express');
const router = express.Router();
const { poolPromise, sql } = require('../db'); // Import the database connection pool
const auth = require('../middleware/auth'); // Import the authentication middleware
const bcrypt = require('bcryptjs');
/* GET home page with login and opportunities. */
router.get('/', async function(req, res, next) {
  try {
    const pool = await poolPromise;

    // Fetch opportunities from the database
    const opportunitiesResult = await pool.request()
      .query('SELECT * FROM Opportunities');

    // Check if user is logged in
    const userLoggedIn = req.session && req.session.user;
    const userName = userLoggedIn ? req.session.user.username : '';
    
    // Default values for username and email
    const username = req.session && req.session.user ? req.session.user.username : '';
    const email = req.session && req.session.user ? req.session.user.email : '';

    // Render the view with opportunities data
    res.render('index', {
      title: 'Home Page',
      userLoggedIn: !!userLoggedIn, // Boolean indicating if the user is logged in
      userName: userName,
      username: username,
      email: email,
      opportunities: opportunitiesResult.recordset
    });
  } catch (err) {
    next(err);
  }
});

router.post('/auth', async function(req, res, next) {
  try {
    const { username, email, password, actionType } = req.body;

    if (actionType === 'login') {
      // Handle login logic
    } else if (actionType === 'signup') {
      // Handle signup logic
      // Ensure fields are validated and processed appropriately
    }

    // Redirect or respond as needed
  } catch (err) {
    next(err);
  }
});


// Route for the signup page
router.get('/signup', (req, res) => {
  // Extract data from query parameters
  const { username, email } = req.query;

  // Render the signup page with pre-filled data
  res.render('signup', {
      username: username || '',
      email: email || ''
  });
});

/* POST signup logic */
router.post('/signup', async (req, res, next) => {
  try {
    const { username, password, age, sex, status } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Get a connection from the pool
    const pool = await poolPromise;

    // Insert new user into the database
    await pool.request()
      .input('Username', sql.NVarChar, username)
      .input('Password', sql.NVarChar, hashedPassword)
      .input('Age', sql.Int, age)
      .input('Sex', sql.NVarChar, sex)
      .input('Status', sql.NVarChar, status)
      .query(`
        INSERT INTO Users (Username, Password, Age, Sex, Status)
        VALUES (@Username, @Password, @Age, @Sex, @Status)
      `);

    // Redirect to login page after successful signup
    res.redirect('/Signup');
  } catch (err) {
    console.error('Signup failed:', err);
    next(err); // Forward error to the error handler
  }
});
// POST Login Logic
router.post('/login', async (req, res, next) => {
  const { username, password } = req.body;

  // Dummy authentication logic - replace with your actual logic
  if (username === 'testuser' && password === 'password') {
    req.session.user = { username: username }; // Set session user
    res.redirect('/dashboard'); // Redirect to dashboard after login
  } else {
    res.redirect('/'); // Redirect back to home if login fails
  }
});



// GET Dashboard Page
router.get('/dashboard', auth, async (req, res, next) => {
  try {
    const pool = await poolPromise;
    const userId = req.session.user.id; // Assuming user ID is stored in session

    // Fetch opportunities
    const opportunitiesResult = await pool.request().query('SELECT * FROM Opportunities');
    
    // Fetch user-specific applications
    const applicationsResult = await pool.request()
      .input('userId', sql.Int, userId)
      .query('SELECT * FROM Applications WHERE UserId = @userId');

    // Fetch user-specific listings
    const listingsResult = await pool.request()
      .input('userId', sql.Int, userId)
      .query('SELECT * FROM Listings WHERE UserId = @userId');

    // Pass the data to the dashboard view
    res.render('dashboard', {
      title: 'User Dashboard',
      opportunities: opportunitiesResult.recordset,
      applications: applicationsResult.recordset,
      listings: listingsResult.recordset,
      user: req.session.user // Make sure user info is available for the view
    });
  } catch (err) {
    next(err);
  }
});

// Additional routes for Opportunities, Applications, Listings, and New Opportunity
// Example route for opportunities
router.get('/opportunities', async (req, res, next) => {
  try {
    const pool = await poolPromise;
    const opportunitiesResult = await pool.request().query('SELECT * FROM Opportunities');
    res.render('opportunities', { title: 'Opportunities', opportunities: opportunitiesResult.recordset });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

