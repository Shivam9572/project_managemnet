const express = require("express");
const authController = require("../controllers/authController");
const { protect } = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const { authLimiter } = require("../middlewares/rateLimiters");
const { registerRules, loginRules } = require("../validators/authValidators");

const router = express.Router();

router.post("/register", authLimiter, registerRules, validate, authController.register);
router.post("/login", authLimiter, loginRules, validate, authController.login);
router.get("/me", protect, authController.me);
router.post("/logout", protect, authController.logout);

module.exports = router;
