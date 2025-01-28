/*************************
 *
 * Copyright 2025 @Qreater
 * Licensed under the Apache License, Version 2.0.
 * See: http://www.apache.org/licenses/LICENSE-2.0
 *
 *************************/

import { Request, Response, NextFunction } from 'express'
import { logger } from '../tools/logger'
import { APIError } from '../responses/error'
import { AdvancedRequest } from '../interfaces/common'

export const errorHandlingMiddleware = (
    err: Error | APIError,
    req: Request,
    res: Response,
    _next: NextFunction,
) => {
    if (err instanceof APIError) {
        res.status(err.statusCode).json({
            status: 'FAILURE',
            error: {
                type: err.errorType,
                message: err.message,
                ...(err.additionalInfo && {
                    additionalInfo: err.additionalInfo,
                }),
            },
        })
    } else {
        res.status(500).json({
            status: 'FAILURE',
            error: {
                type: 'server_error',
                message: 'An unexpected error occurred',
            },
        })

        logger.error({
            alert: 'An unexpected error occurred',
            request_id: (req as unknown as AdvancedRequest).requestId,
            error: err.stack?.split('\n').slice(0, 3).join('\n'),
        })
    }
}
