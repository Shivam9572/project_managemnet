const env = require("../config/env");
const authService = require("../services/authService");
const asyncHandler = require("../utils/asyncHandler");

const register = asyncHandler(async (req, res) => {
  const user = await authService.register(req.body);
  const token = authService.signToken(user);

  res.cookie(env.jwt.cookieName, token, authService.cookieOptions());
  res.status(201).json({ user });
});

const login = asyncHandler(async (req, res) => {
  const user = await authService.login(req.body.email, req.body.password);
  const token = authService.signToken(user);

  res.cookie(env.jwt.cookieName, token, authService.cookieOptions());
  res.json({ user });
});

const me = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});

const logout = asyncHandler(async (_req, res) => {
  res.clearCookie(env.jwt.cookieName, authService.clearCookieOptions());
  res.status(204).send();
});

module.exports = { register, login, me, logout };
