const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const env = require("../config/env");
const AppError = require("../utils/AppError");

function signToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, env.jwt.secret, {
    expiresIn: env.jwt.expiresIn
  });
}

function cookieOptions() {
  return {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: env.isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000
  };
}

function clearCookieOptions() {
  const options = cookieOptions();
  delete options.maxAge;
  return options;
}

async function register(payload) {
  const existing = await User.unscoped().findOne({ where: { email: payload.email } });

  if (existing) {
    throw new AppError("Email is already registered", 409);
  }

  const hashedPassword = await bcrypt.hash(payload.password, 12);
  const user = await User.create({
    name: payload.name,
    email: payload.email,
    password: hashedPassword,
    role: payload.role || "member"
  });

  return User.findByPk(user.id);
}

async function login(email, password) {
  const user = await User.unscoped().findOne({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new AppError("Invalid email or password", 401);
  }

  const safeUser = user.toJSON();
  delete safeUser.password;

  return safeUser;
}

module.exports = { register, login, signToken, cookieOptions, clearCookieOptions };
