const projectService = require("../services/projectService");
const asyncHandler = require("../utils/asyncHandler");
const { getPagination, pagedResponse } = require("../utils/pagination");

const listProjects = asyncHandler(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const result = await projectService.listProjects(req.user, { limit, offset, search: req.query.search });

  res.json(pagedResponse(result.rows, result.count, page, limit));
});

const createProject = asyncHandler(async (req, res) => {
  const project = await projectService.createProject(req.user, req.body);
  res.status(201).json({ project });
});

const getProject = asyncHandler(async (req, res) => {
  const project = await projectService.getProjectById(req.params.id, req.user);
  res.json({ project });
});

const updateProject = asyncHandler(async (req, res) => {
  const project = await projectService.updateProject(req.project, req.body);
  res.json({ project });
});

const deleteProject = asyncHandler(async (req, res) => {
  await projectService.deleteProject(req.project);
  res.status(204).send();
});

const addMember = asyncHandler(async (req, res) => {
  const member = await projectService.addMember(req.params.id, req.body);
  res.status(201).json({ member });
});

const removeMember = asyncHandler(async (req, res) => {
  await projectService.removeMember(req.params.id, req.params.userId, req.project.ownerId);
  res.status(204).send();
});

module.exports = {
  listProjects,
  createProject,
  getProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember
};
