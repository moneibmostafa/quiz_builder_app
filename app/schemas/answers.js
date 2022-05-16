const Joi = require('joi');
const validateRequest = require('./validateRequest');

function answersCreateRequestSchema(req, res, next) {
  const answer = Joi.object({
    text: Joi.string().min(2).max(100),
    correct: Joi.boolean(),
  });
  const answers = Joi.array().min(2).max(5).items(answer);
  validateRequest(req, res, next, answers);
}

module.exports = {
  answersCreateRequestSchema,
};
