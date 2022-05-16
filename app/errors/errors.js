/* eslint-disable max-classes-per-file */
const httpStatusCodes = require('./httpStatusCodes');
const BaseError = require('./baseError');

class BadRequest extends BaseError {
  constructor(message, details) {
    super(httpStatusCodes.BAD_REQUEST, message, details);
  }
}

class Unauthorized extends BaseError {
  constructor(message, details) {
    super(httpStatusCodes.UNAUTHORIZED, message, details);
  }
}

class Forbidden extends BaseError {
  constructor(message, details) {
    super(httpStatusCodes.FORBIDDEN, message, details);
  }
}

class NotFound extends BaseError {
  constructor(message, details) {
    super(httpStatusCodes.NOT_FOUND, message, details);
  }
}

class Conflict extends BaseError {
  constructor(message, details) {
    super(httpStatusCodes.CONFLICT, message, details);
  }
}

class UnprocessableEntity extends BaseError {
  constructor(message, details) {
    super(httpStatusCodes.UNPROCESSABLE_ENTITY, message, details);
  }
}

class ServerError extends BaseError {
  constructor(message, details) {
    super(httpStatusCodes.INTERNAL_SERVER_ERROR, message, details);
  }
}

module.exports = {
  BadRequest,
  Unauthorized,
  Forbidden,
  NotFound,
  Conflict,
  UnprocessableEntity,
  ServerError,
};
