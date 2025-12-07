const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// These functions are now correctly exported from authController.js
router.post("/login", authController.login);
router.post("/change-password", authController.changePassword);

module.exports = router;