// Global error handler — last middleware in the chain. Separates operational vs programming errors.

const config = require('../config');

// eslint-disable-next-line no-unused-vars -- Express requires (err, req, res, next) signature
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Something went wrong';

  if (config.isDev()) {
    console.error('[ERROR]', err);
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors || [],
      stack: err.stack,
    });
  }

  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors || [],
    });
  }

  console.error('[UNHANDLED ERROR]', err);
  return res.status(500).json({
    success: false,
    message: 'An unexpected error occurred. Please try again later.',
  });
};

module.exports = errorHandler;
