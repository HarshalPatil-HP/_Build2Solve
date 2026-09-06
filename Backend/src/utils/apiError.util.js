// Operational API error with status code — distinguishes expected errors from programming bugs.

class ApiError extends Error {
  constructor(statusCode, message = 'Something went wrong', code = 'REQUEST_ERROR', errors = [], stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.data = null;
    this.success = false;
    this.errors = errors;
    this.isOperational = true;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

module.exports = ApiError;
