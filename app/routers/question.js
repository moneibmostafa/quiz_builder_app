const express = require('express');
const { logger } = require('../logger');
const { questionController } = require('../controllers');
const schemas = require('../schemas');

const { questionCreateRequestSchema, questionEditRequestSchema } =
  schemas.questionSchema;
const router = express.Router();

router.post('/create', questionCreateRequestSchema, async (req, res, next) => {
  try {
    logger.log('info', 'Processing Create Question Request');
    const { user, body } = req;
    const question = await questionController.createQuestion(user, body);
    res.status(201).json(question);
    return next();
  } catch (err) {
    return next(err);
  }
});

router.patch(
  '/edit/:questionId',
  questionEditRequestSchema,
  async (req, res, next) => {
    try {
      logger.log('info', 'Processing Edit Question Request');
      const { user, body } = req;
      const { questionId } = req.params;
      const question = await questionController.editQuestion(
        user,
        questionId,
        body
      );
      res.status(200).json(question);
      return next();
    } catch (err) {
      return next(err);
    }
  }
);

router.delete('/delete/:questionId', async (req, res, next) => {
  try {
    logger.log('info', 'Processing Delete Question Request');
    const { user } = req;
    const { questionId } = req.params;
    const deleted = await questionController.deleteQuestion(user, questionId);
    res.status(200).json(deleted);
    return next();
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
