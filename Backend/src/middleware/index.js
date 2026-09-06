const authenticate = require('./auth.middleware');
const authorize = require('./authorize.middleware');
const errorHandler = require('./error.middleware');
const { upload, uploadScanImages } = require('./upload.middleware');
const validate = require('./validate.middleware');

module.exports = {
  authenticate,
  authorize,
  errorHandler,
  upload,
  uploadScanImages,
  validate,
};
