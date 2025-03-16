/*************************
 *
 * Copyright 2025 @Qreater
 * Licensed under the Apache License, Version 2.0.
 * See: http://www.apache.org/licenses/LICENSE-2.0
 *
 *************************/

import express from 'express'

import validate from '../utils/middleware/validate'
import {
    registerSchema,
    loginSchema,
    verifyOTPSchema,
    lookupSchema,
    meSchema,
} from '../schema/user'
import { register, login, verifyOTP, lookup, me } from '../utils/user'
import { authMiddleware } from '../utils/middleware/auth'

const router = express.Router()

router.post('/register', validate(registerSchema), register)

router.post('/login', validate(loginSchema), login)

router.post('/verify-otp', validate(verifyOTPSchema), verifyOTP)

router.get('/lookup', validate(lookupSchema), lookup)

router.get('/me', authMiddleware, validate(meSchema), me)

export default router
