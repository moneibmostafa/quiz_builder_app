const http = require('http');

const { logger } = require('./logger');
const config = require('./config');
const app = require('./startup');
require('./database');

const httpServer = http.createServer(app);
httpServer.listen(config.server.port, () => {
  logger.log('info', `Working on ${process.env.NODE_ENV} env`);
  logger.log('info', `Listening to port ${config.server.port}`);
});
