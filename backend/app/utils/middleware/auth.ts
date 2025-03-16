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

/**
 * CORE Functions
 *
 * These functions are the core utility functions that are used by the auth middleware.
 *
 */

const extractToken = (request: AuthRequest): string => {
    const authHeader = request.headers['authorization'] as string
    if (!authHeader?.startsWith('Bearer ')) {
        throw APIError.unauthorized()
    }

    const token = authHeader.split(' ')[1]
    if (!token) {
        throw APIError.unauthorized()
    }

    return token
}

const verifyToken = (token: string): DecodedToken => {
    try {
        return jwt.verify(token, config.jwtSecret) as DecodedToken
    } catch {
        throw APIError.unauthorized()
    }
}

const getUserFromToken = async (
    decoded: DecodedToken,
): Promise<IUserDocument> => {
    const user = await readEntity<IUserDocument>(User, {
        username: decoded.username,
    })
    if (!user) {
        throw APIError.notFound('User', decoded.username)
    }
    return user
}

/**
 * Middleware Functions
 *
 * This function is the used by the authenticated routes to verify the user's token.
 *
 */

export const authMiddleware = async (
    request: AuthRequest,
    _response: Response,
    next: NextFunction,
) => {
    const token = extractToken(request)
    const decoded = verifyToken(token)
    request.user = await getUserFromToken(decoded)
    next()
}
