const sql = require('mssql');

// Configuration for the SQL database
const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    encrypt: true, // Use encryption
    trustServerCertificate: false // Trust server certificate
  }
};

// Create a pool connection to the database
const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('Connected to SQL Server');
    return pool;
  })
  .catch(err => {
    console.error('Database connection failed:', err);
    process.exit(1); // Exit process if unable to connect
  });

module.exports = {
  sql,
  poolPromise
};
