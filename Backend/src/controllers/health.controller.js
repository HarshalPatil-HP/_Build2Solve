// GET /api/health — returns server vitals for uptime monitors and smoke tests.

const { ApiResponse } = require('../utils');

const getHealth = (req, res) => {
  const data = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())}s`,
  };

  res.status(200).json(new ApiResponse(200, data, 'Server is healthy'));
};

module.exports = { getHealth };
