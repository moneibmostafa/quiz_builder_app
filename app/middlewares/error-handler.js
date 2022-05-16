const { logger } = require('../logger');

module.exports = (err, req, res, next) => {
  if (err.statusCode) {
    res.status(err.statusCode).json({
      message: err.message,
      details: err.details,
      error: err,
    });
  } else {
    logger.log('error', err);
    res.status(500).json({
      message: 'internal server error',
      details: 'unknown error occured',
    });
  }
  return next();
};
