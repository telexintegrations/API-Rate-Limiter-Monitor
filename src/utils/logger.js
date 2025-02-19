const winston = require('winston');
const fs = require('fs');
const path = require('path');

// Ensure 'logs' directory exists
const logDirectory = path.join(__dirname, 'logs');
if (!fs.existsSync(logDirectory)) {
  console.log("Logs directory not found. Creating 'logs' directory...");
  fs.mkdirSync(logDirectory, { recursive: true });
}

// Create logger with file and console transport
const logger = winston.createLogger({
  level: 'info', // Log at the "info" level and above
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({
      filename: path.join(logDirectory, 'combined.log'), // Ensure log is written here
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
    }),
  ],
});

// Test the logger
logger.info('Logger is working!'); // Log a test message
logger.error('This is an error message.'); // Log an error

module.exports = logger;