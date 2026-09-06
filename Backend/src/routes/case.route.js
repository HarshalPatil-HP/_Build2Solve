const { Router } = require('express');
const { authenticate, authorize } = require('../middleware');
const caseController = require('../controllers/case.controller');

const router = Router();

router.post('/', authenticate, authorize(['inspector']), caseController.create);
router.get('/', authenticate, authorize(['inspector', 'admin']), caseController.list);
router.get('/:id', authenticate, authorize(['inspector', 'admin']), caseController.getOne);
router.patch('/:id', authenticate, authorize(['inspector']), caseController.update);
router.post('/:id/lock', authenticate, authorize(['inspector']), caseController.lock);
router.post('/:id/addendum', authenticate, authorize(['inspector']), caseController.addendum);

module.exports = router;
