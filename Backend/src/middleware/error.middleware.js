const errorHandler = (err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ success: false, message: 'File too large. Max 5MB.', code: 'FILE_TOO_LARGE' });
  }
  if (err.message?.includes('Only JPG')) {
    return res.status(400).json({ success: false, message: err.message, code: 'INVALID_FILE_TYPE' });
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something went wrong';
  const code = err.code || (statusCode >= 500 ? 'INTERNAL_ERROR' : 'REQUEST_ERROR');

  console.error(`[ERROR] ${req.method} ${req.originalUrl}`, err);

  return res.status(statusCode).json({
    success: false,
    message: err.isOperational ? message : 'An unexpected error occurred. Please try again later.',
    code,
  });
};

module.exports = errorHandler;
