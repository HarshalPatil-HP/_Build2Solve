const Joi = require('joi');

const signupSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  // Staff roles must be provisioned by an authenticated administrator, never
  // through a public endpoint.
  role: Joi.string().valid('user', 'company').required(),
  companyId: Joi.when('role', {
    is: 'company',
    then: Joi.string().hex().length(24).required(),
    otherwise: Joi.forbidden(),
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const staffSignupSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(12).max(128).required(),
  role: Joi.string().valid('inspector', 'admin').required(),
});

module.exports = { signupSchema, loginSchema, staffSignupSchema };
