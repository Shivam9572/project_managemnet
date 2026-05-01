const { body, param } = require("express-validator");

const projectIdParam = [param("id").isInt({ min: 1 })];

const createProjectRules = [
  body("name").trim().isLength({ min: 2, max: 160 }),
  body("description").optional({ nullable: true }).trim().isLength({ max: 5000 })
];

const updateProjectRules = [
  ...projectIdParam,
  body("name").optional().trim().isLength({ min: 2, max: 160 }),
  body("description").optional({ nullable: true }).trim().isLength({ max: 5000 })
];

const memberRules = [
  param("id").isInt({ min: 1 }),
  body("email").trim().isEmail().normalizeEmail(),
  body("role").optional().isIn(["admin", "member"])
];

const removeMemberRules = [
  param("id").isInt({ min: 1 }),
  param("userId").isInt({ min: 1 })
];

module.exports = { projectIdParam, createProjectRules, updateProjectRules, memberRules, removeMemberRules };
