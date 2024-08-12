// db.js
const sql = require('mssql');

// Database configuration using environment variables
const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  server: process.env.DB_SERVER + '.database.windows.net', // Azure SQL Server domain
  database: process.env.DB_NAME,
  options: {
    encrypt: true, // Encrypt data in transit for Azure SQL
  },
};

// Connect to the database
sql.connect(config, (err) => {
  if (err) {
    console.error('Database connection failed:', err.message);
  } else {
    console.log('Connected to Azure SQL Database.');
  }
});

module.exports = sql;
