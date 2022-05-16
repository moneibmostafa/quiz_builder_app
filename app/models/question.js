const { Sequelize, DataTypes } = require('sequelize');
const db = require('../database');
const { Quiz } = require('./quiz');

const Question = db.define(
  'question',
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    multipleAnswer: {
      type: Sequelize.BOOLEAN,
      default: false,
    },
    text: {
      type: Sequelize.STRING,
      validate: {
        len: {
          args: [3, 100],
          msg: 'Invalid text',
        },
      },
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
Question.belongsTo(Quiz);
Quiz.hasMany(Question);

module.exports = { Question };
