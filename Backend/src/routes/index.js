// Central route registry — all feature routers are mounted here.

const healthRoutes = require('./healthRoutes');

const mountRoutes = (app) => {
  app.use('/api/health', healthRoutes);
};

module.exports = mountRoutes;
