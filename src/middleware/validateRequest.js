export const requireBodyFields = requiredFields => (req, res, next) => {
  const body = req.body || {};

  const missing = requiredFields.filter(field => {
    const value = body[field];
    return value === undefined || value === null || value === '';
  });

  if (missing.length > 0) {
    return res.status(400).json({
      success: false,
      error: `Missing required field(s): ${missing.join(', ')}`
    });
  }

  return next();
};
