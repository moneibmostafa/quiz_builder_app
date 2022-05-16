const winston = require('winston');
const { createLogger, format, transports } = require('winston');

const { combine, printf } = format;
const myFormat = printf(({ level, message, timestamp, ...metadata }) => {
  let msg = `${timestamp} [${level}] : ${message} `;
  if (metadata) {
    msg += JSON.stringify(metadata);
  }
  return msg;
});

class Logger {
  constructor() {
    if (Logger.instance) {
      return Logger.instance;
    }
    Logger.instance = this;
    this.loggerObj = createLogger({
      level: 'info',
      format: combine(
        format.colorize(),
        format.splat(),
        format.timestamp(),
        myFormat
      ),
      transports: [
        new transports.File({
          filename: './logs/error.log',
          level: 'error',
          format: winston.format.json(),
        }),
        new transports.File({
          filename: './logs/logfile.log',
          format: winston.format.json(),
        }),
        new transports.File({
          filename: './logs/uncaughtExceptions.log',
          format: winston.format.json(),
          // handle exceptions outside of express.js
          handleExceptions: true,
        }),
        new transports.Http({
          level: 'info',
          format: winston.format.json(),
        }),
        new transports.Console({
          level: 'info',
          handleExceptions: true,
        }),
      ],
    });
    winston.add(this.loggerObj);
    // handle unhandled promises
    process.on('unhandledRejection', (ex) => {
      throw ex;
    });
  }

  log(level = 'info', message, metadata = undefined) {
    try {
      if (level !== 'error' && level !== 'info' && level !== 'warn') {
        throw new Error('Logger level is invalid');
      }
      if (metadata) return winston.log(level, message, metadata);
      return winston.log(level, message);
    } catch (err) {
      return winston.log('error', err.message, err);
    }
  }
}

const logger = new Logger();
if (logger) logger.log('info', 'Logger started successfully');

module.exports = logger;
