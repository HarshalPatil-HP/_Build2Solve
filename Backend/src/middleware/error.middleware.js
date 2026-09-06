const errorHandler = (err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ success: false, message: 'File too large. Max 5MB.', code: 'FILE_TOO_LARGE' });
  }
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({ success: false, message: 'Upload at most 4 images using the images field.', code: 'INVALID_IMAGE_COUNT' });
  }
  if (err.message?.includes('Only JPG')) {
    return res.status(400).json({ success: false, message: err.message, code: 'INVALID_FILE_TYPE' });
  }
  if (err.message?.includes('between 1 and 4 product-label images')) {
    return res.status(400).json({ success: false, message: err.message, code: 'INVALID_IMAGE_COUNT' });
  }
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: err.name === 'CastError' ? 'Invalid resource identifier' : err.message,
      code: 'VALIDATION_ERROR',
    });
  }
  if (err.code === 11000) {
    return res.status(409).json({ success: false, message: 'A record with this value already exists', code: 'DUPLICATE_RECORD' });
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
