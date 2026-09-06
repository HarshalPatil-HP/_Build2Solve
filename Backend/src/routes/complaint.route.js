const { Router } = require('express');
const { authenticate, authorize } = require('../middleware');
const complaintController = require('../controllers/complaint.controller');

const router = Router();

router.post('/', authenticate, authorize(['user']), complaintController.create);
router.get('/', authenticate, complaintController.list);
router.patch('/:id', authenticate, authorize(['admin']), complaintController.update);

module.exports = router;
