/*************************
 *
 * Copyright 2025 @Qreater
 * Licensed under the Apache License, Version 2.0.
 * See: http://www.apache.org/licenses/LICENSE-2.0
 *
 *************************/

import { APIError } from '../responses/error'
import { readEntity } from '../database/mongo'
import { User } from '../../models/user'

export const registerValidation = async (username: string, email: string) => {
    try {
        const result = await readEntity(User, {
            $or: [{ username }, { email }],
        })

        let entity, key

        if (!result) {
            return
        }

        if (result.username === username) {
            entity = 'Username'
            key = username
        } else {
            entity = 'Email'
            key = email
        }

        if (entity && key) {
            throw APIError.conflict(entity, key)
        }
    } catch (error: unknown) {
        if (error instanceof APIError && error.statusCode === 404) {
            return
        }
        throw error
    }
}

export const loginValidation = async (email: string) => {
    await readEntity(User, { email })
}

export const verifyOTPValidation = async (email: string, _otp: string) => {
    await loginValidation(email)
}

export const lookupValidation = async (username: string, email: string) => {
    await registerValidation(username, email)
}
