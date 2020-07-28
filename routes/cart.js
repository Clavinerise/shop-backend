const express = require("express");
const authenticateToken = require("../middleware/authenticateToken");
const cartController = require("../controllers/cart-controller");
let router = express.Router();

router.get("/", authenticateToken, cartController.getCart);

router.post("/", authenticateToken, cartController.postCart);

module.exports = router;
