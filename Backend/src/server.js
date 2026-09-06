// Server entry point — loads env vars, starts Express, handles graceful shutdown.

require('dotenv').config();

const app = require('./app');
const config = require('./config');

const server = app.listen(config.port, () => {
  console.log(`[server] ${config.nodeEnv} | port ${config.port} | http://localhost:${config.port}/api/health`);
});

const shutdown = (signal) => {
  console.log(`\n${signal} received — shutting down gracefully…`);
  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

process.on('unhandledRejection', (err) => {
  console.error('[UNHANDLED REJECTION]', err);
  server.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
  console.error('[UNCAUGHT EXCEPTION]', err);
  process.exit(1);
});
