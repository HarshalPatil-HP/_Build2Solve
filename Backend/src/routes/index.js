const authRoutes = require('./auth.route');
const scanRoutes = require('./scan.route');
const complaintRoutes = require('./complaint.route');
const caseRoutes = require('./case.route');
const companyRoutes = require('./company.route');
const ruleRoutes = require('./rule.route');
const dashboardRoutes = require('./dashboard.route');
const healthRoutes = require('./health.route');

const mountRoutes = (app) => {
  app.use('/api/health', healthRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api/scans', scanRoutes);
  app.use('/api/complaints', complaintRoutes);
  app.use('/api/cases', caseRoutes);
  app.use('/api/companies', companyRoutes);
  app.use('/api/rules', ruleRoutes);
  app.use('/api/dashboard', dashboardRoutes);
};

module.exports = mountRoutes;
