/**
 * Custom application error class.
 *
 * Extends the native Error with an HTTP status code and an `isOperational`
 * flag so the global error handler can distinguish expected client errors
 * (400, 404, 409 …) from unexpected crashes (500).
 */
class AppError extends Error {
  /**
   * @param {string}  message    – Human-readable error description
   * @param {number}  statusCode – HTTP status code (default 500)
   */
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // trusted, expected error
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
