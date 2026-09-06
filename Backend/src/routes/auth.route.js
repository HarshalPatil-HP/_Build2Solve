const { Router } = require('express');
const { signup, login, createStaff } = require('../controllers/auth.controller');
const { validate, authenticate, authorize } = require('../middleware');
const { signupSchema, loginSchema, staffSignupSchema } = require('../validators/auth.validator');

const router = Router();

router.post('/signup', validate(signupSchema), signup);
router.post('/login', validate(loginSchema), login);
router.post('/staff', authenticate, authorize(['admin']), validate(staffSignupSchema), createStaff);

module.exports = router;
