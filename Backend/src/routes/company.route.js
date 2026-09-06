const { Router } = require('express');
const { authenticate, authorize } = require('../middleware');
const companyController = require('../controllers/company.controller');

const router = Router();

router.get('/', authenticate, authorize(['inspector', 'admin']), companyController.list);
router.get('/:id/history', authenticate, authorize(['inspector', 'admin']), companyController.history);

module.exports = router;
