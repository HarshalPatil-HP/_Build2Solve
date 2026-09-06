// Server entry point — connects to MongoDB Atlas, starts Express, handles graceful shutdown.

require('dotenv').config();

const app = require('./app');
const config = require('./config');
const connectDB = require('./config/db');

let server;

const startServer = async () => {
  await connectDB();

  server = app.listen(config.port, () => {
    console.log(`[server] ${config.nodeEnv} | port ${config.port} | http://localhost:${config.port}/api/health`);
  });
};

startServer();

const shutdown = (signal) => {
  console.log(`\n${signal} received — shutting down gracefully…`);
  if (server) {
    server.close(() => {
      console.log('HTTP server closed.');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

process.on('unhandledRejection', (err) => {
  console.error('[UNHANDLED REJECTION]', err);
  if (server) {
    server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});

process.on('uncaughtException', (err) => {
  console.error('[UNCAUGHT EXCEPTION]', err);
  process.exit(1);
});
