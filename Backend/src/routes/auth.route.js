const { Router } = require('express');
const { signup, login } = require('../controllers/auth.controller');
const { validate } = require('../middleware');
const { signupSchema, loginSchema } = require('../validators/auth.validator');

const router = Router();

router.post('/signup', validate(signupSchema), signup);
router.post('/login', validate(loginSchema), login);

module.exports = router;
