const express = require('express');
const router = express.Router();
const { poolPromise } = require('../db'); // Import the database connection pool

/* GET home page with login and opportunities. */
router.get('/', async function(req, res, next) {
  try {
    const pool = await poolPromise;

    // Fetch opportunities from the database
    const opportunitiesResult = await pool.request()
      .query('SELECT * FROM Opportunities');

    // Render the view with opportunities data
    res.render('index', {
      title: 'Login Page',
      opportunities: opportunitiesResult.recordset
    });
  } catch (err) {
    next(err);
  }
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Implement your authentication logic here
  // For now, we'll just send a success message
  res.send(`Login attempted for user: ${username}`);
});

module.exports = router;

