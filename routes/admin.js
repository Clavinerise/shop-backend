const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authenticateToken");
const verifyAdmin = require("../middleware/verifyAdmin");
const adminController = require("../controllers/admin-controllers");

router.post("/login", adminController.login);

router.post("/register", adminController.register);

router.get(
  "/orders",
  authenticateToken,
  verifyAdmin,
  adminController.getOrdersAdmin
);

module.exports = router;
