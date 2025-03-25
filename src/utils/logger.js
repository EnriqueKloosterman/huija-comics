// Logger
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf, colorize, json } = format;

// Formato de los logs
const logFormat = printf(({ level, message, label, timestamp}) => {
    return `${timestamp} [${label}] [${level}]: ${message}`
});

// Cofiguración de Wiston
const logger = createLogger({
    level: 'info',
    format: combine(
        colorize(),
        label({ label: 'Express' }),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        // logFormat
        json()
    ),
    transports: [
        new transports.Console({
            format: combine(
                colorize(),
                label({ label: 'Express' }),
                logFormat
            )
        }),
        new transports.File({ filename: 'logs/error.json', level: 'error' }),
        new transports.File({ filename: 'logs/combined.json' })
    ]
})

module.exports = logger;