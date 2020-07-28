const express = require("express");
const con = require("../dbConnection");
let router = express.Router();

router.delete("/", async (req, res) => {
  try {
    await con.query(
      `DELETE FROM tokens WHERE token=?`,
      [req.cookies.token],
      (err, result) => {
        res.send("Successfully logged out");
      }
    );
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
