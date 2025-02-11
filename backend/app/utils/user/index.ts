/*************************
 *
 * Copyright 2025 @Qreater
 * Licensed under the Apache License, Version 2.0.
 * See: http://www.apache.org/licenses/LICENSE-2.0
 *
 *************************/

import { Request, Response } from 'express'

import {
    loginValidation,
    registerValidation,
    verifyOTPValidation,
    lookupValidation,
} from './validation'

import { AuthRequest } from '../interfaces/common'

import { loginCore, registerCore, verifyOTPCore, lookupCore } from './core'
import { responseHandler } from '../responses/base'
import { IUser } from '../../models/user'

export const register = async (request: Request, response: Response) => {
    const { username, email } = request.body

    await registerValidation(username, email)
    const result = await registerCore(username, email)

    return responseHandler<IUser>(request, response, {
        message: 'User Registered Successfully!',
        data: result,
    })
}

export const login = async (request: Request, response: Response) => {
    const { email } = request.body

    await loginValidation(email)
    await loginCore(email)

    return responseHandler(request, response, {
        message: 'OTP Sent Successfully!',
    })
}

export const verifyOTP = async (request: Request, response: Response) => {
    const { email, otp } = request.body

    await verifyOTPValidation(email, otp)
    const result = await verifyOTPCore(email, otp)

    return responseHandler(request, response, {
        message: 'OTP Verified Successfully!',
        data: result,
    })
}

export const lookup = async (request: Request, response: Response) => {
    const username = request.query.username as string
    const email = request.query.email as string

    await lookupValidation(username, email)
    await lookupCore(username, email)

    return responseHandler(request, response, {
        message: 'User Can Be Registered!',
    })
}

export const me = async (request: AuthRequest, response: Response) => {
    return responseHandler(request, response, {
        message: 'User Details Fetched',
        data: request.user,
    })
}
