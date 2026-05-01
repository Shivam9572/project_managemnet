const { Op, col, fn, literal } = require("sequelize");
const { Project, ProjectMember, Task } = require("../models");

async function visibleProjectIds(user) {
  if (user.role === "admin") {
    const projects = await Project.findAll({ attributes: ["id"] });
    return projects.map((project) => project.id);
  }

  const owned = await Project.findAll({ where: { ownerId: user.id }, attributes: ["id"] });
  const memberRows = await ProjectMember.findAll({ where: { userId: user.id }, attributes: ["projectId"] });
  return [...new Set([...owned.map((project) => project.id), ...memberRows.map((row) => row.projectId)])];
}

async function dashboardStats(user) {
  const projectIds = await visibleProjectIds(user);

  if (!projectIds.length) {
    return {
      totalProjects: 0,
      completedProjects: 0,
      totalTasks: 0,
      completedTasks: 0,
      overdueTasks: 0,
      completionRate: 0
    };
  }

  const taskWhere = user.role === "member"
    ? { assignedTo: user.id, projectId: { [Op.in]: projectIds } }
    : { projectId: { [Op.in]: projectIds } };

  const [totalTasks, completedTasks, overdueTasks, taskGroups] = await Promise.all([
    Task.count({ where: taskWhere }),
    Task.count({ where: { ...taskWhere, status: "done" } }),
    Task.count({
      where: {
        ...taskWhere,
        status: { [Op.ne]: "done" },
        dueDate: { [Op.lt]: new Date() }
      }
    }),
    Task.findAll({
      where: taskWhere,
      attributes: [
        "projectId",
        [fn("COUNT", col("id")), "total"],
        [literal("SUM(CASE WHEN status = 'done' THEN 1 ELSE 0 END)"), "done"]
      ],
      group: ["projectId"],
      raw: true
    })
  ]);

  const completedProjects = taskGroups.filter((group) => {
    const total = Number(group.total);
    const done = Number(group.done);
    return total > 0 && total === done;
  }).length;

  return {
    totalProjects: projectIds.length,
    completedProjects,
    totalTasks,
    completedTasks,
    overdueTasks,
    completionRate: totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0
  };
}

module.exports = { dashboardStats };
