var express = require('express');
var router = express.Router();
const { poolPromise } = require('../db'); // Import the database connection

/* GET home page. */
router.get('/', async function(req, res, next) {
  const textToReplaceSubtitleWith = process.env.TEXT_TO_REPLACE_SUBTITLE_WITH || 'Default Subtitle Text';
  
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM YourTable'); // Replace 'YourTable' with your actual table name
    res.render('index', { subTitle: textToReplaceSubtitleWith, title: 'Hello World!', data: result.recordset });
  } catch (err) {
    console.error('Database query failed:', err);
    res.render('index', { subTitle: textToReplaceSubtitleWith, title: 'Hello World!', error: 'Failed to retrieve data' });
  }
});

module.exports = router;
