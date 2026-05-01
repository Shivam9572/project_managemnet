const sequelize = require("../config/database");
const User = require("./User");
const Project = require("./Project");
const ProjectMember = require("./ProjectMember");
const Task = require("./Task");
const TaskComment = require("./TaskComment");

User.hasMany(Project, { foreignKey: "ownerId", as: "ownedProjects", onDelete: "CASCADE" });
Project.belongsTo(User, { foreignKey: "ownerId", as: "owner" });

Project.belongsToMany(User, {
  through: ProjectMember,
  foreignKey: "projectId",
  otherKey: "userId",
  as: "members"
});
User.belongsToMany(Project, {
  through: ProjectMember,
  foreignKey: "userId",
  otherKey: "projectId",
  as: "projects"
});

Project.hasMany(ProjectMember, { foreignKey: "projectId", as: "projectMembers", onDelete: "CASCADE" });
ProjectMember.belongsTo(Project, { foreignKey: "projectId", as: "project" });
ProjectMember.belongsTo(User, { foreignKey: "userId", as: "user" });

Project.hasMany(Task, { foreignKey: "projectId", as: "tasks", onDelete: "CASCADE" });
Task.belongsTo(Project, { foreignKey: "projectId", as: "project" });
User.hasMany(Task, { foreignKey: "assignedTo", as: "assignedTasks", onDelete: "SET NULL" });
Task.belongsTo(User, { foreignKey: "assignedTo", as: "assignee" });

Task.hasMany(TaskComment, { foreignKey: "taskId", as: "comments", onDelete: "CASCADE" });
TaskComment.belongsTo(Task, { foreignKey: "taskId", as: "task" });
TaskComment.belongsTo(User, { foreignKey: "userId", as: "author" });

module.exports = {
  sequelize,
  User,
  Project,
  ProjectMember,
  Task,
  TaskComment
};
