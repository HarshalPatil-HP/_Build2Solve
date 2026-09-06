const { Router } = require('express');
const { authenticate, authorize, validate } = require('../middleware');
const ruleController = require('../controllers/rule.controller');
const { ruleSchema } = require('../validators/resource.validator');

const router = Router();

router.get('/', authenticate, authorize(['admin']), ruleController.list);
router.post('/', authenticate, authorize(['admin']), validate(ruleSchema), ruleController.create);
router.patch('/:id/deactivate', authenticate, authorize(['admin']), ruleController.deactivate);

module.exports = router;
