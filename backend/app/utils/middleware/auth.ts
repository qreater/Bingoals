/*************************
 *
 * Copyright 2025 @Qreater
 * Licensed under the Apache License, Version 2.0.
 * See: http://www.apache.org/licenses/LICENSE-2.0
 *
 *************************/

import jwt, { JwtPayload } from 'jsonwebtoken'
import { Response, NextFunction } from 'express'
import { APIError } from '../responses/error'
import { readEntity } from '../database/mongo'
import { IUserDocument, User } from '../../models/user'
import { config } from '../settings/config'
import { AuthRequest } from '../interfaces/common'

interface DecodedToken extends JwtPayload {
    username: string
}

export const authMiddleware = async (
    request: AuthRequest,
    _response: Response,
    next: NextFunction,
) => {
    const token = request.headers['authorization']?.split(' ')[1] as string
    if (!token) {
        throw APIError.unauthorized()
    }

    const decoded = jwt.verify(token, config.jwtSecret) as DecodedToken
    const user = await readEntity<IUserDocument>(User, {
        username: decoded.username,
    })

    if (!user) {
        throw APIError.notFound('User', decoded.username)
    }

    request.user = user
    next()
}
