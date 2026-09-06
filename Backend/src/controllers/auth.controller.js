const authService = require('../services/auth.service');
const { ApiResponse, asyncHandler } = require('../utils');

const signup = asyncHandler(async (req, res) => {
  const result = await authService.signup(req.body);
  res.status(201).json(new ApiResponse(201, result, 'Account created'));
});

const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  res.status(200).json(new ApiResponse(200, result, 'Login successful'));
});

module.exports = { signup, login };
