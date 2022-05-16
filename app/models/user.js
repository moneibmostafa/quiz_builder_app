const { Sequelize, DataTypes } = require('sequelize');
const db = require('../database');

const User = db.define(
  'user',
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    email: {
      type: Sequelize.STRING,
      unique: true,
      validate: {
        min: 5,
        max: 30,
      },
    },
    password: {
      type: Sequelize.STRING,
      validate: {
        len: {
          args: [8, 100],
          msg: 'Invalid password length',
        },
      },
    },
  },
  {
    timestamps: true,
    freezeTableName: true,
  }
);

module.exports = { User };
