var express = require('express');
var router = express.Router();
const sql = require('../db'); // Import the database connection

/* GET home page. */
router.get('/', function(req, res, next) {
  const textToReplaceSubtitleWith = process.env.TEXT_TO_REPLACE_SUBTITLE_WITH || 'Default Subtitle Text';
  
  // Query the database
  sql.query`SELECT TOP 10 * FROM your_table_name`
    .then(result => {
      // Render the index page with the retrieved data
      res.render('index', { 
        subTitle: textToReplaceSubtitleWith, 
        title: 'Hello World!', 
        data: result.recordset // Pass the data to the view
      });
    })
    .catch(err => {
      console.error('SQL error:', err);
      next(err); // Pass the error to the error handler
    });
});

module.exports = router;