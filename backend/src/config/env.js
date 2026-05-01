require("dotenv").config();

const isProduction = process.env.NODE_ENV === "production";
const dbUrl = process.env.DATABASE_URL || process.env.MYSQL_URL;

function parseDatabaseUrl(rawUrl) {
  if (!rawUrl) {
    return {};
  }

  try {
    const parsed = new URL(rawUrl);

    return {
      host: parsed.hostname,
      port: parsed.port ? Number(parsed.port) : 3306,
      name: parsed.pathname.replace(/^\//, ""),
      user: decodeURIComponent(parsed.username),
      password: decodeURIComponent(parsed.password)
    };
  } catch (_error) {
    console.warn("Invalid DATABASE_URL/MYSQL_URL value. Falling back to split DB variables.");
    return {};
  }
}

const dbFromUrl = parseDatabaseUrl(dbUrl);
const dbHost = process.env.DB_HOST || process.env.MYSQLHOST || dbFromUrl.host || (isProduction ? undefined : "localhost");
const dbPort = Number(process.env.DB_PORT || process.env.MYSQLPORT || dbFromUrl.port || 3306);
const dbName = process.env.DB_NAME || process.env.MYSQLDATABASE || dbFromUrl.name || (isProduction ? undefined : "project_management");
const dbUser = process.env.DB_USER || process.env.MYSQLUSER || dbFromUrl.user || (isProduction ? undefined : "root");
const dbPassword = process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || dbFromUrl.password || "";

if (!process.env.JWT_SECRET) {
  console.warn("Missing environment variable: JWT_SECRET");
}

if (isProduction && (!dbHost || !dbName || !dbUser)) {
  console.error(
    "Missing database configuration. Set MYSQL_URL/DATABASE_URL or MYSQLHOST, MYSQLPORT, MYSQLUSER, MYSQLPASSWORD, and MYSQLDATABASE on the backend service."
  );
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
  isProduction
};
