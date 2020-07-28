const express = require("express");
require("dotenv").config();
const con = require("../dbConnection");
const jwt = require("jsonwebtoken");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../middleware/generateTokens");

let router = express.Router();

router.post("/", async (req, res) => {
  try {
    const refreshToken = req.cookies.token;
    await con.query(
      `SELECT * FROM tokens WHERE token=?`,
      [refreshToken],
      (err, result) => {
        if (result.length) {
          jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            (err, user) => {
              generateAccessToken(user.email, res);
            }
          );
        } else {
          res.status(403).send("Not valid token");
        }
      }
    );
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
