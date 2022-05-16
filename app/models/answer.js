const { Sequelize, DataTypes } = require('sequelize');
const db = require('../database');
const { Quiz } = require('./quiz');
const { Question } = require('./question');

const Answer = db.define(
  'answer',
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    correct: {
      type: Sequelize.BOOLEAN,
      default: false,
    },
    text: {
      type: Sequelize.STRING,
      validate: {
        len: {
          args: [2, 100],
          msg: 'Invalid text',
        },
      },
    },
    weight: {
      type: Sequelize.FLOAT,
      validate: {
        min: 0,
        max: 1,
      },
    },
    questionId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    quizId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    freezeTableName: true,
  }
);
Answer.belongsTo(Question);
Question.hasMany(Answer);

Answer.belongsTo(Quiz);
Quiz.hasMany(Answer);

module.exports = { Answer };
