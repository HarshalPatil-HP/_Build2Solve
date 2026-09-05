/**
 * Async handler wrapper — eliminates try/catch boilerplate in route handlers.
 * Industry standard implementation using Promise.resolve.
 *
 * Usage:
 *   router.get('/foo', asyncHandler(async (req, res, next) => { … }));
 */
const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

module.exports = asyncHandler;
