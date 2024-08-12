require('dotenv').config();
const sql = require('mssql');

// Retrieve connection string from environment variable
const config = {
  connectionString: process.env.DB_CONNECTION_STRING,
  options: {
    encrypt: true, // Encrypt data in transit
    trustServerCertificate: false // Set to true if you face certificate issues
  }
};

console.log('Database connection string:', config.connectionString);
// Connect to the database
sql.connect(config).then(() => {
  console.log('Connected to Azure SQL Database.');
}).catch(err => {
  console.error('Database connection failed:', err.message);
});

module.exports = sql;

