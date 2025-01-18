/*************************
 *
 * Copyright 2025 @Qreater
 * Licensed under the Apache License, Version 2.0.
 * See: http://www.apache.org/licenses/LICENSE-2.0
 *
 *************************/

import { Request, Response, NextFunction } from 'express'

export const validateSchema = (schema: any) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.body)
        if (error) {
            return res.status(422).json({ message: error.details[0].message })
        }
        next()
    }
}
