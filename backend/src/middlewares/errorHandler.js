const env = require("../config/env");

module.exports = (error, _req, res, _next) => {
  const statusCode = error.statusCode || 500;

  if (!env.isProduction && !error.isOperational) {
    console.error(error);
  }

  res.status(statusCode).json({
    message: error.message || "Internal server error",
    details: error.details || undefined
  });
};
