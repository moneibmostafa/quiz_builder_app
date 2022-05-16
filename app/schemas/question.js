const Joi = require('joi');
const validateRequest = require('./validateRequest');

function questionCreateRequestSchema(req, res, next) {
  const question = Joi.object({
    text: Joi.string().min(3).max(100).required(),
    multipleAnswer: Joi.boolean().required(),
    quizId: Joi.string().uuid().required(),
  });
  validateRequest(req, res, next, question);
}

function questionEditRequestSchema(req, res, next) {
  const question = Joi.object({
    text: Joi.string().min(3).max(100).required(),
    quizId: Joi.string().uuid().required(),
  });
  validateRequest(req, res, next, question);
}

module.exports = {
  questionCreateRequestSchema,
  questionEditRequestSchema,
};
