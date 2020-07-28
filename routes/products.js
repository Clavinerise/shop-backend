const express = require("express");
const queryPromise = require("../services/queryPromise");
const buildConditions = require("../services/buildGet");
const mysql = require("mysql");
const authenticateToken = require("../middleware/authenticateToken");
const verifyAdmin = require("../middleware/verifyAdmin");
let router = express.Router();

router.get("/", async (req, res) => {
  try {
    let queryString = `SELECT p.*, c.cat_name 
    FROM product as p 
    LEFT JOIN category as c 
    ON p.cat_id = c.cat_id`;
    let query = buildConditions(queryString, req.query);
    const output = await queryPromise(query.query, query.values);
    res.json(output);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post("/", authenticateToken, verifyAdmin, async (req, res) => {
  try {
    let queryString = `INSERT INTO product SET ?`;
    // let query = buildConditions(queryString, req);
    const output = await queryPromise(queryString, req.body);
    res.send(output);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.put("/", authenticateToken, verifyAdmin, async (req, res) => {
  try {
    let queryString = `UPDATE product SET ? WHERE product_id=?`;
    const output = await queryPromise(queryString, [
      req.body,
      req.body.product_id,
    ]);
    res.send(output);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.delete("/", authenticateToken, verifyAdmin, async (req, res) => {
  try {
    let queryString = `DELETE product FROM product`;
    let query = buildConditions(queryString, req.query);
    const output = await queryPromise(query.query, query.values);
    res.json(output);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
