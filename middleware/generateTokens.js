require("dotenv").config();
const con = require("../dbConnection");
const jwt = require("jsonwebtoken");

function generateAccessToken(userEmail, res) {
  const token = jwt.sign(
    { email: userEmail },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_EXPIRY,
    }
  );
  return res.json({
    accessToken: token,
    expiresIn: new Date(Date.now() + Number(process.env.ACCESS_EXPIRY_MS)),
  });
}

function generateRefreshToken(userEmail, res) {
  const token = jwt.sign(
    { email: userEmail },
    process.env.REFRESH_TOKEN_SECRET
  );
  con.query("INSERT INTO tokens VALUES (?)", token);
  return res.cookie("token", token, { httpOnly: true });
}

module.exports = {
  generateAccessToken: generateAccessToken,
  generateRefreshToken: generateRefreshToken,
};
