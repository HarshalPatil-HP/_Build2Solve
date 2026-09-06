const { Router } = require('express');
const { authenticate, authorize, uploadScanImages, validate } = require('../middleware');
const scanController = require('../controllers/scan.controller');
const { scanSchema } = require('../validators/resource.validator');

const router = Router();

router.post('/', authenticate, authorize(['user', 'company', 'inspector']), uploadScanImages, validate(scanSchema), scanController.createScan);
router.get('/', authenticate, scanController.getScans);
router.get('/:id/report', authenticate, scanController.getScanReport);
router.get('/:id', authenticate, scanController.getScanById);

module.exports = router;
