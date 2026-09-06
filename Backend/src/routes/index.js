// Central route registry — all feature routers are mounted here.

const healthRoutes = require('./health.route');

const mountRoutes = (app) => {
  app.use('/api/health', healthRoutes);
};

module.exports = mountRoutes;
