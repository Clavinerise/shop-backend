var con = require("../dbConnection.js");
var mysql = require("mysql");

function queryPromise(query, args) {
  return new Promise((resolve, reject) => {
    con.query(query, [args], (err, result, fields) => {
      if (err) {
        queryString = mysql.format(query, [args]);
        console.log(queryString);
        con.query(queryString, (err, result, fields) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      } else {
        resolve(result);
      }
    });
  });
}

module.exports = queryPromise;
