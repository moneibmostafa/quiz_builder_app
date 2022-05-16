const Joi = require('joi');
const validateRequest = require('./validateRequest');

function userAuthRequestSchema(req, res, next) {
  const userAuth = Joi.object({
    email: Joi.string().max(30).email().required(),
    password: Joi.string().min(8).max(12).required(),
  });
  validateRequest(req, res, next, userAuth);
}

module.exports = {
  userAuthRequestSchema,
};
