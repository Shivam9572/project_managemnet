const { sequelize } = require("../models");
const withDatabaseRetry = require("./databaseRetry");

async function syncDatabase() {
  try {
    await withDatabaseRetry(() => sequelize.sync({ alter: false }), "Database sync");
    console.log("Database synced successfully.");
  } catch (error) {
    console.error("Database sync failed:", error);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

syncDatabase();
