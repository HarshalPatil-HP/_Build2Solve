const Joi = require('joi');

const signupSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  role: Joi.string().valid('user', 'company', 'inspector', 'admin').required(),
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

module.exports = { signupSchema, loginSchema };
