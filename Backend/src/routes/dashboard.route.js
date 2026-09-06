const { Router } = require('express');
const { authenticate, authorize } = require('../middleware');
const dashboardController = require('../controllers/dashboard.controller');

const router = Router();

router.get('/summary', authenticate, authorize(['admin']), dashboardController.summary);

module.exports = router;
