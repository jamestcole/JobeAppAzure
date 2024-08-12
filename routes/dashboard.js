const express = require('express');
const router = express.Router();
const { poolPromise } = require('../db'); // Import the database connection pool

// Ensure you have session or user validation middleware here

/* GET dashboard page with user-specific data. */
router.get('/dashboard', async function(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/login'); // Redirect to login if no session user
  }

  try {
    const pool = await poolPromise;

    // Fetch user-specific opportunities and other data
    const opportunitiesResult = await pool.request()
      .query('SELECT * FROM Opportunities');

    // Fetch user's applications, listings, etc.
    // const applicationsResult = await pool.request().query('SELECT * FROM Applications WHERE UserID = @UserID', { UserID: req.session.user.id });
    // const listingsResult = await pool.request().query('SELECT * FROM Listings WHERE UserID = @UserID', { UserID: req.session.user.id });

    res.render('dashboard', {
      title: 'Dashboard',
      opportunities: opportunitiesResult.recordset,
      // applications: applicationsResult.recordset,
      // listings: listingsResult.recordset
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
