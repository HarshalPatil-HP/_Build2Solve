/**
 * Async handler wrapper — eliminates try/catch boilerplate in route handlers.
 *
 * Usage:
 *   router.get('/foo', catchAsync(async (req, res) => { … }));
 *
 * Any rejected promise is forwarded to Express's next(err) automatically.
 *
 * @param {Function} fn – async Express route handler (req, res, next)
 * @returns {Function}  – wrapped handler that catches rejections
 */
const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = catchAsync;
