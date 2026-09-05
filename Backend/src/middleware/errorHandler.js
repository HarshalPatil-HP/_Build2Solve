/**
 * Global error-handling middleware.
 *
 * This is the LAST middleware registered on the Express app. Any error
 * thrown or passed via next(err) from any route/middleware lands here.
 *
 * Responsibilities:
 *  1. Log the error (full stack in dev, concise in prod).
 *  2. Distinguish operational errors (AppError, validation) from
 *     programming bugs so we never leak internal details to the client.
 *  3. Return a consistent JSON error envelope.
 */

const config = require('../config');

// eslint-disable-next-line no-unused-vars -- Express requires (err, req, res, next) signature
const errorHandler = (err, req, res, next) => {
  // Default to 500 if no status code was set
  err.statusCode = err.statusCode || 500;

  // ---- Development: full detail for debugging ----
  if (config.isDev()) {
    console.error('[ERROR]', err);
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
      stack: err.stack,
    });
  }

  // ---- Production: hide internal details ----
  if (err.isOperational) {
    // Trusted error we intentionally threw (AppError)
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
  }

  // Programming / unknown error — log full details server-side
  console.error('[UNHANDLED ERROR]', err);
  return res.status(500).json({
    success: false,
    error: 'An unexpected error occurred. Please try again later.',
  });
};

module.exports = errorHandler;
