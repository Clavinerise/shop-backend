const bcrypt = require("bcrypt");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../middleware/generateTokens");
const validateEmail = require("../services/validateEmail");
const emailExists = require("../services/emailExistence");
const queryPromise = require("../services/queryPromise");

const profile = async (req, res) => {
  try {
    let user = await queryPromise(
      `SELECT customer_id FROM customer WHERE email=?`,
      req.user.email
    );
    if (Object.keys(req.body).length) {
      const queryString = `UPDATE customer SET ? WHERE customer_id=?`;
      await queryPromise(queryString, [req.body, user[0].customer_id]);
    }
    const output = await queryPromise(
      `SELECT * FROM customer
        WHERE customer_id=?`,
      user[0].customer_id
    );
    res.send(output);
  } catch (err) {
    res.status(500).send(err);
  }
};

const login = async (req, res) => {
  const query = `SELECT * FROM customer WHERE email = ?`;
  const user = await queryPromise(query, req.body.email);
  if (user.length == 0) {
    res.status(401).send("Invalid email");
    return;
  }
  try {
    if (await bcrypt.compare(req.body.pw, user[0].pw)) {
      let userEmail = user[0].email;
      await generateRefreshToken(userEmail, res);
      await generateAccessToken(userEmail, res);
      return;
    } else {
      res.status(401).send("Wrong Password");
    }
  } catch (err) {
    res.status(500).send(err);
  }
};

const register = async (req, res) => {
  if (!validateEmail.validate(req.body.email)) {
    res.status(400).send({ error: "Invalid email" });
    return;
  }
  if (await emailExists(req.body.email)) {
    res.status(400).send({ error: "Email already exists" });
    return;
  }
  try {
    const hashedPassword = await bcrypt.hash(req.body.pw, 10);
    const user = [
      req.body.fname,
      req.body.lname,
      req.body.email,
      hashedPassword,
      req.body.phone,
      req.body.address,
    ];
    let query = `INSERT INTO customer (fname, lname, email, pw, phone, address) VALUES (?)`;
    await queryPromise(query, user);
    res.status(200).send("Successfully Registered!");
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports = { profile: profile, login: login, register: register };
