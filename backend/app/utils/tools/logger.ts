/*************************
 *
 * Copyright 2025 @Qreater
 * Licensed under the Apache License, Version 2.0.
 * See: http://www.apache.org/licenses/LICENSE-2.0
 *
 *************************/

import winston from 'winston'

const consoleFormat = winston.format.combine(
    winston.format.colorize(),
    winston.format.printf(({ level, message, timestamp, ...metadata }) => {
        const formattedMessage =
            typeof message === 'object'
                ? JSON.stringify(message, null, 2)
                : message

        const meta = Object.keys(metadata).length
            ? `\n${JSON.stringify(metadata, null, 2)}`
            : ''

        return `[${timestamp}] ${level}: ${formattedMessage}${meta}`
    }),
)

export const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }),
        winston.format.json(),
    ),
    transports: [
        new winston.transports.Console({
            format: consoleFormat,
        }),
    ],
})
