const dashboardService = require("../services/dashboardService");
const asyncHandler = require("../utils/asyncHandler");

const getDashboard = asyncHandler(async (req, res) => {
  const stats = await dashboardService.dashboardStats(req.user);
  res.json({ stats });
});

module.exports = { getDashboard };
