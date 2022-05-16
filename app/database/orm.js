const Sequelize = require('sequelize');
const config = require('../config');
const { logger } = require('../logger');

const sequelize = new Sequelize(
  `${config.db.dialect}://${config.db.username}:${config.db.password}@${config.db.host}:${config.db.port}/${config.db.database}`,
  {
    logging: function (str) {
      logger.log('info', `Sequelize: ${str}`);
    },
  }
);

sequelize
  .authenticate()
  .then(() => {
    logger.log(
      'info',
      'Database connection has been established successfully.'
    );
  })
  .catch((error) => {
    logger.log('error', 'Unable to connect to the database:', error);
  });

sequelize
  .sync({ alter: true })
  .then(() => logger.log('info', 'sync successful.'))
  .catch((error) => logger.log('error', 'sync failure', error));

module.exports = sequelize;
