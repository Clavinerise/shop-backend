const queryPromise = require("../services/queryPromise");
const { query } = require("../dbConnection");
async function verifyAdmin(req, res, next) {
  const queryString = `SELECT * FROM admin_acc WHERE email=?`;
  try {
    const admin = await queryPromise(queryString, req.user.email);
    if (!admin.length) {
      res.status(403).send("Not an admin");
      return;
    } else {
      next();
    }
  } catch (err) {
    res.status(500).send(err);
  }
}

module.exports = verifyAdmin;
