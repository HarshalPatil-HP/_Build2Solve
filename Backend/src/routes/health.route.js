// Health-check route — GET /api/health (no auth required).

const { Router } = require('express');
const { getHealth } = require('../controllers/health.controller');

const router = Router();

router.get('/', getHealth);

module.exports = router;
