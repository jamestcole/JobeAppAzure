const express = require('express');
const router = express.Router();
const { poolPromise } = require('../db'); // Import the database connection pool

// GET Home Page with Login
router.get('/', (req, res) => {
  res.render('index', { title: 'Login Page' });
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

