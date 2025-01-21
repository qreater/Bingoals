/*************************
 *
 * Copyright 2025 @Qreater
 * Licensed under the Apache License, Version 2.0.
 * See: http://www.apache.org/licenses/LICENSE-2.0
 *
 *************************/

import { Request, Response, NextFunction } from 'express'
import { validationResult, ValidationChain } from 'express-validator'
import { APIError } from '../responses/error'

const validate = (validationSchema: ValidationChain[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        await Promise.all(
            validationSchema.map((validation) => validation.run(req)),
        )

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            const error = errors
                .array()
                .map((err) => err.msg)
                .join(', ')
            throw APIError.validation('Payload', error)
        }
        next()
    }
}

export default validate
