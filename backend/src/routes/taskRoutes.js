const express = require("express");
const taskController = require("../controllers/taskController");
const { protect } = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const {
  taskIdParam,
  taskQueryRules,
  createTaskRules,
  updateTaskRules,
  statusRules,
  commentRules
} = require("../validators/taskValidators");

const router = express.Router();

router.use(protect);

router.get("/", taskQueryRules, validate, taskController.listTasks);
router.post("/", createTaskRules, validate, taskController.createTask);
router.get("/:id", taskIdParam, validate, taskController.getTask);
router.patch("/:id", updateTaskRules, validate, taskController.updateTask);
router.patch("/:id/status", statusRules, validate, taskController.updateTaskStatus);
router.delete("/:id", taskIdParam, validate, taskController.deleteTask);
router.post("/:id/comments", commentRules, validate, taskController.addComment);

module.exports = router;
