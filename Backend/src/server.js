/**
 * Server entry point.
 *
 * Loads environment variables, then starts the Express server.
 * Database connection (Checkpoint 2) will be added here before
 * app.listen() so the server doesn't accept requests until the
 * DB is ready.
 *
 * Graceful shutdown handlers catch SIGINT/SIGTERM so in-flight
 * requests can complete before the process exits.
 */

// Load environment variables FIRST, before any other import
require('dotenv').config();

const app = require('./app');
const config = require('./config');

// ── Start server ────────────────────────────────────────────────────
const server = app.listen(config.port, () => {
  console.log(`
  ╔══════════════════════════════════════════════════╗
  ║  LM Compliance Checker API                      ║
  ║  Environment : ${config.nodeEnv.padEnd(33)}║
  ║  Port        : ${String(config.port).padEnd(33)}║
  ║  Health      : http://localhost:${config.port}/api/health    ║
  ╚══════════════════════════════════════════════════╝
  `);
});

// ── Graceful shutdown ───────────────────────────────────────────────
const shutdown = (signal) => {
  console.log(`\n${signal} received — shutting down gracefully…`);
  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

// Catch unhandled rejections / uncaught exceptions so they don't
// silently crash the process in production.
process.on('unhandledRejection', (err) => {
  console.error('[UNHANDLED REJECTION]', err);
  server.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
  console.error('[UNCAUGHT EXCEPTION]', err);
  process.exit(1);
});
