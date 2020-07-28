const queryPromise = require("../services/queryPromise");

let getCart = async (req, res) => {
  try {
    let queryString = `SELECT ci.*, c.*
      FROM cart_item as ci 
      LEFT JOIN cart as c 
      ON ci.cart_id = c.cart_id
      LEFT JOIN customer as cust
      ON cust.customer_id = c.customer_id
      WHERE cust.email = ? 
      AND c.ordered_bool=0`;
    const output = await queryPromise(queryString, req.user.email);
    res.json(output);
  } catch (err) {
    res.status(500).send(err);
  }
};

let postCart = async (req, res) => {
  try {
    let user = await queryPromise(
      `SELECT customer_id FROM customer WHERE email=?`,
      req.user.email
    );
    let cart_id = await queryPromise(
      `SELECT cart_id FROM cart WHERE ordered_bool=0 
            AND customer_id=?`,
      user[0].customer_id
    );
    if (cart_id.length) {
      // if there is an existing cart
      cart_id = cart_id[0].cart_id;

      let citem = await queryPromise(
        `SELECT citem_id, qty 
          FROM cart_item WHERE cart_id=? AND product_id=?`,
        [cart_id, req.body.product_id]
      );
      if (citem.length) {
        await queryPromise(
          `UPDATE cart_item
              SET qty=?
              WHERE citem_id=?`,
          [citem[0].qty + req.body.qty, citem[0].citem_id]
        );
      } else {
        await queryPromise(
          `INSERT INTO cart_item (cart_id, product_id, qty)
            VALUES (?)`,
          [cart_id, req.body.product_id, req.body.qty]
        );
      }
    } else {
      // make new cart
      cart_id = await queryPromise(
        `INSERT INTO cart (customer_id) 
            VALUES (?)`,
        user[0].customer_id
      );
      cart_id = cart_id.insertId;
      await queryPromise(
        `INSERT INTO cart_item (cart_id, product_id, qty) 
          VALUES (?)`,
        [cart_id, req.body.product_id, req.body.qty]
      );
    }
    let result = await queryPromise(
      `SELECT * 
          FROM cart_item 
          WHERE cart_id=?`,
      cart_id
    );
    res.send(result);
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports = { getCart: getCart, postCart: postCart };
