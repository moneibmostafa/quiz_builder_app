const { Sequelize, DataTypes } = require('sequelize');
const db = require('../database');
const { User } = require('./user');
const { Quiz } = require('./quiz');

const QuizSession = db.define(
  'quizSession',
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    quizOwnerId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    userId: {
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
QuizSession.belongsTo(User);
User.hasMany(QuizSession);

QuizSession.belongsTo(Quiz);
Quiz.hasMany(QuizSession);

module.exports = { QuizSession };
