class BaseError extends Error {
  constructor(statusCode, message, details) {
    super(details);

    Object.setPrototypeOf(this, new.target.prototype);
    this.message = message;
    this.statusCode = statusCode;
    Error.captureStackTrace(this);
  }
}

module.exports = BaseError;
