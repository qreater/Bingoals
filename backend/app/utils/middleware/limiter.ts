/*************************
 *
 * Copyright 2025 @Qreater
 * Licensed under the Apache License, Version 2.0.
 * See: http://www.apache.org/licenses/LICENSE-2.0
 *
 *************************/

import { NextFunction, Response } from 'express'

import { redis } from '../database/redis'

import { AuthRequest } from '../interfaces/common'
import { APIError } from '../responses/error'
import { logger } from '../tools/logger'
import { config, Environment } from '../settings/config'

export interface RateLimiterRule {
    windowMs: number
    max: number
}

const DEFAULT_RULE: RateLimiterRule = {
    windowMs: 60_000,
    max: 10,
}

const isLocalhost = (req: AuthRequest) =>
    req.ip === '::1' || req.ip === '::ffff:127.0.0.1' || req.ip === '127.0.0.1'

const getRateLimitKey = (req: AuthRequest) =>
    `rate-limiter:${req.ip}:${req.path}:${req.method}`

const setExpirationIfFirstRequest = async (key: string, windowMs: number) => {
    const count = await redis.incr(key)
    if (count === 1) {
        await redis.expire(key, windowMs / 1000)
    }
    return count
}

const checkRateLimitExceeded = (key: string, count: number, max: number) => {
    if (count > max) {
        logger.warn(`Rate limit exceeded: ${key}`)
        throw APIError.tooManyRequests()
    }
}

export const rateLimiterMiddleware = (rule: Partial<RateLimiterRule> = {}) => {
    const finalRule = { ...DEFAULT_RULE, ...rule }

    return async (req: AuthRequest, _res: Response, next: NextFunction) => {
        if (
            isLocalhost(req) &&
            config.environment === Environment.Development
        ) {
            next()
            return
        }

        const key = getRateLimitKey(req)
        const count = await setExpirationIfFirstRequest(key, finalRule.windowMs)
        checkRateLimitExceeded(key, count, finalRule.max)

        next()
    }
}
