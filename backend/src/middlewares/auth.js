const jwt = require("jsonwebtoken");
const env = require("../config/env");
const { User } = require("../models");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");

const protect = asyncHandler(async (req, _res, next) => {
  const token = req.cookies?.[env.jwt.cookieName] || req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    throw new AppError("Authentication required", 401);
  }

  const payload = jwt.verify(token, env.jwt.secret);
  const user = await User.findByPk(payload.id);

  if (!user) {
    throw new AppError("User no longer exists", 401);
  }

  req.user = user;
  next();
});

const authorize = (...roles) => (req, _res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(new AppError("You do not have permission to perform this action", 403));
  }

  next();
};

module.exports = { protect, authorize };
