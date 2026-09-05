/**
 * Application configuration — single source of truth for all env vars.
 *
 * Every module that needs a config value imports it from here rather than
 * reading process.env directly. This makes it easy to validate, default,
 * and mock config in tests.
 */

const config = {
  // ---- Server ----
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 5000,

  // ---- MongoDB ----
  mongodbUri: process.env.MONGODB_URI || '',

  // ---- JWT ----
  jwtSecret: process.env.JWT_SECRET || '',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',

  // ---- Cloudinary ----
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
  },

  // ---- CORS ----
  corsOrigins: process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map((o) => o.trim())
    : ['http://localhost:3000'],

  // ---- Misc ----
  isDev() {
    return this.nodeEnv === 'development';
  },
  isProd() {
    return this.nodeEnv === 'production';
  },
};

module.exports = config;
