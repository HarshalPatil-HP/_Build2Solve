/**
 * Health-check controller.
 *
 * Returns basic server vitals. The /api/health endpoint is used by
 * load balancers, uptime monitors, and CI smoke-tests to confirm the
 * API is reachable and running.
 */
const getHealth = (req, res) => {
  res.status(200).json({
    success: true,
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())}s`,
  });
};

module.exports = { getHealth };
