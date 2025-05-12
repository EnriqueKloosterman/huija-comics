// Logger
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, colorize, json, prettyPrint, errors } = format;



// Cofiguración de Wiston
const logger = createLogger({
    transports: [
        new transports.Console({
            level: 'info',
            format: combine(
                colorize(),
                label({ label: 'Express' }),
                timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                prettyPrint()
            )
        }),
        new transports.File({
            filename: 'logs/error.json', 
            level: 'error', 
            format: combine(
                errors({ stack: true }),
                label({ label: 'Express' }),
                timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                json()
            )
        }),
        new transports.File({ 
            filename: 'logs/combined.json', 
            level: 'info',
            format: combine(
                errors({ stack: true }),
                label({ label: 'Express' }),
                timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                json()
            )
        })
    ]
})

module.exports = logger;