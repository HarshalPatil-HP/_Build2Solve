const { Router } = require('express');
const { authenticate, authorize, validate } = require('../middleware');
const complaintController = require('../controllers/complaint.controller');
const { complaintSchema, complaintUpdateSchema } = require('../validators/resource.validator');

const router = Router();

router.post('/', authenticate, authorize(['user']), validate(complaintSchema), complaintController.create);
router.get('/', authenticate, complaintController.list);
router.patch('/:id', authenticate, authorize(['admin']), validate(complaintUpdateSchema), complaintController.update);

module.exports = router;
