const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');

// Format personnalisé pour les logs
const logFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
);

// Format console avec couleurs
const consoleFormat = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
        let msg = `${timestamp} [${level}]: ${message}`;
        if (Object.keys(meta).length > 0) {
            msg += ` ${JSON.stringify(meta)}`;
        }
        return msg;
    })
);

// Transport pour les erreurs (rotation quotidienne)
const errorFileTransport = new DailyRotateFile({
    filename: path.join('logs', 'error-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    level: 'error',
    maxFiles: '30d',
    maxSize: '20m',
    format: logFormat
});

// Transport pour tous les logs (rotation quotidienne)
const combinedFileTransport = new DailyRotateFile({
    filename: path.join('logs', 'combined-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    maxFiles: '14d',
    maxSize: '20m',
    format: logFormat
});

// Configuration du logger
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: logFormat,
    transports: [
        errorFileTransport,
        combinedFileTransport
    ],
    exceptionHandlers: [
        new DailyRotateFile({
            filename: path.join('logs', 'exceptions-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            maxFiles: '30d',
            maxSize: '20m'
        })
    ],
    rejectionHandlers: [
        new DailyRotateFile({
            filename: path.join('logs', 'rejections-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            maxFiles: '30d',
            maxSize: '20m'
        })
    ]
});

// En développement, log aussi dans la console
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: consoleFormat
    }));
}

// Méthodes helper pour logger facilement
logger.logRequest = (req, message = 'Request') => {
    logger.info(message, {
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        userId: req.tokenUserId || 'anonymous'
    });
};

logger.logError = (err, req = null) => {
    const errorInfo = {
        message: err.message,
        stack: err.stack,
        ...(req && {
            method: req.method,
            url: req.originalUrl,
            ip: req.ip,
            userId: req.tokenUserId || 'anonymous'
        })
    };
    logger.error('Error occurred', errorInfo);
};

module.exports = logger;
