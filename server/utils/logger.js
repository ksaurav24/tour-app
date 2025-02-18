const winston = require('winston');
require('winston-daily-rotate-file');
const { format, transports } = winston;
const path = require('path');

// Custom log levels
const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug: 5,
    silly: 6
  },
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    verbose: 'cyan',
    debug: 'blue',
    silly: 'gray'
  }
};

// Custom format
const customFormat = format.printf(({ level, message, timestamp, ...metadata }) => {
  let msg = `${timestamp} [${level.toUpperCase()}]: ${message}`;
  if (Object.keys(metadata).length > 0) {
    msg += ` ${JSON.stringify(metadata, null, 2)}`;
  }
  return msg;
});

// Environment-based configurations
// eslint-disable-next-line no-undef
const isProd = process.env.NODE_ENV === 'production';
const logDir = 'logs';

// Create the logger
const logger = winston.createLogger({
  levels: customLevels.levels,
  level: isProd ? 'info' : 'debug',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  transports: [
    // Console transport
    new transports.Console({
      format: format.combine(
        format.colorize({ all: true }),
        customFormat
      )
    }),

    
    // Rotating file transport for errors
    new transports.DailyRotateFile({
      filename: path.join(logDir, 'error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      level: 'error',
      format: customFormat
    }),
    
    // Rotating file transport for all logs
    new transports.DailyRotateFile({
      filename: path.join(logDir, 'combined-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      format: customFormat
    })
  ],
  
  exceptionHandlers: [
    new transports.File({ filename: path.join(logDir, 'exceptions.log') })
  ],
  rejectionHandlers: [
    new transports.File({ filename: path.join(logDir, 'rejections.log') })
  ]
});

// Add colors to Winston
winston.addColors(customLevels.colors);


// Export a function to get a namespaced logger
module.exports = function getLogger(namespace) {
  return logger.child({ namespace });
};
