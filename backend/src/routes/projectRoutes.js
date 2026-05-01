const express = require("express");
const projectController = require("../controllers/projectController");
const { protect, authorize } = require("../middlewares/auth");
const { loadProjectAccess, requireProjectAdmin } = require("../middlewares/projectAccess");
const validate = require("../middlewares/validate");
const {
  createProjectRules,
  updateProjectRules,
  projectIdParam,
  memberRules,
  removeMemberRules
} = require("../validators/projectValidators");

const router = express.Router();

router.use(protect);

router.get("/", projectController.listProjects);
router.post("/", authorize("admin"), createProjectRules, validate, projectController.createProject);
router.get("/:id", projectIdParam, validate, projectController.getProject);
router.patch("/:id", updateProjectRules, validate, loadProjectAccess, requireProjectAdmin, projectController.updateProject);
router.delete("/:id", projectIdParam, validate, loadProjectAccess, requireProjectAdmin, projectController.deleteProject);
router.post("/:id/members", memberRules, validate, loadProjectAccess, requireProjectAdmin, projectController.addMember);
router.delete("/:id/members/:userId", removeMemberRules, validate, loadProjectAccess, requireProjectAdmin, projectController.removeMember);

module.exports = router;
