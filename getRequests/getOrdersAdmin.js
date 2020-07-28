const express = require("express");
const queryPromise = require("../utils/queryPromise");
const buildConditions = require("./buildGet");
const authenticateToken = require("../middleware/authenticateToken");
const verifyAdmin = require("../middleware/verifyAdmin");

let router = express.Router();

router.get("/ordersAdmin", authenticateToken, verifyAdmin, async (req, res) => {
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
});

module.exports = router;
