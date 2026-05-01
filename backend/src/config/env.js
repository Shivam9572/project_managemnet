require("dotenv").config();

const dbHost = process.env.DB_HOST || process.env.MYSQLHOST || "localhost";
const dbPort = Number(process.env.DB_PORT || process.env.MYSQLPORT || 3306);
const dbName = process.env.DB_NAME || process.env.MYSQLDATABASE || "project_management";
const dbUser = process.env.DB_USER || process.env.MYSQLUSER || "root";
const dbPassword = process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || "";

if (!process.env.JWT_SECRET) {
  console.warn("Missing environment variable: JWT_SECRET");
}

module.exports = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 5000),
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
  db: {
    host: dbHost,
    port: dbPort,
    name: dbName,
    user: dbUser,
    password: dbPassword
  },
  jwt: {
    secret: process.env.JWT_SECRET || "dev_only_change_me",
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    cookieName: process.env.COOKIE_NAME || "pm_token"
  },
  isProduction: process.env.NODE_ENV === "production"
};
