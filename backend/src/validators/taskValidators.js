const { body, param, query } = require("express-validator");

const taskIdParam = [param("id").isInt({ min: 1 })];

const taskQueryRules = [
  query("projectId").optional().isInt({ min: 1 }),
  query("assignedTo").optional().isInt({ min: 1 }),
  query("status").optional().isIn(["todo", "in_progress", "done"]),
  query("search").optional().trim().isLength({ max: 120 })
];

const createTaskRules = [
  body("projectId").isInt({ min: 1 }),
  body("assignedTo").optional({ nullable: true }).isInt({ min: 1 }),
  body("title").trim().isLength({ min: 2, max: 180 }),
  body("description").optional({ nullable: true }).trim().isLength({ max: 5000 }),
  body("status").optional().isIn(["todo", "in_progress", "done"]),
  body("priority").optional().isIn(["low", "medium", "high", "urgent"]),
  body("dueDate").optional({ nullable: true }).isISO8601().toDate()
];

const updateTaskRules = [
  ...taskIdParam,
  body("assignedTo").optional({ nullable: true }).isInt({ min: 1 }),
  body("title").optional().trim().isLength({ min: 2, max: 180 }),
  body("description").optional({ nullable: true }).trim().isLength({ max: 5000 }),
  body("status").optional().isIn(["todo", "in_progress", "done"]),
  body("priority").optional().isIn(["low", "medium", "high", "urgent"]),
  body("dueDate").optional({ nullable: true }).isISO8601().toDate()
];

const statusRules = [
  ...taskIdParam,
  body("status").isIn(["todo", "in_progress", "done"])
];

const commentRules = [
  ...taskIdParam,
  body("comment").trim().isLength({ min: 1, max: 5000 })
];

module.exports = { taskIdParam, taskQueryRules, createTaskRules, updateTaskRules, statusRules, commentRules };
