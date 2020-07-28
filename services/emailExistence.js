const queryPromise = require("./queryPromise");

async function emailExists(email) {
  let user = await queryPromise(
    `SELECT customer_id FROM customer WHERE email=?`,
    email
  );
  if (user.length) {
    return true;
  } else {
    return false;
  }
}

module.exports = emailExists;
