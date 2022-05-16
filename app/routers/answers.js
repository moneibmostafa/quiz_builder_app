const express = require('express');
const { logger } = require('../logger');
const { answersController } = require('../controllers');
const schemas = require('../schemas');

const { answersCreateRequestSchema } = schemas.answersSchema;
const router = express.Router();

router.post(
  '/create/:questionId',
  answersCreateRequestSchema,
  async (req, res, next) => {
    try {
      logger.log('info', 'Processing Create Answers Request');
      const { user, body } = req;
      const { questionId } = req.params;
      const question = await answersController.addAnswers(
        user,
        questionId,
        body
      );
      res.status(201).json(question);
      return next();
    } catch (err) {
      return next(err);
    }
  }
);

module.exports = router;
