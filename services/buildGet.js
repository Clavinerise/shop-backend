// use this for select statements, "WHERE key=value"

const mysql = require("mysql");
function buildConditions(query, args) {
  let keys = [];
  let values = [];
  for (const key in args) {
    keys.push(key + "=?");
    values.push(args[key]);
  }
  if (keys.length) {
    statement = query + " WHERE " + keys.join(" AND ");
  } else {
    statement = query;
  }
  return { query: statement, values: values };
}

module.exports = buildConditions;
