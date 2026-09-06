const authorize = (allowedRoles) => (req, res, next) => {
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'Forbidden',
      code: 'FORBIDDEN',
    });
  }
  next();
};

module.exports = authorize;
