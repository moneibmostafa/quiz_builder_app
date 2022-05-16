const userSchema = require('./user');
const quizSchema = require('./quiz');
const questionSchema = require('./question');
const answersSchema = require('./answers');
const quizSessionSchema = require('./quizSession');

module.exports = {
  userSchema,
  quizSchema,
  questionSchema,
  answersSchema,
  quizSessionSchema,
};
