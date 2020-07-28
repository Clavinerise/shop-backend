const express = require("express");
const mysql = require("mysql");
const buildConditions = require("../services/buildGet");
const queryPromise = require("../services/queryPromise");
const authenticateToken = require("../middleware/authenticateToken");

let router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
  try {
    let user = await queryPromise(
      `SELECT customer_id FROM customer WHERE email=?`,
      req.user.email
    );
    let queryString = `SELECT o.*, oi.* 
    FROM sorder AS o 
    RIGHT JOIN order_item AS oi 
    ON o.order_id = oi.order_id`;
    let args = req.body;
    args[`o.customer_id`] = user[0].customer_id;
    let query = buildConditions(queryString, args);
    console.log(query);
    let output = await queryPromise(query.query, query.values);
    res.json(output);
  } catch (err) {
    res.send(err);
  }
});

router.post("/", authenticateToken, async (req, res) => {
  try {
    let user = await queryPromise(
      `SELECT customer_id, address FROM customer WHERE email=?`,
      req.user.email
    );

    let cart_id = await queryPromise(
      `SELECT cart_id 
      FROM cart 
      WHERE customer_id=? AND ordered_bool=0`,
      user[0].customer_id
    );
    let address = req.body.order_address
      ? req.body.order_address
      : user[0].address;
    await queryPromise(
      `UPDATE cart SET ordered_bool=1 WHERE cart_id=?`,
      cart_id[0].cart_id
    );
    detailsQuery = mysql.format(
      `UPDATE sorder 
      SET payment_method=?, order_address=?
      WHERE order_id=?`,
      [req.body.payment_method, address, cart_id[0].cart_id]
    );
    await queryPromise(detailsQuery);

    let order = await queryPromise(
      `SELECT oi.*, o.*
      FROM order_item AS oi
      LEFT JOIN sorder as o
      ON oi.order_id = o.order_id
      WHERE o.order_id=?`,
      cart_id[0].cart_id
    );
    res.send(order);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
