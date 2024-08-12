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
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Implement your authentication logic here
  // For now, we'll just set a dummy session
  req.session.user = { username: username };

  // Redirect to home page after login
  res.redirect('/');
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

