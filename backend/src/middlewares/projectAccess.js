const { Project, ProjectMember } = require("../models");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");

function projectIdFromRequest(req) {
  return req.params.projectId || req.params.id || req.body.projectId || req.query.projectId;
}

const loadProjectAccess = asyncHandler(async (req, _res, next) => {
  const projectId = projectIdFromRequest(req);

  if (!projectId) {
    throw new AppError("Project id is required", 400);
  }

  const project = await Project.findByPk(projectId);

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  const membership = await ProjectMember.findOne({
    where: { projectId, userId: req.user.id }
  });

  const isOwner = project.ownerId === req.user.id;
  const isGlobalAdmin = req.user.role === "admin";

  if (!isOwner && !isGlobalAdmin && !membership) {
    throw new AppError("You are not a member of this project", 403);
  }

  req.project = project;
  req.projectMembership = membership;
  next();
});

const requireProjectAdmin = (req, _res, next) => {
  const canAdmin =
    req.user.role === "admin" ||
    req.project?.ownerId === req.user.id ||
    req.projectMembership?.role === "admin";

  if (!canAdmin) {
    return next(new AppError("Project admin access required", 403));
  }

  next();
};

module.exports = { loadProjectAccess, requireProjectAdmin };
