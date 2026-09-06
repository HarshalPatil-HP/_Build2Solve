const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const messages = error.details.map((d) => d.message);
    return res.status(400).json({
      success: false,
      message: messages.join('; '),
      code: 'VALIDATION_ERROR',
      errors: error.details.map((d) => ({ field: d.path.join('.'), message: d.message })),
    });
  }

  req.body = value;
  next();
};

module.exports = validate;
