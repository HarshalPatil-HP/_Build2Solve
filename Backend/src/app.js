/**
 * Express application setup.
 *
 * This module configures the Express instance with:
 *  - Security headers (helmet)
 *  - CORS (configured via env)
 *  - JSON body parsing
 *  - HTTP request logging (morgan)
 *  - All API routes (via the central route registry)
 *  - 404 catch-all
 *  - Global error handler
 *
 * Separated from server.js so the app can be imported by tests without
 * starting a listening server.
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const config = require('./config');
const mountRoutes = require('./routes');
const { errorHandler } = require('./middleware');
const { ApiError } = require('./utils');

// ── Create Express app ──────────────────────────────────────────────
const app = express();

// ── Security headers ────────────────────────────────────────────────
app.use(helmet());

// ── CORS ────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: config.corsOrigins,
    credentials: true,
  })
);

// ── Body parsers ────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── HTTP request logging ────────────────────────────────────────────
// 'dev' format = concise colored output for local development
// 'combined' = Apache-style logs for production log aggregation
app.use(morgan(config.isDev() ? 'dev' : 'combined'));

// ── API routes ──────────────────────────────────────────────────────
mountRoutes(app);

// ── 404 catch-all ───────────────────────────────────────────────────
// Any request that doesn't match a registered route lands here.
// Express 5 requires named wildcard params (path-to-regexp v8 syntax).
app.use((req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
});

// ── Global error handler (must be last) ─────────────────────────────
app.use(errorHandler);

module.exports = app;
