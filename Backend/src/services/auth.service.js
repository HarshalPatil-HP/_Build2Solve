const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Company } = require('../models');
const { ApiError } = require('../utils');

const SALT_ROUNDS = 10;

const signToken = (user) =>
  jwt.sign(
    { userId: user._id.toString(), role: user.role, companyId: user.companyId?.toString() || null },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  companyId: user.companyId,
});

const signup = async ({ name, email, password, role, companyId }) => {
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) throw new ApiError(409, 'Email already registered', 'EMAIL_EXISTS');

  if (role === 'company') {
    if (!companyId) throw new ApiError(400, 'companyId is required for company role', 'VALIDATION_ERROR');
    const company = await Company.findById(companyId);
    if (!company) throw new ApiError(404, 'Company not found', 'NOT_FOUND');
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    passwordHash,
    role,
    companyId: role === 'company' ? companyId : null,
  });

  const token = signToken(user);
  return { user: sanitizeUser(user), token };
};

const createStaff = async ({ name, email, password, role }) => {
  if (!['inspector', 'admin'].includes(role)) {
    throw new ApiError(400, 'Only staff roles can be created here', 'VALIDATION_ERROR');
  }
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) throw new ApiError(409, 'Email already registered', 'EMAIL_EXISTS');
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    passwordHash: await bcrypt.hash(password, SALT_ROUNDS),
    role,
  });
  return sanitizeUser(user);
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) throw new ApiError(401, 'Invalid email or password', 'INVALID_CREDENTIALS');

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) throw new ApiError(401, 'Invalid email or password', 'INVALID_CREDENTIALS');

  const token = signToken(user);
  return { user: sanitizeUser(user), token };
};

module.exports = { signup, login, createStaff };
