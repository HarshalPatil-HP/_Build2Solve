/**
 * Health-check controller.
 *
 * Returns basic server vitals. The /api/health endpoint is used by
 * load balancers, uptime monitors, and CI smoke-tests to confirm the
 * API is reachable and running.
 */
const { ApiResponse, asyncHandler } = require('../utils');

const getHealth = asyncHandler(async (req, res) => {
  const data = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())}s`,
  };

  res.status(200).json(new ApiResponse(200, data, 'Server is healthy'));
});

module.exports = { getHealth };
