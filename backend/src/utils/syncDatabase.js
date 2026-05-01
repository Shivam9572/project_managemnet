const { sequelize } = require("../models");

async function syncDatabase() {
  try {
    await sequelize.sync({ alter: false });
    console.log("Database synced successfully.");
  } catch (error) {
    console.error("Database sync failed:", error);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

syncDatabase();
