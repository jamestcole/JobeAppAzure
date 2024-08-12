var express = require('express');
var router = express.Router();
const { poolPromise } = require('../db'); // Import the database connection

/* GET home page. */
router.get('/', async function(req, res, next) {
  try {
    // Fetch data from the database
    const result = await sql.query('SELECT * FROM Users'); // Adjust query as needed

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
