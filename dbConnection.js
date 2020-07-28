const mysql = require("mysql");
require("dotenv").config();

var con = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

con.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("Connected!");
});

module.exports = con;
