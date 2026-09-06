const { Router } = require('express');
const { authenticate, authorize } = require('../middleware');
const ruleController = require('../controllers/rule.controller');

const router = Router();

router.get('/', authenticate, authorize(['admin']), ruleController.list);
router.post('/', authenticate, authorize(['admin']), ruleController.create);
router.patch('/:id/deactivate', authenticate, authorize(['admin']), ruleController.deactivate);

module.exports = router;
