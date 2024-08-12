const express = require('express');
const router = express.Router();
const { poolPromise } = require('../db'); // Import the database connection pool

/* GET home page. */
router.get('/', async function(req, res, next) {
  try {
    const pool = await poolPromise; // Get the connection pool
    const result = await pool.request()
      .query('SELECT * FROM Users'); // Replace with your actual query

    const textToReplaceSubtitleWith = process.env.TEXT_TO_REPLACE_SUBTITLE_WITH || 'Default Subtitle Text';
    
    // Render the view with data
    res.render('index', {
      subTitle: textToReplaceSubtitleWith,
      title: 'Hello World!',
      data: result.recordset // Pass data to the view
    });
  } catch (err) {
    next(err); // Pass errors to the error handler
  }
});

module.exports = router;

