const express = require('express');
const router = express.Router();
const { poolPromise } = require('../db'); // Import the database connection pool
const auth = require('../middleware/auth'); // Import the authentication middleware

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

    // Render the view with opportunities data
    res.render('index', {
      title: 'Home Page',
      userLoggedIn: !!userLoggedIn, // Boolean indicating if the user is logged in
      userName: userName,
      opportunities: opportunitiesResult.recordset
    });
  } catch (err) {
    next(err);
  }
});
// POST Login Logic
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Example authentication logic (replace with actual validation)
  if (username === 'testuser' && password === 'password') {
    res.redirect('/dashboard');
  } else {
    res.redirect('/');
  }
});

// GET Dashboard Page
router.get('/dashboard', async (req, res, next) => {
  try {
    const pool = await poolPromise;

    // Fetch opportunities and user-related data
    const opportunitiesResult = await pool.request().query('SELECT * FROM Opportunities');
    // Placeholder for fetching user-specific data
    const user = { name: 'testuser' }; // Replace with actual user fetching logic

    res.render('dashboard', {
      title: 'User Dashboard',
      opportunities: opportunitiesResult.recordset,
      user
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

