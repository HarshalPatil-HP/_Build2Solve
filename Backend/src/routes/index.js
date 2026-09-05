/**
 * Central route registry.
 *
 * Every feature's router is mounted here and then this single function
 * is called from app.js. This keeps app.js lean and makes it obvious
 * which URL prefixes map to which routers.
 *
 * New routers are added here as checkpoints progress:
 *   CP3 → /api/auth
 *   CP4 → /api/scan
 *   CP7 → /api/cases
 *   CP8 → /api/scans (history)
 */
const healthRoutes = require('./healthRoutes');

const mountRoutes = (app) => {
  app.use('/api/health', healthRoutes);

  // Future routes will be mounted here:
  // app.use('/api/auth',  authRoutes);
  // app.use('/api/scan',  scanRoutes);
  // app.use('/api/cases', caseRoutes);
  // app.use('/api/scans', scanHistoryRoutes);
};

module.exports = mountRoutes;
