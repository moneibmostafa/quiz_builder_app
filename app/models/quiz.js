const { Sequelize, DataTypes } = require('sequelize');
const db = require('../database');
const { User } = require('./user');

const Quiz = db.define(
  'quiz',
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    published: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    deleted: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    title: {
      type: Sequelize.STRING,
      validate: {
        len: {
          args: [3, 50],
          msg: 'Invalid title',
        },
      },
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    freezeTableName: true,
  }
);
Quiz.belongsTo(User);
User.hasMany(Quiz);

module.exports = { Quiz };
