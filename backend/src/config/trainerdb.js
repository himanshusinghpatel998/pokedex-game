// config/trainerDb.js

const mysql = require("mysql2");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "127.0.0.1",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "railway",
  port: process.env.DB_PORT || 3306,

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000,
});

// Test Connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error("Trainer Database Connection Failed");
    console.error(err);
  } else {
    console.log("Connected to Trainer MySQL Database");
    connection.release();
  }
});

module.exports = pool.promise();