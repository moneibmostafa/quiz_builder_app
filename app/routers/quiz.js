const express = require('express');
const { logger } = require('../logger');
const { quizController } = require('../controllers');
const schemas = require('../schemas');

const { quizCreateRequestSchema } = schemas.quizSchema;
const router = express.Router();

router.post('/create', quizCreateRequestSchema, async (req, res, next) => {
  try {
    logger.log('info', 'Processing User Create Quiz Request');
    const { user, body } = req;
    const quiz = await quizController.createQuiz(user, body);
    res.status(201).json(quiz);
    return next();
  } catch (err) {
    return next(err);
  }
});

router.get('/userCreatedQuizzes/:type', async (req, res, next) => {
  // published or unpublished or all
  try {
    logger.log('info', 'Processing User Fetch Own Created Quizzes Request');
    const { type } = req.params;
    const { user } = req;
    const quizzes = await quizController.getUserCreatedQuizzes(user, type);
    res.status(200).json(quizzes);
    return next();
  } catch (err) {
    return next(err);
  }
});

router.get('/fetchPublishedQuiz/:quizId', async (req, res, next) => {
  try {
    logger.log('info', 'Processing Fetch Quiz Request');
    const { quizId } = req.params;
    const quiz = await quizController.getPublishedQuiz(quizId);
    res.status(200).json(quiz);
    return next();
  } catch (err) {
    return next(err);
  }
});

router.get('/visitorPublishedQuizzes', async (req, res, next) => {
  try {
    logger.log('info', 'Processing Visitor Fetch Published Quizzes Request');
    const { user } = req;
    const quizzes = await quizController.getVisitorPublishedQuizzes(user);
    res.status(200).json(quizzes);
    return next();
  } catch (err) {
    return next(err);
  }
});

router.patch('/publish/:quizId', async (req, res, next) => {
  try {
    logger.log('info', 'Processing User Publish Quiz Request');
    const { user } = req;
    const { quizId } = req.params;
    const quiz = await quizController.publishQuiz(user, quizId);
    res.status(200).json(quiz);
    return next();
  } catch (err) {
    return next(err);
  }
});

router.delete('/delete/:quizId', async (req, res, next) => {
  try {
    logger.log('info', 'Processing User Delete Quiz Request');
    const { user } = req;
    const { quizId } = req.params;
    const quiz = await quizController.deleteQuiz(user, quizId);
    res.status(200).json(quiz);
    return next();
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
