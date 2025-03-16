/*************************
 *
 * Copyright 2025 @Qreater
 * Licensed under the Apache License, Version 2.0.
 * See: http://www.apache.org/licenses/LICENSE-2.0
 *
 *************************/

import jwt from 'jsonwebtoken'
import { Job, Queue, Worker } from 'bullmq'

import { createQueue, createWorker, redis } from '../database/redis'
import { createEntity, readEntity } from '../database/mongo'

import { IUserDocument, User } from '../../models/user'
import { APIError } from '../responses/error'
import { sendMail } from '../mailer'

import { config } from '../settings/config'
import { logger } from '../tools/logger'

/**
 * CORE Utility Functions
 *
 * These functions are the core utility functions that are used by the user module.
 *
 */

export const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000)
}

export const storeOTP = async (email: string, otp: string) => {
    await redis.setex(`bgls:otp:${email}:${otp}`, config.redisOtpExp, otp)
}

export const sendOTP = async (
    email: string,
    otp: string,
    username: string,
    expiry: number,
) => {
    await sendMail(
        email,
        '[Bingoals] A Login Attempt Was Made to Your Account',
        'otp_email',
        { otp: otp.split(''), otpString: otp, username, expiry: expiry / 60 },
    )
}

export const verifyOTP = async (email: string, otp: string) => {
    const key = `bgls:otp:${email}:${otp}`
    const storedOtp = await redis.get(key)

    if (storedOtp === otp.toString()) {
        await redis.del(key)
        return true
    }

    return false
}

export const generateToken = async (email: string) => {
    const user = await readEntity<IUserDocument>(User, { email })
    if (!user) {
        throw APIError.notFound('User', email)
    }

    const token = jwt.sign({ username: user.username }, config.jwtSecret, {
        expiresIn: '7d',
    })

    return token
}

/**
 * OTP Queue and Worker
 *
 * These functions are used to create the OTP Queue and Worker.
 * The OTP Queue and Worker are created only once and are reused.
 *
 */

let otpQueue: Queue
let otpWorker: Worker

export const getOTPQueue = async () => {
    if (!otpQueue) {
        otpQueue = await createQueue('bglsOtpQueue')
        logger.info('[RS-INFO] OTP Queue Started')
    }
    return otpQueue
}

export const getOTPWorker = async () => {
    if (!otpWorker) {
        otpWorker = await createWorker('bglsOtpQueue', processOTPJob)
        logger.info('[RS-INFO] OTP Worker Started')
    }
    return otpWorker
}

const processOTPJob = async (job: Job) => {
    const { email, otp, username, expiry } = job.data

    await storeOTP(email, otp)
    await sendOTP(email, otp.toString(), username, expiry)
}

/**
 * API Core Functions
 *
 * These functions are the core functions that are used by the user module.
 *
 */

export const registerCore = async (username: string, email: string) => {
    const user = await createEntity<IUserDocument>(User, {
        username,
        email,
    })

    return user
}

export const loginCore = async (email: string) => {
    const user = await readEntity<IUserDocument>(User, { email })
    const otp = generateOTP()

    await getOTPWorker()
    const otpQueueInstance = await getOTPQueue()

    await otpQueueInstance.add('otp', {
        email,
        otp,
        username: user ? user.username : 'User',
        expiry: config.redisOtpExp,
    })
    return
}

export const verifyOTPCore = async (email: string, otp: string) => {
    const isVerified = await verifyOTP(email, otp)

    if (!isVerified) {
        throw APIError.unauthorized()
    }

    const token = await generateToken(email)
    return { token }
}

export const lookupCore = async (_username: string, _email: string) => {}
