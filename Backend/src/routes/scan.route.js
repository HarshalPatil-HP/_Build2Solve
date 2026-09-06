const { Router } = require('express');
const { authenticate, authorize, upload, validate } = require('../middleware');
const scanController = require('../controllers/scan.controller');
const { scanSchema } = require('../validators/resource.validator');

const router = Router();

const handleUpload = (req, res, next) => {
  upload.single('image')(req, res, (err) => (err ? next(err) : next()));
};

router.post('/', authenticate, authorize(['user', 'company', 'inspector']), handleUpload, validate(scanSchema), scanController.createScan);
router.get('/', authenticate, scanController.getScans);
router.get('/:id/report', authenticate, scanController.getScanReport);
router.get('/:id', authenticate, scanController.getScanById);

module.exports = router;
