const bcrypt = require("bcrypt");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../middleware/generateTokens");
const buildConditions = require("../services/buildGet");
const queryPromise = require("../services/queryPromise");

let login = async (req, res) => {
  const query = `SELECT * FROM admin_acc WHERE email = ?`;
  const user = await queryPromise(query, req.body.email);
  if (user.length == 0) {
    res.status(403).send("Cannot find user");
    return;
  }
  try {
    if (await bcrypt.compare(req.body.pw, user[0].pw)) {
      let userEmail = user[0].email;
      await generateRefreshToken(userEmail, res);
      await generateAccessToken(userEmail, res);
      return;
    } else {
      res.status(403).send("Wrong Password");
    }
  } catch (err) {
    res.status(500).send(err);
  }
};

let register = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.pw, 10);
    const user = [req.body.email, hashedPassword];
    let query = `INSERT INTO admin_acc (email, pw) VALUES (?)`;
    await queryPromise(query, user);
    res.status(200).send("Successfully Registered!");
  } catch (err) {
    res.status(500).send(err);
  }
};

let getOrdersAdmin = async (req, res) => {
  try {
    let queryString = `SELECT o.*, oi.* 
        FROM sorder AS o 
        RIGHT JOIN order_item AS oi 
        ON o.order_id = oi.order_id`;
    let query = buildConditions(queryString, req.query);
    let output = await queryPromise(query.query, query.values);
    res.json(output);
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports = {
  login: login,
  register: register,
  getOrdersAdmin: getOrdersAdmin,
};
