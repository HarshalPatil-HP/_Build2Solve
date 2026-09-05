/**
 * Barrel export for /middleware.
 *
 * Auth middleware (authenticate, authorize) will be added in Checkpoint 3.
 */
const errorHandler = require('./errorHandler');

module.exports = { errorHandler };
