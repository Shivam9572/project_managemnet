const { Op } = require("sequelize");
const { Task, Project, ProjectMember, User, TaskComment } = require("../models");
const AppError = require("../utils/AppError");

const taskInclude = [
  { model: Project, as: "project", attributes: ["id", "name", "ownerId"] },
  { model: User, as: "assignee", attributes: ["id", "name", "email"] }
];

async function canAccessProject(user, projectId) {
  if (user.role === "admin") return true;

  const project = await Project.findByPk(projectId);
  if (!project) throw new AppError("Project not found", 404);
  if (project.ownerId === user.id) return true;

  const membership = await ProjectMember.findOne({ where: { projectId, userId: user.id } });
  return Boolean(membership);
}

async function ensureProjectAdmin(user, projectId) {
  if (user.role === "admin") return;

  const project = await Project.findByPk(projectId);
  if (!project) throw new AppError("Project not found", 404);
  if (project.ownerId === user.id) return;

  const membership = await ProjectMember.findOne({ where: { projectId, userId: user.id, role: "admin" } });
  if (!membership) throw new AppError("Project admin access required", 403);
}

async function ensureAssigneeIsMember(projectId, userId) {
  if (!userId) return;

  const membership = await ProjectMember.findOne({ where: { projectId, userId } });
  if (!membership) throw new AppError("Assignee must be a project member", 422);
}

async function listTasks(user, query, { limit, offset }) {
  const where = {};
  if (query.projectId) where.projectId = query.projectId;
  if (query.assignedTo) where.assignedTo = query.assignedTo;
  if (query.status) where.status = query.status;
  if (query.search) where.title = { [Op.like]: `%${query.search}%` };

  if (user.role !== "admin") {
    where.assignedTo = user.id;
  }

  if (query.projectId && !(await canAccessProject(user, query.projectId))) {
    throw new AppError("You are not a member of this project", 403);
  }

  return Task.findAndCountAll({
    where,
    include: taskInclude,
    distinct: true,
    limit,
    offset,
    order: [["createdAt", "DESC"]]
  });
}

async function createTask(user, payload) {
  await ensureProjectAdmin(user, payload.projectId);
  await ensureAssigneeIsMember(payload.projectId, payload.assignedTo);

  const task = await Task.create(payload);
  return getTaskById(task.id, user);
}

async function getTaskById(id, user) {
  const task = await Task.findByPk(id, {
    include: [
      ...taskInclude,
      {
        model: TaskComment,
        as: "comments",
        include: [{ model: User, as: "author", attributes: ["id", "name", "email"] }],
        separate: true,
        order: [["createdAt", "ASC"]]
      }
    ]
  });

  if (!task) throw new AppError("Task not found", 404);

  if (user.role !== "admin" && !(await canAccessProject(user, task.projectId))) {
    throw new AppError("You cannot access this task", 403);
  }

  if (user.role === "member" && task.assignedTo !== user.id) {
    const project = await Project.findByPk(task.projectId);
    if (project.ownerId !== user.id) {
      throw new AppError("Members can only view assigned tasks", 403);
    }
  }

  return task;
}

async function updateTask(user, task, payload) {
  await ensureProjectAdmin(user, task.projectId);
  await ensureAssigneeIsMember(task.projectId, payload.assignedTo);
  await task.update(payload);
  return getTaskById(task.id, user);
}

async function updateStatus(user, task, status) {
  if (user.role !== "admin" && task.assignedTo !== user.id) {
    const membership = await ProjectMember.findOne({ where: { projectId: task.projectId, userId: user.id, role: "admin" } });
    const project = await Project.findByPk(task.projectId);
    if (!membership && project.ownerId !== user.id) {
      throw new AppError("You can only update status for your assigned tasks", 403);
    }
  }

  await task.update({ status });
  return getTaskById(task.id, user);
}

async function deleteTask(user, task) {
  await ensureProjectAdmin(user, task.projectId);
  await task.destroy();
}

async function addComment(user, task, comment) {
  if (user.role !== "admin" && task.assignedTo !== user.id) {
    const membership = await ProjectMember.findOne({ where: { projectId: task.projectId, userId: user.id } });
    if (!membership) throw new AppError("You cannot comment on this task", 403);
  }

  return TaskComment.create({ taskId: task.id, userId: user.id, comment });
}

module.exports = {
  listTasks,
  createTask,
  getTaskById,
  updateTask,
  updateStatus,
  deleteTask,
  addComment
};
