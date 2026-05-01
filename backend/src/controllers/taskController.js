const taskService = require("../services/taskService");
const { Task } = require("../models");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const { getPagination, pagedResponse } = require("../utils/pagination");

async function loadTask(id) {
  const task = await Task.findByPk(id);
  if (!task) throw new AppError("Task not found", 404);
  return task;
}

const listTasks = asyncHandler(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const result = await taskService.listTasks(req.user, req.query, { limit, offset });

  res.json(pagedResponse(result.rows, result.count, page, limit));
});

const createTask = asyncHandler(async (req, res) => {
  const task = await taskService.createTask(req.user, req.body);
  res.status(201).json({ task });
});

const getTask = asyncHandler(async (req, res) => {
  const task = await taskService.getTaskById(req.params.id, req.user);
  res.json({ task });
});

const updateTask = asyncHandler(async (req, res) => {
  const task = await loadTask(req.params.id);
  const updated = await taskService.updateTask(req.user, task, req.body);
  res.json({ task: updated });
});

const updateTaskStatus = asyncHandler(async (req, res) => {
  const task = await loadTask(req.params.id);
  const updated = await taskService.updateStatus(req.user, task, req.body.status);
  res.json({ task: updated });
});

const deleteTask = asyncHandler(async (req, res) => {
  const task = await loadTask(req.params.id);
  await taskService.deleteTask(req.user, task);
  res.status(204).send();
});

const addComment = asyncHandler(async (req, res) => {
  const task = await loadTask(req.params.id);
  const comment = await taskService.addComment(req.user, task, req.body.comment);
  res.status(201).json({ comment });
});

module.exports = {
  listTasks,
  createTask,
  getTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
  addComment
};
