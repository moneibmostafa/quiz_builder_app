const Joi = require('joi');
const validateRequest = require('./validateRequest');

function quizCreateRequestSchema(req, res, next) {
  const quiz = Joi.object({
    title: Joi.string().min(3).max(50).required(),
  });
  validateRequest(req, res, next, quiz);
}

module.exports = {
  quizCreateRequestSchema,
};
