// Express app setup — separated from server.js so tests can import without starting a listener.

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const config = require('./config');
const mountRoutes = require('./routes');
const { errorHandler } = require('./middleware');
const { ApiError } = require('./utils');

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: config.corsOrigins,
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 'dev' = concise colored output, 'combined' = Apache-style for production log aggregation
app.use(morgan(config.isDev() ? 'dev' : 'combined'));

mountRoutes(app);

// 404 catch-all
app.use((req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
});

// Global error handler — must be last
app.use(errorHandler);

module.exports = app;
