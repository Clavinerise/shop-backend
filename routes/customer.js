const express = require("express");
const authenticateToken = require("../middleware/authenticateToken");
const customerController = require("../controllers/customer-controller");
const { register } = require("../controllers/admin-controllers");

let router = express.Router();

router.post("/profile", authenticateToken, customerController.profile);

router.post("/login", customerController.login);

router.post("/register", customerController.register);

module.exports = router;
