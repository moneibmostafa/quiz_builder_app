const express = require('express');
const { logger } = require('../logger');
const { quizSessionController } = require('../controllers');
const schemas = require('../schemas');

const { quizSessionSubmitRequestSchema } = schemas.quizSessionSchema;
const router = express.Router();

router.post('/open/:quizId', async (req, res, next) => {
  try {
    logger.log('info', 'Processing User Start Quiz Request');
    const { user } = req;
    const { quizId } = req.params;
    const quizSession = await quizSessionController.startQuizSession(
      user,
      quizId
    );
    res.status(201).json(quizSession);
    return next();
  } catch (err) {
    return next(err);
  }
});

router.get('/openedSessions', async (req, res, next) => {
  try {
    logger.log('info', 'Processing Fetch Solver Opened Quiz Sessions Request');
    const { user } = req;
    const sessions = await quizSessionController.getOpenedSessions(user);
    res.status(200).json(sessions);
    return next();
  } catch (err) {
    return next(err);
  }
});

router.post(
  '/submit',
  quizSessionSubmitRequestSchema,
  async (req, res, next) => {
    try {
      logger.log('info', 'Processing User Submit Quiz Answers Request');
      const { user, body } = req;
      const quiz = await quizSessionController.submitQuizAnswers(user, body);
      res.status(201).json(quiz);
      return next();
    } catch (err) {
      return next(err);
    }
  }
);

router.get('/solver/stats/:quizSessionId', async (req, res, next) => {
  try {
    logger.log('info', 'Processing Fetch Solver Submitted Quiz Stats Request');
    const { user } = req;
    const { quizSessionId } = req.params;
    const quiz = await quizSessionController.getQuizStatsSolver(
      user,
      quizSessionId
    );
    res.status(200).json(quiz);
    return next();
  } catch (err) {
    return next(err);
  }
});

router.get('/solver/solutions/:quizSessionId', async (req, res, next) => {
  try {
    logger.log(
      'info',
      'Processing Fetch Solver Submitted Quiz Solutions Request'
    );
    const { user } = req;
    const { quizSessionId } = req.params;
    const quiz = await quizSessionController.getSolverSolutions(
      user,
      quizSessionId
    );
    res.status(200).json(quiz);
    return next();
  } catch (err) {
    return next(err);
  }
});

router.get('/owner/stats/:quizSessionId', async (req, res, next) => {
  try {
    logger.log(
      'info',
      'Processing Fetch Solver Submitted Quiz Solutions Request'
    );
    const { user } = req;
    const { quizSessionId } = req.params;
    const quiz = await quizSessionController.getUserQuizSolutions(
      user,
      quizSessionId
    );
    res.status(200).json(quiz);
    return next();
  } catch (err) {
    return next(err);
  }
});

router.get('/ownerOpenedSessions/:quizId', async (req, res, next) => {
  try {
    logger.log('info', 'Processing Fetch Owner Opened Quiz Sessions Request');
    const { user } = req;
    const { quizId } = req.params;
    const { page } = req.query;
    const { limit } = req.query;
    const sessions = await quizSessionController.getSpecificQuizOpenSessions(
      user,
      quizId,
      page,
      limit
    );
    res.status(200).json(sessions);
    return next();
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
