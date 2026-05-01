const { body } = require("express-validator");

const registerRules = [
  body("name").trim().isLength({ min: 2, max: 120 }),
  body("email").trim().isEmail().normalizeEmail(),
  body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
  body("role").optional().isIn(["admin", "member"])
];

const loginRules = [
  body("email").trim().isEmail().normalizeEmail(),
  body("password").notEmpty()
];

module.exports = { registerRules, loginRules };
