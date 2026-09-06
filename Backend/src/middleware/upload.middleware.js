const path = require('path');
const multer = require('multer');

const ALLOWED_MIME = ['image/jpeg', 'image/jpg', 'image/png'];
const ALLOWED_EXT = ['.jpg', '.jpeg', '.png'];

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ALLOWED_MIME.includes(file.mimetype) || ALLOWED_EXT.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPG, JPEG, and PNG images are allowed.'), false);
  }
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
});

// Labels often distribute declarations across several panels. Keep the limit
// bounded so one request cannot exhaust OCR/Cloudinary resources.
const uploadScanImages = (req, res, next) => {
  upload.fields([
    { name: 'images', maxCount: 4 },
    { name: 'images[]', maxCount: 4 },
  ])(req, res, (err) => {
    if (err) return next(err);
    const files = [...(req.files?.images || []), ...(req.files?.['images[]'] || [])];
    if (files.length < 1 || files.length > 4) {
      return next(new Error('Upload between 1 and 4 product-label images.'));
    }
    req.scanFiles = files;
    return next();
  });
};

module.exports = { upload, uploadScanImages };
