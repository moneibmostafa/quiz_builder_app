const { Sequelize, DataTypes } = require('sequelize');
const db = require('../database');
const { QuizSession } = require('./quizSession');
const { Question } = require('./question');
const { Answer } = require('./answer');

const QuizSessionQuestionAnswer = db.define(
  'quizSessionQuestionAnswer',
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    quizSessionId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    questionId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    answerId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    score: {
      type: Sequelize.FLOAT,
      validate: {
        min: -1,
        max: 1,
      },
    },
    correct: {
      type: DataTypes.BOOLEAN,
    },
    solvedSoln: {
      type: Sequelize.STRING,
      validate: {
        len: {
          args: [2, 100],
          msg: 'Invalid text',
        },
      },
    },
  },
  {
    timestamps: true,
    freezeTableName: true,
  }
);
QuizSessionQuestionAnswer.belongsTo(QuizSession);
QuizSession.hasMany(QuizSessionQuestionAnswer);

QuizSessionQuestionAnswer.belongsTo(Question);
Question.hasMany(QuizSessionQuestionAnswer);

QuizSessionQuestionAnswer.belongsTo(Answer);
Answer.hasMany(QuizSessionQuestionAnswer);

module.exports = { QuizSessionQuestionAnswer };
