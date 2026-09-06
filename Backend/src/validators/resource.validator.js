const Joi = require('joi');

const objectId = Joi.string().hex().length(24);
const booleanInput = Joi.alternatives().try(Joi.boolean(), Joi.string().valid('true', 'false'));

const scanSchema = Joi.object({
  productName: Joi.string().trim().min(2).max(200).required(),
  category: Joi.string().valid('food', 'cosmetics', 'electronics', 'other').required(),
  productId: objectId.optional(),
  companyId: objectId.optional(),
  packageWidthCm: Joi.number().positive().max(10000).optional(),
  packageHeightCm: Joi.number().positive().max(10000).optional(),
  isMolded: booleanInput.optional(),
  isTobacco: booleanInput.optional(),
  isRestaurantFastFood: booleanInput.optional(),
  isImported: booleanInput.optional(),
  location: Joi.alternatives().try(
    Joi.string().max(500),
    Joi.object({ lat: Joi.number().min(-90).max(90).required(), lng: Joi.number().min(-180).max(180).required() })
  ).optional(),
});

const complaintSchema = Joi.object({ scanId: objectId.required(), description: Joi.string().trim().min(10).max(2000).required() });
const complaintUpdateSchema = Joi.object({
  assignedInspectorId: objectId.optional(),
  status: Joi.string().valid('submitted', 'under-review', 'escalated', 'resolved').optional(),
}).min(1);
const caseCreateSchema = Joi.object({ scanId: objectId.required(), complaintId: objectId.optional(), notes: Joi.string().trim().max(5000).allow('').optional() });
const caseUpdateSchema = Joi.object({ notes: Joi.string().trim().max(5000).optional(), status: Joi.string().valid('draft', 'resolved').optional() }).min(1);
const addendumSchema = Joi.object({ notes: Joi.string().trim().min(1).max(5000).required(), scanId: objectId.optional() });
const ruleSchema = Joi.object({
  ruleNumber: Joi.string().trim().max(100).required(), description: Joi.string().trim().max(2000).required(),
  fieldName: Joi.string().trim().max(100).required(), category: Joi.string().valid('food', 'cosmetics', 'electronics', 'all').required(),
  validationType: Joi.string().valid('regex', 'presence', 'conditional').required(), validationPattern: Joi.string().max(1000).allow('').optional(),
  effectiveFrom: Joi.date().iso().optional(), effectiveTo: Joi.date().iso().greater(Joi.ref('effectiveFrom')).optional(),
});

module.exports = { scanSchema, complaintSchema, complaintUpdateSchema, caseCreateSchema, caseUpdateSchema, addendumSchema, ruleSchema };
