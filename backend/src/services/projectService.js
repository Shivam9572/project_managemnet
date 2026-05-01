const { Op } = require("sequelize");
const { Project, ProjectMember, User, Task } = require("../models");
const AppError = require("../utils/AppError");

const projectInclude = [
  { model: User, as: "owner", attributes: ["id", "name", "email", "role"] },
  { model: User, as: "members", attributes: ["id", "name", "email", "role"], through: { attributes: ["role"] } }
];

function projectVisibilityWhere(user) {
  if (user.role === "admin") return {};

  return {
    [Op.or]: [
      { ownerId: user.id },
      { "$members.id$": user.id }
    ]
  };
}

async function listProjects(user, { limit, offset, search }) {
  const where = search ? { name: { [Op.like]: `%${search}%` } } : {};

  return Project.findAndCountAll({
    where: { ...where, ...projectVisibilityWhere(user) },
    include: projectInclude,
    distinct: true,
    subQuery: false,
    limit,
    offset,
    order: [["createdAt", "DESC"]]
  });
}

async function createProject(user, payload) {
  const project = await Project.create({
    name: payload.name,
    description: payload.description,
    ownerId: user.id
  });

  await ProjectMember.create({
    projectId: project.id,
    userId: user.id,
    role: "admin"
  });

  return getProjectById(project.id, user);
}

async function getProjectById(id, user) {
  const project = await Project.findOne({
    where: { id },
    include: [
      ...projectInclude,
      {
        model: Task,
        as: "tasks",
        separate: true,
        limit: 20,
        order: [["createdAt", "DESC"]],
        include: [{ model: User, as: "assignee", attributes: ["id", "name", "email"] }]
      }
    ]
  });

  if (!project) throw new AppError("Project not found", 404);

  if (user.role !== "admin" && project.ownerId !== user.id) {
    const membership = await ProjectMember.findOne({ where: { projectId: id, userId: user.id } });
    if (!membership) throw new AppError("You are not a member of this project", 403);
  }

  return project;
}

async function updateProject(project, payload) {
  await project.update({
    name: payload.name ?? project.name,
    description: payload.description ?? project.description
  });

  return project.reload({ include: projectInclude });
}

async function deleteProject(project) {
  await project.destroy();
}

async function addMember(projectId, payload) {
  const user = await User.findOne({ where: { email: payload.email } });
  if (!user) throw new AppError("User not found", 404);

  const [membership, created] = await ProjectMember.findOrCreate({
    where: { projectId, userId: user.id },
    defaults: { role: payload.role || "member" }
  });

  if (!created) {
    await membership.update({ role: payload.role || membership.role });
  }

  return ProjectMember.findByPk(membership.id, {
    include: [{ model: User, as: "user", attributes: ["id", "name", "email", "role"] }]
  });
}

async function removeMember(projectId, userId, ownerId) {
  if (Number(userId) === Number(ownerId)) {
    throw new AppError("Project owner cannot be removed", 400);
  }

  const deleted = await ProjectMember.destroy({ where: { projectId, userId } });
  if (!deleted) throw new AppError("Project member not found", 404);
}

module.exports = {
  listProjects,
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember
};
