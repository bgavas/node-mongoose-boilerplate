const { createLogger, format, transports } = require('winston');
const { colorize, combine, timestamp, simple } = format;
const constants = require('./../constants/constant');

// LOG lEVELS
// const levels = {
//     error: 0,
//     warn: 1,
//     info: 2,
//     verbose: 3,
//     debug: 4,
//     silly: 5
// };

const logger = createLogger({
    format: combine(
        timestamp(),
        simple()
    ),
    transports: [
        new transports.Console({
            format: combine(
                colorize(),
                timestamp(),
                simple()
            )
        }),
        // - Write all logs error (and below) to `error.log`.
        new transports.File({
            filename: 'log/error/error.log',
            level: 'error',
            maxFiles: constants.WINSTON_MAX_FILES,
            maxsize: constants.WINSTON_MAX_FILE_SIZE
        }),
        // - Write all logs warn (and below) to `warn.log`.
        new transports.File({
            filename: 'log/warn/warn.log',
            level: 'warn',
            maxFiles: constants.WINSTON_MAX_FILES,
            maxsize: constants.WINSTON_MAX_FILE_SIZE
        }),
        // - Write to all logs with level `info` and below to `combined.log` 
        new transports.File({
            filename: 'log/info/combined.log',
            level: 'info',
            maxFiles: constants.WINSTON_MAX_FILES,
            maxsize: constants.WINSTON_MAX_FILE_SIZE
        })
    ],
    exceptionHandlers: [
        new transports.Console({
            format: combine(
                colorize(),
                timestamp(),
                simple()
            )
        }),
        new transports.File({
            filename: 'log/exception/exception.log',
            maxFiles: constants.WINSTON_MAX_FILES,
            maxsize: constants.WINSTON_MAX_FILE_SIZE
        })
    ]
});

module.exports = logger;