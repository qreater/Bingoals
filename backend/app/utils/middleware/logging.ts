/*************************
 *
 * Copyright 2025 @Qreater
 * Licensed under the Apache License, Version 2.0.
 * See: http://www.apache.org/licenses/LICENSE-2.0
 *
 *************************/

import { Request, Response, NextFunction } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { logger } from '../tools/logger'

export const loggingMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const requestId = uuidv4()

    ;(req as any).requestId = requestId

    res.setHeader('X-Request-ID', requestId)
    res.setHeader('X-Correlation-ID', requestId)

    const startTime = process.hrtime.bigint()

    res.on('finish', () => {
        const endTime = process.hrtime.bigint()
        const durationMs = Number(endTime - startTime) / 1_000_000

        logger.info({
            request_id: requestId,
            correlation_id: requestId,
            request: {
                method: req.method,
                path: req.originalUrl,
                query: req.query,
                body: req.body,
            },
            response: {
                status: res.statusCode,
            },
            duration_ms: durationMs,
        })
    })

    next()
}
