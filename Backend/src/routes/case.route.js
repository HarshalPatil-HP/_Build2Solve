const { Router } = require('express');
const { authenticate, authorize, validate } = require('../middleware');
const caseController = require('../controllers/case.controller');
const { caseCreateSchema, caseUpdateSchema, addendumSchema } = require('../validators/resource.validator');

const router = Router();

router.post('/', authenticate, authorize(['inspector']), validate(caseCreateSchema), caseController.create);
router.get('/', authenticate, authorize(['inspector', 'admin']), caseController.list);
router.get('/:id', authenticate, authorize(['inspector', 'admin']), caseController.getOne);
router.patch('/:id', authenticate, authorize(['inspector']), validate(caseUpdateSchema), caseController.update);
router.post('/:id/lock', authenticate, authorize(['inspector']), caseController.lock);
router.post('/:id/addendum', authenticate, authorize(['inspector']), validate(addendumSchema), caseController.addendum);

module.exports = router;
