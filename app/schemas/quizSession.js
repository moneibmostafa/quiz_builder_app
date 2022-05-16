const Joi = require('joi');
const validateRequest = require('./validateRequest');

function quizSessionSubmitRequestSchema(req, res, next) {
  const answerId = Joi.string().uuid();
  const question = Joi.object({
    questionId: Joi.string().uuid().required(),
    answers: Joi.array().min(0).max(5).items(answerId),
  });
  const quizSession = Joi.object({
    quizSessionId: Joi.string().uuid().required(),
    questions: Joi.array().min(1).max(10).items(question),
  });
  validateRequest(req, res, next, quizSession);
}

module.exports = {
  quizSessionSubmitRequestSchema,
};
