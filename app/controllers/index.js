const UserController = require('./user.controller');
const QuizController = require('./quiz.controller');
const QuestionController = require('./question.controller');
const AnswersController = require('./answers.controller');
const QuizSessionController = require('./quizSession.controller');

const {
  UserAdaptor,
  QuizAdaptor,
  QuestionAdaptor,
  AnswersAdaptor,
  QuizSessionAdaptor,
  QuizSessionQuestionAnswerAdaptor,
} = require('../adaptors/database');

const userAdaptor = new UserAdaptor();
const quizAdaptor = new QuizAdaptor();
const questionAdaptor = new QuestionAdaptor();
const answerAdaptor = new AnswersAdaptor();
const quizSessionAdaptor = new QuizSessionAdaptor();
const quizSessionQuestionAnswerAdaptor = new QuizSessionQuestionAnswerAdaptor();

const userController = new UserController(userAdaptor);
Object.freeze(userController);

const quizController = new QuizController(
  quizAdaptor,
  questionAdaptor,
  answerAdaptor
);
Object.freeze(quizController);

const questionController = new QuestionController(
  questionAdaptor,
  quizAdaptor,
  answerAdaptor
);
Object.freeze(questionController);

const answersController = new AnswersController(
  answerAdaptor,
  quizAdaptor,
  questionAdaptor
);
Object.freeze(answersController);

const quizSessionController = new QuizSessionController(
  quizSessionAdaptor,
  userAdaptor,
  quizAdaptor,
  questionAdaptor,
  answerAdaptor,
  quizSessionQuestionAnswerAdaptor
);
Object.freeze(quizSessionController);

module.exports = {
  userController,
  quizController,
  questionController,
  answersController,
  quizSessionController,
};
